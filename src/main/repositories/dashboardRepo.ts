import { getDb } from '../db/client'
import { children, classrooms, attendance, payments, invoices, invoiceItems, guardians } from '../db/schema'
import { eq, and, sql, count, sum, gte, lte, isNull, ne, desc } from 'drizzle-orm'

export interface DashboardStats {
  totalChildren: number
  presentToday: number
  absentToday: number
  lateToday: number
  attendanceRate: number
  overdueInvoicesCount: number
  overdueAmountCents: number
  collectedThisMonthCents: number
  totalTargetThisMonthCents: number
  tuitionPercent: number
  lastBackupAt: string | null
}

export interface ClassroomAttendanceStat {
  id: string
  name: string
  capacity: number
  room: string | null
  totalChildren: number
  presentCount: number
  absentCount: number
  lateCount: number
  progressPercent: number
}

export interface RecentPayment {
  id: string
  receiptNumber: string
  childFirstName: string
  childLastName: string
  method: string
  amountCents: number
  paidAt: Date
  invoiceId: string
}

export interface BirthdaySoon {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  classroomName: string | null
  turnsAge: number
  daysUntil: number
}

export const dashboardRepo = {
  getStats(): DashboardStats {
    const db = getDb()
    const today = new Date().toISOString().slice(0, 10)
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-31`

    // Total active children
    const totalRow = (db as any).select({ v: count() })
      .from(children)
      .where(and(eq(children.status, 'active'), isNull(children.deletedAt)))
      .all()
    const totalChildren = Number(totalRow[0]?.v ?? 0)

    // Attendance today
    const attToday = (db as any).select({ status: attendance.status, cnt: count() })
      .from(attendance)
      .where(eq(attendance.date, today))
      .groupBy(attendance.status)
      .all()

    const attMap: Record<string, number> = {}
    for (const row of attToday) attMap[row.status] = Number(row.cnt)
    const presentToday = attMap['present'] ?? 0
    const absentToday = attMap['absent'] ?? 0
    const lateToday = attMap['late'] ?? 0
    const markedToday = presentToday + absentToday + lateToday + (attMap['excused'] ?? 0)
    const attendanceRate = markedToday > 0
      ? Math.round(((presentToday + lateToday) / markedToday) * 1000) / 10
      : 0

    // Overdue invoices (issued/partial, dueDate < today)
    const overdueRows = (db as any).select({ cnt: count(), total: sum(sql`${invoices.totalCents} - ${invoices.discountCents}`) })
      .from(invoices)
      .where(and(
        sql`${invoices.status} IN ('issued','partial')`,
        sql`${invoices.dueDate} < ${today}`,
        isNull(invoices.deletedAt)
      ))
      .all()
    const overdueInvoicesCount = Number(overdueRows[0]?.cnt ?? 0)
    const overdueAmountCents = Number(overdueRows[0]?.total ?? 0)

    // Collected this month
    const collectedRows = (db as any).select({ total: sum(payments.amountCents) })
      .from(payments)
      .where(and(
        sql`date(${payments.paidAt}/1000,'unixepoch') >= ${monthStart}`,
        sql`date(${payments.paidAt}/1000,'unixepoch') <= ${monthEnd}`
      ))
      .all()
    const collectedThisMonthCents = Number(collectedRows[0]?.total ?? 0)

    // Total target this month (issued/partial/paid invoices due this month)
    const targetRows = (db as any).select({ total: sum(sql`${invoices.totalCents} - ${invoices.discountCents}`) })
      .from(invoices)
      .where(and(
        ne(invoices.status, 'draft'),
        ne(invoices.status, 'void'),
        sql`${invoices.dueDate} >= ${monthStart}`,
        sql`${invoices.dueDate} <= ${monthEnd}`
      ))
      .all()
    const totalTargetThisMonthCents = Number(targetRows[0]?.total ?? 0)
    const tuitionPercent = totalTargetThisMonthCents > 0
      ? Math.round((collectedThisMonthCents / totalTargetThisMonthCents) * 100)
      : 0

    return {
      totalChildren,
      presentToday,
      absentToday,
      lateToday,
      attendanceRate,
      overdueInvoicesCount,
      overdueAmountCents,
      collectedThisMonthCents,
      totalTargetThisMonthCents,
      tuitionPercent,
      lastBackupAt: null // يُملأ من backup service
    }
  },

  getClassroomsAttendance(date?: string): ClassroomAttendanceStat[] {
    const db = getDb()
    const targetDate = date ?? new Date().toISOString().slice(0, 10)

    const cls = (db as any).select().from(classrooms).all() as any[]

    return cls.map((c: any) => {
      // Count children in this classroom
      const childrenRows = (db as any).select({ cnt: count() })
        .from(children)
        .where(and(eq(children.classroomId, c.id), eq(children.status, 'active'), isNull(children.deletedAt)))
        .all()
      const totalChildren = Number(childrenRows[0]?.cnt ?? 0)

      // Attendance for this classroom today
      const attRows = (db as any).select({ status: attendance.status, cnt: count() })
        .from(attendance)
        .innerJoin(children, eq(attendance.childId, children.id))
        .where(and(eq(attendance.date, targetDate), eq(children.classroomId, c.id)))
        .groupBy(attendance.status)
        .all()

      const attMap: Record<string, number> = {}
      for (const row of attRows) attMap[row.status] = Number(row.cnt)

      const presentCount = attMap['present'] ?? 0
      const absentCount = attMap['absent'] ?? 0
      const lateCount = attMap['late'] ?? 0
      const progressPercent = totalChildren > 0
        ? Math.round(((presentCount + lateCount) / totalChildren) * 1000) / 10
        : 0

      return {
        id: c.id,
        name: c.name,
        capacity: c.capacity,
        room: c.room ?? null,
        totalChildren,
        presentCount,
        absentCount,
        lateCount,
        progressPercent
      }
    })
  },

  getRecentPayments(limit = 10): RecentPayment[] {
    const db = getDb()
    const rows = (db as any).select({
      id: payments.id,
      receiptNumber: payments.receiptNumber,
      childFirstName: children.firstName,
      childLastName: children.lastName,
      method: payments.method,
      amountCents: payments.amountCents,
      paidAt: payments.paidAt,
      invoiceId: payments.invoiceId
    })
      .from(payments)
      .innerJoin(invoices, eq(payments.invoiceId, invoices.id))
      .innerJoin(children, eq(invoices.childId, children.id))
      .orderBy(desc(payments.paidAt))
      .limit(limit)
      .all()

    return rows
  },

  getBirthdaysSoon(withinDays = 7): BirthdaySoon[] {
    const db = getDb()
    const today = new Date()
    const results: BirthdaySoon[] = []

    // جلب كل الأطفال النشطين مع تاريخ ميلادهم
    const allChildren = (db as any).select({
      id: children.id,
      firstName: children.firstName,
      lastName: children.lastName,
      birthDate: children.birthDate,
      classroomId: children.classroomId
    })
      .from(children)
      .where(and(eq(children.status, 'active'), isNull(children.deletedAt)))
      .all() as any[]

    const classroomNames: Record<string, string> = {}
    const cls = (db as any).select({ id: classrooms.id, name: classrooms.name }).from(classrooms).all() as any[]
    for (const c of cls) classroomNames[c.id] = c.name

    for (const child of allChildren) {
      if (!child.birthDate) continue
      const [birthYear, birthMonth, birthDay] = child.birthDate.split('-').map(Number)
      const thisYearBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay)
      if (thisYearBirthday < today) thisYearBirthday.setFullYear(today.getFullYear() + 1)
      const diffMs = thisYearBirthday.getTime() - today.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays <= withinDays) {
        const turnsAge = thisYearBirthday.getFullYear() - birthYear
        results.push({
          id: child.id,
          firstName: child.firstName,
          lastName: child.lastName,
          birthDate: child.birthDate,
          classroomName: child.classroomId ? (classroomNames[child.classroomId] ?? null) : null,
          turnsAge,
          daysUntil: diffDays
        })
      }
    }

    results.sort((a, b) => a.daysUntil - b.daysUntil)
    return results
  },

  getInvoicesByChild(childId: string, status?: string) {
    const db = getDb()
    const conds: any[] = [eq(invoices.childId, childId), isNull(invoices.deletedAt)]
    if (status) conds.push(eq(invoices.status, status as any))

    const invs = (db as any).select().from(invoices).where(and(...conds))
      .orderBy(desc(invoices.dueDate)).all() as any[]

    return invs.map((inv) => {
      const paidRow = (db as any)
        .select({ total: sql<number>`coalesce(sum(${payments.amountCents}), 0)` })
        .from(payments)
        .where(eq(payments.invoiceId, inv.id))
        .all()
      const paidCents = Number(paidRow[0]?.total ?? 0)
      const netCents = Math.max(0, inv.totalCents - (inv.discountCents ?? 0))
      const remainingCents = Math.max(0, netCents - paidCents)

      const items = (db as any)
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, inv.id))
        .all()

      return {
        ...inv,
        paidCents,
        remainingCents,
        items
      }
    })
  }
}
