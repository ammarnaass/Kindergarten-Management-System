import { getDb } from '../db/client'
import { roles, permissions, rolePermissions, users } from '../db/schema/system'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { hashPassword } from './password'
import { PERMISSIONS } from '@shared/constants'

const ROLE_DEFS: Record<string, string[]> = {
  admin: Object.values(PERMISSIONS),
  educator: ['children.read', 'attendance.read', 'attendance.write', 'health.read'],
  accountant: ['children.read', 'finance.read', 'finance.write'],
  staff: ['children.read', 'attendance.read']
}

import { classrooms } from '../db/schema/classrooms'
import { session } from './session'

const DEFAULT_CLASSROOMS = [
  { name: 'فصل النجوم (4 سنوات)', capacity: 20, room: 'قاعة 1' },
  { name: 'فصل الفراشات (3 سنوات)', capacity: 20, room: 'قاعة 2' },
  { name: 'فصل الزهور (5 سنوات)', capacity: 18, room: 'قاعة 3' },
  { name: 'فصل البراعم (تحضيري)', capacity: 15, room: 'قاعة 4' }
]

export function ensureSeed() {
  const db = getDb() as any

  // Seed default kindergarten classrooms if empty
  try {
    const existingClassrooms = db.select().from(classrooms).limit(1).all()
    if (existingClassrooms.length === 0) {
      for (const c of DEFAULT_CLASSROOMS) {
        db.insert(classrooms).values({ id: randomUUID(), ...c }).run()
      }
    }
  } catch {}

  const existing = db.select().from(users).limit(1).all()
  if (existing.length > 0) {
    const adminUser = existing[0]
    session.set({
      id: adminUser.id,
      username: adminUser.username,
      displayName: adminUser.displayName,
      role: 'admin',
      permissions: Object.values(PERMISSIONS)
    })
    return
  }

  for (const code of Object.values(PERMISSIONS)) {
    const rows = db.select().from(permissions).where(eq(permissions.code, code)).all()
    if (rows.length === 0) db.insert(permissions).values({ id: randomUUID(), code, description: code }).run()
  }
  for (const [role, perms] of Object.entries(ROLE_DEFS)) {
    const roleRows = db.select().from(roles).where(eq(roles.name, role)).all()
    let roleId: string
    if (roleRows.length === 0) {
      roleId = randomUUID()
      db.insert(roles).values({ id: roleId, name: role, description: role }).run()
    } else roleId = roleRows[0].id
    for (const code of perms) {
      const prow = db.select().from(permissions).where(eq(permissions.code, code)).all()
      if (prow.length > 0) {
        try { db.insert(rolePermissions).values({ roleId, permissionId: prow[0].id }).run() } catch {}
      }
    }
  }
  const adminRole = db.select().from(roles).where(eq(roles.name, 'admin')).all()[0]
  const adminId = randomUUID()
  db.insert(users).values({
    id: adminId, username: 'admin',
    passwordHash: hashPassword('admin123'),
    displayName: 'المدير', roleId: adminRole.id, isActive: true
  }).run()

  session.set({
    id: adminId,
    username: 'admin',
    displayName: 'المدير',
    role: 'admin',
    permissions: Object.values(PERMISSIONS)
  })
}

