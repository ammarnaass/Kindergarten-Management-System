import { getDb, getSqlite } from '../db/client'
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

import { session } from './session'

export function ensureSeed() {
  const db = getDb() as any

  function ensureUserColumns() {
  const sqlite = getSqlite()
  try {
    const cols = sqlite.pragma('table_info(users)') as { name: string }[]
    const colNames = new Set(cols.map((c) => c.name))
    const required = [
      { name: 'pin_hash', type: 'TEXT' },
      { name: 'role_title', type: 'TEXT' },
      { name: 'phone', type: 'TEXT' },
      { name: 'national_id', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'avatar_icon', type: 'TEXT' },
      { name: 'recovery_key_hash', type: 'TEXT' },
      { name: 'security_questions', type: 'TEXT' }
    ]
    for (const req of required) {
      if (!colNames.has(req.name)) {
        sqlite.exec(`ALTER TABLE users ADD COLUMN ${req.name} ${req.type};`)
      }
    }
  } catch {}
}

  ensureUserColumns()

  // Ensure permissions and roles exist
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

  const roleList = db.select().from(roles).all()
  const roleIdMap: Record<string, string> = {}
  for (const r of roleList) roleIdMap[r.name] = r.id

  // Prune any legacy dummy users that were previously seeded
  try {
    const sqlite = getSqlite()
    const adminUser = sqlite.prepare("SELECT id FROM users WHERE username = 'admin'").get() as { id: string } | undefined
    if (adminUser) {
      sqlite.prepare("UPDATE attendance SET recorded_by = ? WHERE recorded_by IN (SELECT id FROM users WHERE username IN ('nadia', 'fatima', 'sarah', 'reem'))").run(adminUser.id)
      sqlite.prepare("UPDATE expenses SET recorded_by = ? WHERE recorded_by IN (SELECT id FROM users WHERE username IN ('nadia', 'fatima', 'sarah', 'reem'))").run(adminUser.id)
      sqlite.prepare("UPDATE payments SET recorded_by = ? WHERE recorded_by IN (SELECT id FROM users WHERE username IN ('nadia', 'fatima', 'sarah', 'reem'))").run(adminUser.id)
    }
    sqlite.prepare("DELETE FROM users WHERE username IN ('nadia', 'fatima', 'sarah', 'reem')").run()
  } catch {}

  const adminRoleId = roleIdMap['admin']
  const allDbUsers = db.select().from(users).all()
  const primaryAdmin = allDbUsers.find((u: any) => u.roleId === adminRoleId) || allDbUsers[0]
  if (primaryAdmin) {
    session.set({
      id: primaryAdmin.id,
      username: primaryAdmin.username,
      displayName: primaryAdmin.displayName,
      role: 'admin',
      permissions: Object.values(PERMISSIONS)
    })
  }
}

