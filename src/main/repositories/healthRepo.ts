import { getDb } from '../db/client'
import { healthRecords, incidents, medicationsLog, children, classrooms, auditLogs } from '../db/schema'
import { eq, and, desc, isNull, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { ClinicVisitCreate, IncidentCreate, MedicationLogCreate, HealthFilter } from '@shared/schemas/health'

export const healthRepo = {
  getStats(date?: string) {
    const db = getDb() as any
    const targetDate = date ?? new Date().toISOString().slice(0, 10)

    const allergyRows = db
      .select({ cnt: sql<number>`count(*)` })
      .from(children)
      .where(and(
        eq(children.status, 'active'),
        isNull(children.deletedAt),
        sql`${children.allergies} IS NOT NULL AND length(trim(${children.allergies})) > 0`
      ))
      .all()
    const criticalAllergiesCount = Number(allergyRows[0]?.cnt ?? 0)

    const medRows = db
      .select({ cnt: sql<number>`count(*)` })
      .from(medicationsLog)
      .where(sql`substr(${medicationsLog.givenAt}, 1, 10) = ${targetDate}`)
      .all()
    const medicationsTodayCount = Number(medRows[0]?.cnt ?? 0)

    const visitRows = db
      .select({ cnt: sql<number>`count(*)` })
      .from(healthRecords)
      .where(sql`substr(${healthRecords.recordedOn}, 1, 10) = ${targetDate}`)
      .all()
    const clinicVisitsTodayCount = Number(visitRows[0]?.cnt ?? 0)

    const incRows = db
      .select({ cnt: sql<number>`count(*)` })
      .from(incidents)
      .where(sql`substr(${incidents.happenedAt}, 1, 10) = ${targetDate}`)
      .all()
    const incidentsTodayCount = Number(incRows[0]?.cnt ?? 0)

    return {
      targetDate,
      criticalAllergiesCount,
      medicationsTodayCount,
      clinicVisitsTodayCount,
      incidentsTodayCount
    }
  },

  listClinicVisits(filter?: HealthFilter) {
    const db = getDb() as any
    const limit = filter?.limit ?? 50
    const conds: any[] = []

    if (filter?.date) {
      conds.push(sql`substr(${healthRecords.recordedOn}, 1, 10) = ${filter.date}`)
    }
    if (filter?.childId) {
      conds.push(eq(healthRecords.childId, filter.childId))
    }

    return db
      .select({
        id: healthRecords.id,
        childId: healthRecords.childId,
        childFirstName: children.firstName,
        childLastName: children.lastName,
        classroomName: classrooms.name,
        allergies: children.allergies,
        kind: healthRecords.kind,
        detail: healthRecords.detail,
        recordedOn: healthRecords.recordedOn,
        createdAt: healthRecords.createdAt
      })
      .from(healthRecords)
      .innerJoin(children, eq(healthRecords.childId, children.id))
      .leftJoin(classrooms, eq(children.classroomId, classrooms.id))
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(healthRecords.recordedOn))
      .limit(limit)
      .all()
  },

  listIncidents(filter?: HealthFilter) {
    const db = getDb() as any
    const limit = filter?.limit ?? 50
    const conds: any[] = []

    if (filter?.date) {
      conds.push(sql`substr(${incidents.happenedAt}, 1, 10) = ${filter.date}`)
    }
    if (filter?.childId) {
      conds.push(eq(incidents.childId, filter.childId))
    }

    return db
      .select({
        id: incidents.id,
        childId: incidents.childId,
        childFirstName: children.firstName,
        childLastName: children.lastName,
        classroomName: classrooms.name,
        happenedAt: incidents.happenedAt,
        description: incidents.description,
        actionTaken: incidents.actionTaken,
        notifiedGuardian: incidents.notifiedGuardian,
        createdAt: incidents.createdAt
      })
      .from(incidents)
      .innerJoin(children, eq(incidents.childId, children.id))
      .leftJoin(classrooms, eq(children.classroomId, classrooms.id))
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(incidents.happenedAt))
      .limit(limit)
      .all()
  },

  listMedications(filter?: HealthFilter) {
    const db = getDb() as any
    const limit = filter?.limit ?? 50
    const conds: any[] = []

    if (filter?.date) {
      conds.push(sql`substr(${medicationsLog.givenAt}, 1, 10) = ${filter.date}`)
    }
    if (filter?.childId) {
      conds.push(eq(medicationsLog.childId, filter.childId))
    }

    return db
      .select({
        id: medicationsLog.id,
        childId: medicationsLog.childId,
        childFirstName: children.firstName,
        childLastName: children.lastName,
        classroomName: classrooms.name,
        medicine: medicationsLog.medicine,
        dose: medicationsLog.dose,
        givenAt: medicationsLog.givenAt,
        givenBy: medicationsLog.givenBy,
        createdAt: medicationsLog.createdAt
      })
      .from(medicationsLog)
      .innerJoin(children, eq(medicationsLog.childId, children.id))
      .leftJoin(classrooms, eq(children.classroomId, classrooms.id))
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(medicationsLog.givenAt))
      .limit(limit)
      .all()
  },

  listCriticalAllergies() {
    const db = getDb() as any
    return db
      .select({
        id: children.id,
        firstName: children.firstName,
        lastName: children.lastName,
        birthDate: children.birthDate,
        gender: children.gender,
        classroomId: children.classroomId,
        classroomName: classrooms.name,
        allergies: children.allergies,
        medicalNotes: children.medicalNotes
      })
      .from(children)
      .leftJoin(classrooms, eq(children.classroomId, classrooms.id))
      .where(and(
        eq(children.status, 'active'),
        isNull(children.deletedAt),
        sql`${children.allergies} IS NOT NULL AND length(trim(${children.allergies})) > 0`
      ))
      .all()
  },

  recordClinicVisit(input: ClinicVisitCreate, userId?: string) {
    const db = getDb() as any
    const id = randomUUID()
    db.insert(healthRecords)
      .values({
        id,
        childId: input.childId,
        kind: input.kind,
        detail: input.detail,
        recordedOn: input.recordedOn
      })
      .run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'health.clinic_visit',
        entityId: id,
        detail: input.detail.slice(0, 50)
      })
      .run()

    return { id, ...input }
  },

  recordIncident(input: IncidentCreate, userId?: string) {
    const db = getDb() as any
    const id = randomUUID()
    db.insert(incidents)
      .values({
        id,
        childId: input.childId,
        happenedAt: input.happenedAt,
        description: input.description,
        actionTaken: input.actionTaken ?? null,
        notifiedGuardian: input.notifiedGuardian
      })
      .run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'health.incident',
        entityId: id,
        detail: input.description.slice(0, 50)
      })
      .run()

    return { id, ...input }
  },

  recordMedication(input: MedicationLogCreate, userId?: string) {
    const db = getDb() as any
    const id = randomUUID()
    db.insert(medicationsLog)
      .values({
        id,
        childId: input.childId,
        medicine: input.medicine,
        dose: input.dose ?? null,
        givenAt: input.givenAt,
        givenBy: input.givenBy ?? null
      })
      .run()

    db.insert(auditLogs)
      .values({
        id: randomUUID(),
        userId: userId ?? null,
        action: 'health.medication',
        entityId: id,
        detail: `${input.medicine} (${input.dose ?? ''})`
      })
      .run()

    return { id, ...input }
  }
}
