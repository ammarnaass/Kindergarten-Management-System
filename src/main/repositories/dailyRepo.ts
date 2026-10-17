import { getDb } from '../db/client'
import { dailyReports, dailyReportItems, children, attendance, classrooms, auditLogs } from '../db/schema'
import { eq, and, isNull, desc } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { DailyReportSave } from '@shared/schemas/daily'

export const dailyRepo = {
  get(childId: string, date: string) {
    const db = getDb() as any
    const report = db
      .select()
      .from(dailyReports)
      .where(and(eq(dailyReports.childId, childId), eq(dailyReports.date, date)))
      .all()[0]

    if (!report) return null

    const items = db
      .select()
      .from(dailyReportItems)
      .where(eq(dailyReportItems.reportId, report.id))
      .all()

    return {
      ...report,
      items
    }
  },

  save(input: DailyReportSave, userId?: string) {
    const db = getDb() as any

    return db.transaction((tx: any) => {
      const existing = tx
        .select()
        .from(dailyReports)
        .where(and(eq(dailyReports.childId, input.childId), eq(dailyReports.date, input.date)))
        .all()[0]

      let reportId = existing?.id

      if (existing) {
        tx.update(dailyReports)
          .set({
            mood: input.mood ?? null,
            summary: input.summary ?? null,
            updatedAt: new Date()
          })
          .where(eq(dailyReports.id, reportId))
          .run()

        tx.delete(dailyReportItems)
          .where(eq(dailyReportItems.reportId, reportId))
          .run()
      } else {
        reportId = randomUUID()
        tx.insert(dailyReports)
          .values({
            id: reportId,
            childId: input.childId,
            date: input.date,
            mood: input.mood ?? null,
            summary: input.summary ?? null
          })
          .run()
      }

      if (input.items && input.items.length > 0) {
        tx.insert(dailyReportItems)
          .values(
            input.items.map((i) => ({
              id: randomUUID(),
              reportId,
              category: i.category,
              value: i.value ?? null,
              note: i.note ?? null
            }))
          )
          .run()
      }

      tx.insert(auditLogs)
        .values({
          id: randomUUID(),
          userId: userId ?? null,
          action: 'daily_report.save',
          entityId: reportId,
          detail: `${input.date} (${input.childId})`
        })
        .run()

      const savedReport = tx
        .select()
        .from(dailyReports)
        .where(eq(dailyReports.id, reportId))
        .all()[0]

      const savedItems = tx
        .select()
        .from(dailyReportItems)
        .where(eq(dailyReportItems.reportId, reportId))
        .all()

      return {
        ...savedReport,
        items: savedItems
      }
    })
  },

  listByClassroom(classroomId: string, date: string) {
    const db = getDb() as any

    // 1. جلب أطفال الفصل النشطين
    const kids = db
      .select({
        id: children.id,
        firstName: children.firstName,
        lastName: children.lastName,
        allergies: children.allergies,
        medicalNotes: children.medicalNotes,
        photoPath: children.photoPath,
        classroomId: children.classroomId
      })
      .from(children)
      .where(and(eq(children.classroomId, classroomId), eq(children.status, 'active'), isNull(children.deletedAt)))
      .all()

    // 2. جلب سجلات الحضور لهذا اليوم
    const attMap: Record<string, any> = {}
    const attList = db
      .select()
      .from(attendance)
      .where(eq(attendance.date, date))
      .all()
    for (const a of attList) {
      attMap[a.childId] = a
    }

    // 3. جلب التقارير اليومية المسجلة
    const repMap: Record<string, any> = {}
    const repList = db
      .select()
      .from(dailyReports)
      .where(eq(dailyReports.date, date))
      .all()
    for (const r of repList) {
      repMap[r.childId] = r
    }

    return kids.map((k: any) => {
      const att = attMap[k.id]
      const rep = repMap[k.id]
      const attendanceStatus = att ? att.status : 'unknown'
      const isAbsent = attendanceStatus === 'absent' || attendanceStatus === 'excused'

      let reportStatus: 'completed' | 'in_progress' | 'pending' | 'absent' = 'pending'
      if (isAbsent) {
        reportStatus = 'absent'
      } else if (rep) {
        reportStatus = rep.summary ? 'completed' : 'in_progress'
      }

      return {
        ...k,
        attendanceStatus,
        reportStatus,
        reportId: rep?.id ?? null,
        mood: rep?.mood ?? null,
        summary: rep?.summary ?? null
      }
    })
  }
}
