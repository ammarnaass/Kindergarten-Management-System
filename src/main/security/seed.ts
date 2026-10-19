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

import { classrooms } from '../db/schema/classrooms'
import { staff } from '../db/schema/staff'
import { session } from './session'

const DEFAULT_CLASSROOMS = [
  { name: 'فصل النجوم (روضة أولى KG1)', capacity: 20, room: 'قاعة 1' },
  { name: 'فصل الفراشات (روضة ثانية KG2)', capacity: 20, room: 'قاعة 2' },
  { name: 'فصل العباقرة (تمهيدي KG3)', capacity: 18, room: 'قاعة 3' },
  { name: 'فصل البراعم (الحضانة)', capacity: 15, room: 'قاعة 4' }
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

  // Seed default staff members if empty
  try {
    const existingStaff = db.select().from(staff).limit(1).all()
    if (existingStaff.length === 0) {
      const sampleStaff = [
        {
          id: randomUUID(),
          firstName: 'نورة',
          lastName: 'العتيبي',
          role: 'معلمة رياض أطفال',
          phone: '0555123456',
          email: 'noura@rawdati.local',
          salaryCents: 550000,
          hiredAt: '2024-09-01',
          isActive: true
        },
        {
          id: randomUUID(),
          firstName: 'سارة',
          lastName: 'السبيعي',
          role: 'ممرضة صحية',
          phone: '0555987654',
          email: 'sara.nurse@rawdati.local',
          salaryCents: 600000,
          hiredAt: '2024-08-15',
          isActive: true
        },
        {
          id: randomUUID(),
          firstName: 'فاطمة',
          lastName: 'الغامدي',
          role: 'مساعدة معلمة',
          phone: '0555333444',
          email: 'fatimah@rawdati.local',
          salaryCents: 400000,
          hiredAt: '2024-10-01',
          isActive: true
        }
      ]
      for (const s of sampleStaff) {
        db.insert(staff).values(s).run()
      }
    }
  } catch {}

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

