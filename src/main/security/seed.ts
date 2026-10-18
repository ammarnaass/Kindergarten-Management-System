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
import { children, guardians, childGuardians, authorizedPickups } from '../db/schema/children'
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

  // Seed default children and guardians if empty
  try {
    const existingGuardians = db.select().from(guardians).limit(1).all()
    if (existingGuardians.length === 0) {
      const clsList = db.select().from(classrooms).all()
      const cls1 = clsList[0]?.id ?? null
      const cls2 = clsList[1]?.id ?? null
      const cls3 = clsList[2]?.id ?? null

      const child1Id = randomUUID()
      const child2Id = randomUUID()
      const child3Id = randomUUID()
      const child4Id = randomUUID()

      db.insert(children).values([
        {
          id: child1Id,
          firstName: 'سعود',
          lastName: 'العتيبي',
          birthDate: '2020-04-12',
          gender: 'male',
          classroomId: cls1,
          status: 'active'
        },
        {
          id: child2Id,
          firstName: 'سارة',
          lastName: 'محمد',
          birthDate: '2021-01-18',
          gender: 'female',
          classroomId: cls2,
          status: 'active'
        },
        {
          id: child3Id,
          firstName: 'ليان',
          lastName: 'المطيري',
          birthDate: '2020-09-05',
          gender: 'female',
          classroomId: cls1,
          status: 'active'
        },
        {
          id: child4Id,
          firstName: 'ياسمين',
          lastName: 'الدوسري',
          birthDate: '2021-03-22',
          gender: 'female',
          classroomId: cls3,
          status: 'active'
        }
      ]).run()

      const g1Id = randomUUID()
      const g2Id = randomUUID()
      const g3Id = randomUUID()
      const g4Id = randomUUID()

      db.insert(guardians).values([
        {
          id: g1Id,
          firstName: 'فيصل بن عبد الله',
          lastName: 'العتيبي',
          phone: '0554918820',
          email: 'faisal.otaibi@example.com',
          address: 'حي النرجس، شارع 14',
          nationalId: '1048829103'
        },
        {
          id: g2Id,
          firstName: 'نورة بنت سعد',
          lastName: 'القحطاني',
          phone: '0503129941',
          email: 'noura.qahtani@example.com',
          address: 'حي الملقا',
          nationalId: '1087443190'
        },
        {
          id: g3Id,
          firstName: 'فهد بن مشعل',
          lastName: 'المطيري',
          phone: '0542201883',
          email: 'fahad.mutairi@example.com',
          address: 'حي الصحافة',
          nationalId: '1029481944'
        },
        {
          id: g4Id,
          firstName: 'خالد بن راشد',
          lastName: 'الدوسري',
          phone: '0509924110',
          email: null,
          address: 'حي الياسمين',
          nationalId: '1039912001'
        }
      ]).run()

      db.insert(childGuardians).values([
        { childId: child1Id, guardianId: g1Id, relation: 'أب (ولي شرعي)', isPrimary: true, canPickup: true },
        { childId: child2Id, guardianId: g2Id, relation: 'أم', isPrimary: true, canPickup: true },
        { childId: child3Id, guardianId: g3Id, relation: 'أب', isPrimary: true, canPickup: true },
        { childId: child4Id, guardianId: g4Id, relation: 'قريب سابق', isPrimary: false, canPickup: false }
      ]).run()

      db.insert(authorizedPickups).values([
        {
          id: randomUUID(),
          childId: child1Id,
          fullName: 'مشعل بن عبد الله العتيبي',
          phone: '0559013328',
          nationalId: '1066542109',
          note: 'العم - تفويض موسمي'
        },
        {
          id: randomUUID(),
          childId: child1Id,
          fullName: 'محمد كومار خان',
          phone: '0568812049',
          nationalId: '2391094821',
          note: 'سائق خاص - مشروط بالرمز QR'
        }
      ]).run()
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

