import { getDb } from '../db/client'
import { children, guardians, childGuardians, authorizedPickups } from '../db/schema'
import { eq, like, and, count, or, isNull } from 'drizzle-orm'
import type { ChildFilter, ChildCreate, ChildUpdate } from '@shared/schemas/children'
import { randomUUID } from 'crypto'

export const childrenRepo = {
  list(filter: ChildFilter) {
    const db = getDb() as any
    const conds: any[] = []
    if (filter.search) {
      const s = `%${filter.search}%`
      conds.push(or(like(children.firstName, s), like(children.lastName, s)))
    }
    if (filter.classroomId) conds.push(eq(children.classroomId, filter.classroomId))
    if (filter.status) conds.push(eq(children.status, filter.status))
    conds.push(isNull(children.deletedAt))
    const where = conds.length ? and(...conds) : undefined
    const items = db.select().from(children).where(where).limit(filter.limit).offset(filter.offset).all()
    const totalRow = db.select({ v: count() }).from(children).where(where).all()
    return { items, total: totalRow[0]?.v ?? 0, limit: filter.limit, offset: filter.offset }
  },
  getById(id: string) {
    const db = getDb() as any
    const rows = db.select().from(children).where(eq(children.id, id)).all()
    return rows[0] ?? null
  },
  create(v: ChildCreate) {
    const db = getDb() as any
    const id = randomUUID()
    db.insert(children).values({ id, ...v }).run()
    return this.getById(id)
  },
  update(v: ChildUpdate) {
    const db = getDb() as any
    const { id, ...rest } = v
    db.update(children).set({ ...rest, updatedAt: new Date() }).where(eq(children.id, id)).run()
    return this.getById(id)
  },
  softDelete(id: string) {
    const db = getDb() as any
    db.update(children).set({ deletedAt: new Date() }).where(eq(children.id, id)).run()
  },
  createGuardian(v: { firstName: string; lastName: string; phone: string; email?: string | null; address?: string | null; nationalId?: string | null }) {
    const db = getDb() as any
    const id = randomUUID()
    db.insert(guardians).values({ id, ...v }).run()
    return db.select().from(guardians).where(eq(guardians.id, id)).all()[0]
  },
  linkGuardian(v: { childId: string; guardianId: string; relation: string; isPrimary: boolean; canPickup: boolean }) {
    const db = getDb() as any
    db.insert(childGuardians).values(v).run()
  },
  getGuardians(childId: string) {
    const db = getDb() as any
    return db
      .select({
        id: guardians.id,
        firstName: guardians.firstName,
        lastName: guardians.lastName,
        phone: guardians.phone,
        email: guardians.email,
        address: guardians.address,
        nationalId: guardians.nationalId,
        relation: childGuardians.relation,
        isPrimary: childGuardians.isPrimary,
        canPickup: childGuardians.canPickup,
      })
      .from(guardians)
      .innerJoin(childGuardians, eq(childGuardians.guardianId, guardians.id))
      .where(eq(childGuardians.childId, childId))
      .all()
  },
  getAuthorizedPickups(childId: string) {
    const db = getDb() as any
    return db.select().from(authorizedPickups).where(eq(authorizedPickups.childId, childId)).all()
  },
}
