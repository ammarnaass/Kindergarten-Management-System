import { getDb } from '../db/client'
import { staff, staffAttendance, leaves, auditLogs, classroomStaff, payrollEntries } from '../db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type {
  StaffCreateInput,
  StaffUpdateInput,
  StaffFilterInput,
  StaffAttendanceRecordInput,
  StaffAttendanceBatchInput,
  LeaveCreateInput
} from '@shared/schemas/staff'

export const staffRepo = {
  getStats(date?: string) {
    const db = getDb() as any
    const targetDate = date ?? new Date().toISOString().slice(0, 10)

    // Total active staff
    const totalRows = db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`sum(case when ${staff.isActive} = 1 then 1 else 0 end)`,
        payrollTotal: sql<number>`sum(case when ${staff.isActive} = 1 then ${staff.salaryCents} else 0 end)`
      })
      .from(staff)
      .all()

    const totalCount = Number(totalRows[0]?.total ?? 0)
    const activeCount = Number(totalRows[0]?.active ?? 0)
    const payrollCents = Number(totalRows[0]?.payrollTotal ?? 0)

    // Attendance today
    const attRows = db
      .select({
        present: sql<number>`sum(case when ${staffAttendance.status} = 'present' then 1 else 0 end)`,
        late: sql<number>`sum(case when ${staffAttendance.status} = 'late' then 1 else 0 end)`,
        absent: sql<number>`sum(case when ${staffAttendance.status} = 'absent' then 1 else 0 end)`,
        excused: sql<number>`sum(case when ${staffAttendance.status} = 'excused' then 1 else 0 end)`
      })
      .from(staffAttendance)
      .where(eq(staffAttendance.date, targetDate))
      .all()

    const presentCount = Number(attRows[0]?.present ?? 0)
    const lateCount = Number(attRows[0]?.late ?? 0)
    const absentCount = Number(attRows[0]?.absent ?? 0)
    const excusedCount = Number(attRows[0]?.excused ?? 0)

    // Active leaves today
    const leaveRows = db
      .select({ cnt: sql<number>`count(*)` })
      .from(leaves)
      .where(and(
        eq(leaves.status, 'approved'),
        sql`${leaves.fromDate} <= ${targetDate} AND ${leaves.toDate} >= ${targetDate}`
      ))
      .all()

    const activeLeavesCount = Number(leaveRows[0]?.cnt ?? 0)

    return {
      targetDate,
      totalCount,
      activeCount,
      payrollCents,
      presentCount,
      lateCount,
      absentCount,
      excusedCount,
      activeLeavesCount
    }
  },

  list(filter?: StaffFilterInput) {
    const db = getDb() as any
    const conds: any[] = []

    if (filter?.role) {
      conds.push(eq(staff.role, filter.role))
    }
    if (typeof filter?.isActive === 'boolean') {
      conds.push(eq(staff.isActive, filter.isActive))
    }
    if (filter?.search) {
      const term = `%${filter.search.trim()}%`
      conds.push(
        sql`(${staff.firstName} LIKE ${term} OR ${staff.lastName} LIKE ${term} OR ${staff.phone} LIKE ${term} OR ${staff.role} LIKE ${term})`
      )
    }

    const query = db.select().from(staff)
    if (conds.length > 0) {
      query.where(and(...conds))
    }

    return query.orderBy(staff.firstName, staff.lastName).all()
  },

  getById(id: string) {
    const db = getDb() as any
    const rows = db.select().from(staff).where(eq(staff.id, id)).all()
    const member = rows[0] ?? null
    if (!member) return null

    // Get last 30 attendance records
    const recentAttendance = db
      .select()
      .from(staffAttendance)
      .where(eq(staffAttendance.staffId, id))
      .orderBy(desc(staffAttendance.date))
      .limit(30)
      .all()

    // Get leaves
    const memberLeaves = db
      .select()
      .from(leaves)
      .where(eq(leaves.staffId, id))
      .orderBy(desc(leaves.fromDate))
      .limit(20)
      .all()

    return {
      ...member,
      recentAttendance,
      leaves: memberLeaves
    }
  },

  create(input: StaffCreateInput, userId?: string) {
    const db = getDb() as any
    const id = randomUUID()
    const now = Math.floor(Date.now() / 1000)

    const record = {
      id,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      phone: input.phone ?? null,
      email: input.email || null,
      salaryCents: input.salaryCents ?? 0,
      hiredAt: input.hiredAt ?? null,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now
    }

    db.insert(staff).values(record).run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'staff:created',
        entityId: id,
        detail: JSON.stringify({ name: `${input.firstName} ${input.lastName}`, role: input.role })
      })
      .run()

    return record
  },

  update(input: StaffUpdateInput, userId?: string) {
    const db = getDb() as any
    const now = Math.floor(Date.now() / 1000)

    const updates: any = { updatedAt: now }
    if (input.firstName !== undefined) updates.firstName = input.firstName
    if (input.lastName !== undefined) updates.lastName = input.lastName
    if (input.role !== undefined) updates.role = input.role
    if (input.phone !== undefined) updates.phone = input.phone
    if (input.email !== undefined) updates.email = input.email || null
    if (input.salaryCents !== undefined) updates.salaryCents = input.salaryCents
    if (input.hiredAt !== undefined) updates.hiredAt = input.hiredAt
    if (input.isActive !== undefined) updates.isActive = input.isActive

    db.update(staff).set(updates).where(eq(staff.id, input.id)).run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'staff:updated',
        entityId: input.id,
        detail: JSON.stringify(updates)
      })
      .run()

    return this.getById(input.id)
  },

  delete(id: string, userId?: string): boolean {
    const db = getDb() as any
    const existing = db.select().from(staff).where(eq(staff.id, id)).get()
    if (!existing) return false

    // Clean up dependent records
    db.delete(classroomStaff).where(eq(classroomStaff.staffId, id)).run()
    db.delete(staffAttendance).where(eq(staffAttendance.staffId, id)).run()
    db.delete(leaves).where(eq(leaves.staffId, id)).run()
    db.delete(payrollEntries).where(eq(payrollEntries.staffId, id)).run()

    // Delete staff member
    db.delete(staff).where(eq(staff.id, id)).run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'staff:deleted',
        entityId: id,
        detail: JSON.stringify({ name: `${existing.firstName} ${existing.lastName}`, role: existing.role })
      })
      .run()

    return true
  },

  listAttendance(date: string) {
    const db = getDb() as any
    const targetDate = date || new Date().toISOString().slice(0, 10)

    // Select all active staff and their attendance record for targetDate
    const rows = db
      .select({
        staffId: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        phone: staff.phone,
        isActive: staff.isActive,
        attendanceId: staffAttendance.id,
        date: staffAttendance.date,
        status: staffAttendance.status,
        note: staffAttendance.note
      })
      .from(staff)
      .leftJoin(
        staffAttendance,
        and(eq(staffAttendance.staffId, staff.id), eq(staffAttendance.date, targetDate))
      )
      .where(eq(staff.isActive, true))
      .orderBy(staff.firstName, staff.lastName)
      .all()

    return {
      date: targetDate,
      items: rows.map((r: any) => ({
        staffId: r.staffId,
        firstName: r.firstName,
        lastName: r.lastName,
        role: r.role,
        phone: r.phone,
        attendanceId: r.attendanceId ?? null,
        date: targetDate,
        status: r.status ?? null, // null means not recorded yet
        note: r.note ?? null
      }))
    }
  },

  recordAttendance(record: StaffAttendanceRecordInput) {
    const db = getDb() as any
    const now = Math.floor(Date.now() / 1000)

    const existing = db
      .select()
      .from(staffAttendance)
      .where(and(eq(staffAttendance.staffId, record.staffId), eq(staffAttendance.date, record.date)))
      .all()

    if (existing.length > 0) {
      db.update(staffAttendance)
        .set({
          status: record.status,
          note: record.note ?? null,
          updatedAt: now
        })
        .where(eq(staffAttendance.id, existing[0].id))
        .run()

      return { id: existing[0].id, ...record }
    } else {
      const id = randomUUID()
      db.insert(staffAttendance)
        .values({
          id,
          staffId: record.staffId,
          date: record.date,
          status: record.status,
          note: record.note ?? null,
          createdAt: now,
          updatedAt: now
        })
        .run()

      return { id, ...record }
    }
  },

  batchRecordAttendance(batch: StaffAttendanceBatchInput) {
    const db = getDb() as any
    const results: any[] = []

    for (const rec of batch.records) {
      const res = this.recordAttendance({
        staffId: rec.staffId,
        date: batch.date,
        status: rec.status,
        note: rec.note
      })
      results.push(res)
    }

    return results
  },

  listLeaves(staffId?: string) {
    const db = getDb() as any
    const query = db
      .select({
        id: leaves.id,
        staffId: leaves.staffId,
        staffFirstName: staff.firstName,
        staffLastName: staff.lastName,
        staffRole: staff.role,
        fromDate: leaves.fromDate,
        toDate: leaves.toDate,
        reason: leaves.reason,
        status: leaves.status,
        createdAt: leaves.createdAt
      })
      .from(leaves)
      .innerJoin(staff, eq(leaves.staffId, staff.id))

    if (staffId) {
      query.where(eq(leaves.staffId, staffId))
    }

    return query.orderBy(desc(leaves.fromDate)).all()
  },

  createLeave(input: LeaveCreateInput, userId?: string) {
    const db = getDb() as any
    const id = randomUUID()
    const now = Math.floor(Date.now() / 1000)

    const record = {
      id,
      staffId: input.staffId,
      fromDate: input.fromDate,
      toDate: input.toDate,
      reason: input.reason ?? null,
      status: input.status ?? 'pending',
      createdAt: now,
      updatedAt: now
    }

    db.insert(leaves).values(record).run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'staff:leave_created',
        entityId: id,
        detail: JSON.stringify({ staffId: input.staffId, from: input.fromDate, to: input.toDate })
      })
      .run()

    return record
  },

  updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected' | 'pending', userId?: string) {
    const db = getDb() as any
    const now = Math.floor(Date.now() / 1000)

    db.update(leaves)
      .set({ status, updatedAt: now })
      .where(eq(leaves.id, leaveId))
      .run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'staff:leave_status_updated',
        entityId: leaveId,
        detail: JSON.stringify({ status })
      })
      .run()

    return { id: leaveId, status }
  }
}
