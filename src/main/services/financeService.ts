import { getDb } from '../db/client'
import { invoices, invoiceItems, payments, sequences, auditLogs, feeTypes, children, classrooms } from '../db/schema'
import { eq, sql, and, or, like, desc, isNull } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { InvoiceCreate, PaymentCreate, InvoiceFilter, MonthlyBilling } from '@shared/schemas/finance'

function nextSequence(tx: any, name: string, prefix: string): string {
  const rows = tx.select().from(sequences).where(eq(sequences.name, name)).all()
  const last = rows[0]?.lastValue ?? 0
  const next = last + 1
  if (rows.length === 0) tx.insert(sequences).values({ name, lastValue: next, prefix }).run()
  else tx.update(sequences).set({ lastValue: next }).where(eq(sequences.name, name)).run()
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(next).padStart(6, '0')}`
}

export const financeService = {
  list(filter?: InvoiceFilter) {
    const db = getDb() as any
    const today = new Date().toISOString().slice(0, 10)
    const status = filter?.status ?? 'all'
    const search = filter?.search?.trim() ?? ''
    const period = filter?.period
    const classroomId = filter?.classroomId
    const limit = filter?.limit ?? 50
    const offset = filter?.offset ?? 0

    const conditions: any[] = [isNull(invoices.deletedAt), isNull(children.deletedAt)]

    if (status === 'overdue') {
      conditions.push(sql`${invoices.status} IN ('issued', 'partial') AND ${invoices.dueDate} < ${today}`)
    } else if (status && status !== 'all') {
      conditions.push(eq(invoices.status, status))
    }

    if (period) {
      conditions.push(eq(invoices.period, period))
    }

    if (classroomId) {
      conditions.push(eq(children.classroomId, classroomId))
    }

    if (search) {
      const s = `%${search}%`
      conditions.push(
        or(
          like(invoices.number, s),
          like(children.firstName, s),
          like(children.lastName, s),
          sql`${children.firstName} || ' ' || ${children.lastName} LIKE ${s}`
        )
      )
    }

    const whereClause = and(...conditions)

    const countRows = db
      .select({ cnt: sql<number>`count(*)` })
      .from(invoices)
      .innerJoin(children, eq(invoices.childId, children.id))
      .where(whereClause)
      .all()
    const total = Number(countRows[0]?.cnt ?? 0)

    const rows = db
      .select({
        id: invoices.id,
        number: invoices.number,
        childId: invoices.childId,
        childFirstName: children.firstName,
        childLastName: children.lastName,
        childPhotoPath: children.photoPath,
        classroomId: children.classroomId,
        classroomName: classrooms.name,
        period: invoices.period,
        totalCents: invoices.totalCents,
        discountCents: invoices.discountCents,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .innerJoin(children, eq(invoices.childId, children.id))
      .leftJoin(classrooms, eq(children.classroomId, classrooms.id))
      .where(whereClause)
      .orderBy(desc(invoices.createdAt))
      .limit(limit)
      .offset(offset)
      .all()

    const items = rows.map((inv: any) => {
      const paidRows = db
        .select({ total: sql<number>`coalesce(sum(${payments.amountCents}), 0)` })
        .from(payments)
        .where(eq(payments.invoiceId, inv.id))
        .all()
      const paidCents = Number(paidRows[0]?.total ?? 0)
      const netCents = inv.totalCents - (inv.discountCents ?? 0)
      const remainingCents = Math.max(0, netCents - paidCents)
      const isOverdue = (inv.status === 'issued' || inv.status === 'partial') && inv.dueDate < today

      return {
        ...inv,
        netCents,
        paidCents,
        remainingCents,
        isOverdue
      }
    })

    return { items, total, limit, offset }
  },

  getById(id: string) {
    const db = getDb() as any
    const inv = db
      .select({
        id: invoices.id,
        number: invoices.number,
        childId: invoices.childId,
        childFirstName: children.firstName,
        childLastName: children.lastName,
        childPhotoPath: children.photoPath,
        classroomName: classrooms.name,
        period: invoices.period,
        totalCents: invoices.totalCents,
        discountCents: invoices.discountCents,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .innerJoin(children, eq(invoices.childId, children.id))
      .leftJoin(classrooms, eq(children.classroomId, classrooms.id))
      .where(and(eq(invoices.id, id), isNull(invoices.deletedAt)))
      .all()[0]

    if (!inv) return null

    const items = db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id))
      .all()

    const paymentsList = db
      .select()
      .from(payments)
      .where(eq(payments.invoiceId, id))
      .orderBy(desc(payments.paidAt))
      .all()

    const paidCents = paymentsList.reduce((acc: number, p: any) => acc + p.amountCents, 0)
    const netCents = inv.totalCents - (inv.discountCents ?? 0)
    const remainingCents = Math.max(0, netCents - paidCents)

    return {
      ...inv,
      netCents,
      paidCents,
      remainingCents,
      items,
      payments: paymentsList
    }
  },

  generateMonthly(input: MonthlyBilling, userId?: string) {
    const db = getDb() as any
    const childConds: any[] = [
      eq(children.status, 'active'),
      isNull(children.deletedAt)
    ]
    if (input.classroomId) {
      childConds.push(eq(children.classroomId, input.classroomId))
    }

    const activeChildren = db
      .select({ id: children.id, firstName: children.firstName, lastName: children.lastName })
      .from(children)
      .where(and(...childConds))
      .all() as any[]

    return db.transaction((tx: any) => {
      let generatedCount = 0
      let skippedCount = 0
      let totalCents = 0

      for (const child of activeChildren) {
        const existing = tx
          .select({ id: invoices.id })
          .from(invoices)
          .where(and(
            eq(invoices.childId, child.id),
            eq(invoices.period, input.period),
            isNull(invoices.deletedAt),
            sql`${invoices.status} != 'void'`
          ))
          .all()

        if (existing.length > 0) {
          skippedCount++
          continue
        }

        const id = randomUUID()
        const number = nextSequence(tx, 'invoice', 'INV')
        tx.insert(invoices).values({
          id,
          number,
          childId: child.id,
          period: input.period,
          totalCents: input.unitCents,
          discountCents: 0,
          dueDate: input.dueDate,
          status: 'issued',
        }).run()

        tx.insert(invoiceItems).values({
          id: randomUUID(),
          invoiceId: id,
          label: input.label,
          quantity: 1,
          unitCents: input.unitCents,
        }).run()

        tx.insert(auditLogs).values({
          id: randomUUID(),
          userId: userId ?? null,
          action: 'invoice.generate_monthly',
          entityId: id,
          detail: `${number} (${child.firstName} ${child.lastName})`,
        }).run()

        generatedCount++
        totalCents += input.unitCents
      }

      return {
        generatedCount,
        skippedCount,
        totalCents,
        period: input.period
      }
    })
  },

  createDraft(input: InvoiceCreate) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const id = randomUUID()
      const total = input.items.reduce((s, i) => s + i.quantity * i.unitCents, 0)
      const number = `DRAFT-${id.slice(0, 8)}`
      tx.insert(invoices).values({
        id,
        number,
        childId: input.childId,
        period: input.period ?? null,
        totalCents: total,
        discountCents: input.discountCents ?? 0,
        dueDate: input.dueDate,
        status: 'draft',
      }).run()

      tx.insert(invoiceItems).values(
        input.items.map((i) => ({
          id: randomUUID(),
          invoiceId: id,
          feeTypeId: i.feeTypeId ?? null,
          label: i.label,
          quantity: i.quantity,
          unitCents: i.unitCents,
        }))
      ).run()

      return tx.select().from(invoices).where(eq(invoices.id, id)).all()[0]
    })
  },

  issue(id: string, userId?: string) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const number = nextSequence(tx, 'invoice', 'INV')
      tx.update(invoices).set({ number, status: 'issued', updatedAt: new Date() }).where(eq(invoices.id, id)).run()
      tx.insert(auditLogs).values({ id: randomUUID(), userId: userId ?? null, action: 'invoice.issue', entityId: id, detail: number }).run()
      return tx.select().from(invoices).where(eq(invoices.id, id)).all()[0]
    })
  },

  createAndIssue(input: InvoiceCreate, userId?: string) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const id = randomUUID()
      const number = nextSequence(tx, 'invoice', 'INV')
      const total = input.items.reduce((s, i) => s + i.quantity * i.unitCents, 0)

      tx.insert(invoices).values({
        id,
        number,
        childId: input.childId,
        period: input.period ?? null,
        totalCents: total,
        discountCents: input.discountCents ?? 0,
        dueDate: input.dueDate,
        status: 'issued',
      }).run()

      tx.insert(invoiceItems).values(
        input.items.map((i) => ({
          id: randomUUID(),
          invoiceId: id,
          feeTypeId: i.feeTypeId ?? null,
          label: i.label,
          quantity: i.quantity,
          unitCents: i.unitCents,
        }))
      ).run()

      tx.insert(auditLogs).values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'invoice.create_and_issue',
        entityId: id,
        detail: number,
      }).run()

      return tx.select().from(invoices).where(eq(invoices.id, id)).all()[0]
    })
  },

  recordPayment(input: PaymentCreate, userId?: string) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const receipt = nextSequence(tx, 'receipt', 'REC')
      const id = randomUUID()
      const paidDate = input.paidAt ? new Date(input.paidAt) : new Date()

      tx.insert(payments).values({
        id,
        invoiceId: input.invoiceId,
        amountCents: input.amountCents,
        method: input.method,
        paidAt: paidDate,
        receiptNumber: receipt,
        recordedBy: userId ?? null,
      }).run()

      const inv = tx.select().from(invoices).where(eq(invoices.id, input.invoiceId)).all()[0]
      if (!inv) throw new Error('الفاتورة المحددة غير موجودة')

      const paidRows = tx
        .select({ total: sql<number>`coalesce(sum(${payments.amountCents}),0)` })
        .from(payments)
        .where(eq(payments.invoiceId, input.invoiceId))
        .all()

      const paid = Number(paidRows[0]?.total ?? 0)
      const net = inv.totalCents - (inv.discountCents ?? 0)
      const status = paid >= net ? 'paid' : paid > 0 ? 'partial' : inv.status

      tx.update(invoices).set({ status, updatedAt: new Date() }).where(eq(invoices.id, input.invoiceId)).run()
      tx.insert(auditLogs).values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'payment.record',
        entityId: id,
        detail: receipt,
      }).run()

      return {
        id,
        receiptNumber: receipt,
        status,
        amountCents: input.amountCents,
        paidAt: paidDate,
        invoiceNumber: inv.number,
      }
    })
  },

  listFeeTypes() {
    const db = getDb() as any
    return db.select().from(feeTypes).where(eq(feeTypes.isActive, true)).all()
  }
}
