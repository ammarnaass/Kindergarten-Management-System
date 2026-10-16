import { getDb } from '../db/client'
import { invoices, invoiceItems, payments, sequences, auditLogs } from '../db/schema'
import { eq, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { InvoiceCreate, PaymentCreate } from '@shared/schemas/finance'

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
  createDraft(input: InvoiceCreate) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const id = randomUUID()
      const total = input.items.reduce((s, i) => s + i.quantity * i.unitCents, 0)
      const number = `DRAFT-${id.slice(0, 8)}`
      tx.insert(invoices).values({ id, number, childId: input.childId, period: input.period ?? null, totalCents: total, discountCents: input.discountCents ?? 0, dueDate: input.dueDate, status: 'draft' }).run()
      tx.insert(invoiceItems).values(input.items.map((i) => ({ id: randomUUID(), invoiceId: id, feeTypeId: i.feeTypeId ?? null, label: i.label, quantity: i.quantity, unitCents: i.unitCents }))).run()
      return tx.select().from(invoices).where(eq(invoices.id, id)).all()[0]
    })()
  },
  issue(id: string, userId?: string) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const number = nextSequence(tx, 'invoice', 'INV')
      tx.update(invoices).set({ number, status: 'issued', updatedAt: new Date() }).where(eq(invoices.id, id)).run()
      tx.insert(auditLogs).values({ id: randomUUID(), userId: userId ?? null, action: 'invoice.issue', entityId: id, detail: number }).run()
      return tx.select().from(invoices).where(eq(invoices.id, id)).all()[0]
    })()
  },
  recordPayment(input: PaymentCreate, userId?: string) {
    const db = getDb() as any
    return db.transaction((tx: any) => {
      const receipt = nextSequence(tx, 'receipt', 'REC')
      const id = randomUUID()
      tx.insert(payments).values({ id, invoiceId: input.invoiceId, amountCents: input.amountCents, method: input.method, paidAt: input.paidAt ? new Date(input.paidAt) : new Date(), receiptNumber: receipt, recordedBy: userId ?? null }).run()
      const inv = tx.select().from(invoices).where(eq(invoices.id, input.invoiceId)).all()[0]
      const paidRows = tx.select({ total: sql<number>`coalesce(sum(${payments.amountCents}),0)` }).from(payments).where(eq(payments.invoiceId, input.invoiceId)).all()
      const paid = Number(paidRows[0]?.total ?? 0)
      const net = (inv.totalCents - (inv.discountCents ?? 0))
      const status = paid >= net ? 'paid' : paid > 0 ? 'partial' : inv.status
      tx.update(invoices).set({ status, updatedAt: new Date() }).where(eq(invoices.id, input.invoiceId)).run()
      tx.insert(auditLogs).values({ id: randomUUID(), userId: userId ?? null, action: 'payment.record', entityId: id, detail: receipt }).run()
      return { id, receiptNumber: receipt, status }
    })()
  }
}
