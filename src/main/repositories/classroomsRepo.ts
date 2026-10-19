import { getDb } from '../db/client'
import { classrooms, classroomStaff, staff, children, attendance } from '../db/schema'
import { isNull, eq, and, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export interface ClassroomCreateInput {
  name: string
  capacity?: number
  room?: string | null
  teacherId?: string | null
  schoolYearId?: string | null
}

export interface ClassroomUpdateInput {
  name?: string
  capacity?: number
  room?: string | null
  teacherId?: string | null
}

export const classroomsRepo = {
  list(date?: string) {
    const db = getDb() as any
    const targetDate = date ?? new Date().toISOString().slice(0, 10)
    const cls = db.select().from(classrooms).where(isNull(classrooms.deletedAt)).all() as any[]

    // 1. Get teachers
    const staffRows = db
      .select({
        classroomId: classroomStaff.classroomId,
        staffId: classroomStaff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName
      })
      .from(classroomStaff)
      .innerJoin(staff, eq(classroomStaff.staffId, staff.id))
      .where(isNull(staff.deletedAt))
      .all() as any[]

    const teacherMap = new Map<string, { id: string; name: string }>()
    for (const s of staffRows) {
      teacherMap.set(s.classroomId, {
        id: s.staffId,
        name: `${s.firstName} ${s.lastName}`.trim()
      })
    }

    // 2. Count active children per classroom
    const childRows = db
      .select({
        classroomId: children.classroomId,
        cnt: sql<number>`count(*)`
      })
      .from(children)
      .where(and(eq(children.status, 'active'), isNull(children.deletedAt)))
      .groupBy(children.classroomId)
      .all() as any[]

    const countMap = new Map<string, number>()
    for (const r of childRows) {
      if (r.classroomId) countMap.set(r.classroomId, Number(r.cnt))
    }

    // 3. Attendance stats for today
    const attRows = db
      .select({
        classroomId: children.classroomId,
        status: attendance.status,
        cnt: sql<number>`count(*)`
      })
      .from(attendance)
      .innerJoin(children, eq(attendance.childId, children.id))
      .where(and(eq(attendance.date, targetDate), eq(children.status, 'active'), isNull(children.deletedAt)))
      .groupBy(children.classroomId, attendance.status)
      .all() as any[]

    const attMap = new Map<string, { present: number; absent: number; late: number; excused: number }>()
    for (const r of attRows) {
      if (!r.classroomId) continue
      if (!attMap.has(r.classroomId)) {
        attMap.set(r.classroomId, { present: 0, absent: 0, late: 0, excused: 0 })
      }
      const item = attMap.get(r.classroomId)!
      const c = Number(r.cnt)
      if (r.status === 'present') item.present += c
      else if (r.status === 'absent') item.absent += c
      else if (r.status === 'late') item.late += c
      else if (r.status === 'excused') item.excused += c
    }

    return cls.map((c) => {
      const teacher = teacherMap.get(c.id) ?? null
      const totalChildren = countMap.get(c.id) ?? 0
      const att = attMap.get(c.id) ?? { present: 0, absent: 0, late: 0, excused: 0 }
      const progressPercent = totalChildren > 0
        ? Math.round(((att.present + att.late) / totalChildren) * 1000) / 10
        : 0

      return {
        id: c.id,
        name: c.name,
        capacity: c.capacity ?? 20,
        room: c.room ?? null,
        schoolYearId: c.schoolYearId ?? null,
        teacher,
        totalChildren,
        presentCount: att.present,
        absentCount: att.absent + att.excused,
        lateCount: att.late,
        progressPercent,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }
    })
  },

  getById(id: string) {
    const db = getDb() as any
    const rows = db.select().from(classrooms).where(eq(classrooms.id, id)).all()
    const c = rows[0]
    if (!c) return null

    const teacherRow = db
      .select({
        staffId: classroomStaff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName
      })
      .from(classroomStaff)
      .innerJoin(staff, eq(classroomStaff.staffId, staff.id))
      .where(eq(classroomStaff.classroomId, id))
      .all()[0]

    return {
      ...c,
      teacher: teacherRow ? { id: teacherRow.staffId, name: `${teacherRow.firstName} ${teacherRow.lastName}`.trim() } : null
    }
  },

  create(data: ClassroomCreateInput) {
    const db = getDb() as any
    const id = randomUUID()
    db.insert(classrooms).values({
      id,
      name: data.name,
      capacity: data.capacity ?? 20,
      room: data.room ?? null,
      schoolYearId: data.schoolYearId ?? null
    }).run()

    if (data.teacherId) {
      db.insert(classroomStaff).values({
        classroomId: id,
        staffId: data.teacherId,
        role: 'teacher'
      }).run()
    }

    return this.getById(id)
  },

  update(id: string, data: ClassroomUpdateInput) {
    const db = getDb() as any
    const sets: any = { updatedAt: new Date().toISOString() }
    if (data.name !== undefined) sets.name = data.name
    if (data.capacity !== undefined) sets.capacity = data.capacity
    if (data.room !== undefined) sets.room = data.room

    db.update(classrooms).set(sets).where(eq(classrooms.id, id)).run()

    if (data.teacherId !== undefined) {
      db.delete(classroomStaff).where(eq(classroomStaff.classroomId, id)).run()
      if (data.teacherId) {
        db.insert(classroomStaff).values({
          classroomId: id,
          staffId: data.teacherId,
          role: 'teacher'
        }).run()
      }
    }

    return this.getById(id)
  },

  delete(id: string) {
    const db = getDb() as any
    db.update(classrooms).set({ deletedAt: new Date() }).where(eq(classrooms.id, id)).run()
    db.delete(classroomStaff).where(eq(classroomStaff.classroomId, id)).run()
    db.update(children).set({ classroomId: null }).where(eq(children.classroomId, id)).run()
    return true
  }
}

