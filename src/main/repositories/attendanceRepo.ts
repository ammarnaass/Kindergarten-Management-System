import { getDb } from '../db/client'
import { attendance } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export interface AttendanceEntry { childId: string; status: 'present'|'absent'|'late'|'excused'; checkInAt?: number|null; checkOutAt?: number|null; pickedUpBy?: string|null; note?: string|null }

export const attendanceRepo = {
  markDay(date: string, entries: AttendanceEntry[], recordedBy?: string) {
    const db = getDb() as any
    const sqlite = (getDb() as any)._session ?? null
    // use transaction via drizzle
    return (getDb() as any).transaction((tx: any) => {
      for (const e of entries) {
        const existing = tx.select().from(attendance).where(and(eq(attendance.childId, e.childId), eq(attendance.date, date))).all()
        if (existing.length > 0) {
          tx.update(attendance).set({ status: e.status, checkInAt: e.checkInAt ? new Date(e.checkInAt) : null, checkOutAt: e.checkOutAt ? new Date(e.checkOutAt) : null, pickedUpBy: e.pickedUpBy ?? null, note: e.note ?? null, recordedBy: recordedBy ?? null, updatedAt: new Date() }).where(eq(attendance.id, existing[0].id)).run()
        } else {
          tx.insert(attendance).values({ id: randomUUID(), childId: e.childId, date, status: e.status, checkInAt: e.checkInAt ? new Date(e.checkInAt) : null, checkOutAt: e.checkOutAt ? new Date(e.checkOutAt) : null, pickedUpBy: e.pickedUpBy ?? null, note: e.note ?? null, recordedBy: recordedBy ?? null }).run()
        }
      }
      return { date, count: entries.length }
    })()
  },
  list(filter: { date?: string; from?: string; to?: string; childId?: string|null }) {
    const db = getDb() as any
    const conds: any[] = []
    if (filter.date) conds.push(eq(attendance.date, filter.date))
    if (filter.childId) conds.push(eq(attendance.childId, filter.childId))
    const where = conds.length ? and(...conds) : undefined
    let q = db.select().from(attendance)
    if (where) q = (db.select().from(attendance).where(where) as any)
    return (where ? db.select().from(attendance).where(where) : db.select().from(attendance)).all()
  }
}
