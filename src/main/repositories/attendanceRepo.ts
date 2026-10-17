import { getDb } from '../db/client'
import { attendance, children } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export interface AttendanceEntry {
  childId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  checkInAt?: number | null
  checkOutAt?: number | null
  pickedUpBy?: string | null
  note?: string | null
}

export const attendanceRepo = {
  markDay(date: string, entries: AttendanceEntry[], recordedBy?: string) {
    const db = getDb() as any
    // Execute atomic transaction for the entire batch
    return db.transaction((tx: any) => {
      for (const e of entries) {
        const existing = tx
          .select()
          .from(attendance)
          .where(and(eq(attendance.childId, e.childId), eq(attendance.date, date)))
          .all()

        const checkIn = e.checkInAt
          ? new Date(e.checkInAt)
          : e.status === 'present' || e.status === 'late'
            ? new Date()
            : null

        if (existing.length > 0) {
          tx.update(attendance)
            .set({
              status: e.status,
              checkInAt: checkIn,
              checkOutAt: e.checkOutAt ? new Date(e.checkOutAt) : null,
              pickedUpBy: e.pickedUpBy ?? null,
              note: e.note ?? null,
              recordedBy: recordedBy ?? null,
              updatedAt: new Date(),
            })
            .where(eq(attendance.id, existing[0].id))
            .run()
        } else {
          tx.insert(attendance)
            .values({
              id: randomUUID(),
              childId: e.childId,
              date,
              status: e.status,
              checkInAt: checkIn,
              checkOutAt: e.checkOutAt ? new Date(e.checkOutAt) : null,
              pickedUpBy: e.pickedUpBy ?? null,
              note: e.note ?? null,
              recordedBy: recordedBy ?? null,
            })
            .run()
        }
      }
      return { date, count: entries.length }
    })
  },

  list(filter: { date?: string; from?: string; to?: string; childId?: string | null; classroomId?: string | null }) {
    const db = getDb() as any
    const conds: any[] = []

    if (filter.date) {
      conds.push(eq(attendance.date, filter.date))
    }
    if (filter.childId) {
      conds.push(eq(attendance.childId, filter.childId))
    }

    if (filter.classroomId) {
      // Filter by classroom by joining children
      const where = conds.length ? and(...conds, eq(children.classroomId, filter.classroomId)) : eq(children.classroomId, filter.classroomId)
      return db
        .select({
          id: attendance.id,
          childId: attendance.childId,
          date: attendance.date,
          status: attendance.status,
          checkInAt: attendance.checkInAt,
          checkOutAt: attendance.checkOutAt,
          pickedUpBy: attendance.pickedUpBy,
          recordedBy: attendance.recordedBy,
          note: attendance.note,
          createdAt: attendance.createdAt,
          updatedAt: attendance.updatedAt,
        })
        .from(attendance)
        .innerJoin(children, eq(attendance.childId, children.id))
        .where(where)
        .all()
    }

    const where = conds.length ? and(...conds) : undefined
    return (where ? db.select().from(attendance).where(where) : db.select().from(attendance)).all()
  },
}
