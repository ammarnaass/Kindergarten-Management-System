import { getDb } from '../db/client'
import { classrooms } from '../db/schema/classrooms'
import { isNull, eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export interface ClassroomCreateInput {
  name: string
  capacity?: number
  room?: string | null
  schoolYearId?: string | null
}

export const classroomsRepo = {
  list() {
    const db = getDb() as any
    return db.select().from(classrooms).where(isNull(classrooms.deletedAt)).all()
  },
  getById(id: string) {
    const db = getDb() as any
    const rows = db.select().from(classrooms).where(eq(classrooms.id, id)).all()
    return rows[0] ?? null
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
    return this.getById(id)
  }
}
