import { getDb, getSqlite } from '../db/client'
import { settings, users, roles, auditLogs } from '../db/schema/system'
import { classrooms } from '../db/schema/classrooms'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { hashPassword } from '../security/password'
import type { SetupPayload } from '@shared/schemas/setup'

export const setupService = {
  isInstalled(): { isInstalled: boolean; installedAt?: string | null; branchName?: string | null } {
    const sqlite = getSqlite()
    try {
      const row = sqlite.prepare("SELECT value FROM settings WHERE key = 'system.installed'").get() as { value: string } | undefined
      const isInstalled = row?.value === 'true'
      let installedAt: string | null = null
      let branchName: string | null = null
      if (isInstalled) {
        const atRow = sqlite.prepare("SELECT value FROM settings WHERE key = 'system.installed_at'").get() as { value: string } | undefined
        const nameRow = sqlite.prepare("SELECT value FROM settings WHERE key = 'branch.name'").get() as { value: string } | undefined
        installedAt = atRow?.value ?? null
        branchName = nameRow?.value ?? null
      }
      return { isInstalled, installedAt, branchName }
    } catch {
      return { isInstalled: false }
    }
  },

  completeSetup(payload: SetupPayload): { ok: boolean; adminUsername: string; branchName: string } {
    const db = getDb() as any
    const sqlite = getSqlite()

    const runSetup = sqlite.transaction(() => {
      // 1. Ensure admin role exists
      let adminRole = db.select().from(roles).where(eq(roles.name, 'admin')).all()[0]
      if (!adminRole) {
        const rId = randomUUID()
        db.insert(roles).values({ id: rId, name: 'admin', description: 'مدير النظام الأعلى' }).run()
        adminRole = { id: rId, name: 'admin' }
      }

      // 2. Insert or update Admin User
      const existingUser = db.select().from(users).where(eq(users.username, payload.admin.username)).all()[0]
      const passwordHash = hashPassword(payload.admin.password)
      const pinHash = hashPassword(payload.admin.pin)
      const recoveryKeyHash = hashPassword(payload.admin.recoveryKey)

      if (existingUser) {
        db.update(users).set({
          displayName: payload.admin.displayName,
          passwordHash,
          pinHash,
          recoveryKeyHash,
          roleId: adminRole.id,
          roleTitle: 'المشرف العام — إدارة الروضة',
          avatarIcon: 'shield_person',
          isActive: true
        }).where(eq(users.id, existingUser.id)).run()
      } else {
        db.insert(users).values({
          id: randomUUID(),
          username: payload.admin.username,
          displayName: payload.admin.displayName,
          passwordHash,
          pinHash,
          recoveryKeyHash,
          roleId: adminRole.id,
          roleTitle: 'المشرف العام — إدارة الروضة',
          avatarIcon: 'shield_person',
          isActive: true
        }).run()
      }

      // 3. Save branch and regional settings
      const settingsEntries: Record<string, string> = {
        'branch.name': payload.branch.name,
        'branch.licenseNumber': payload.branch.licenseNumber || '',
        'branch.city': payload.branch.city || '',
        'branch.phone': payload.branch.phone || '',
        'branch.email': payload.branch.email || '',
        'branch.logoDataUrl': payload.branch.logoDataUrl || '',
        'branch.academicYear': payload.branch.academicYear || '2024-2025',
        'regional.currency': payload.branch.currency || 'SAR',
        'regional.timeFormat': payload.branch.timeFormat || '12h',
        'printers.documentPrinter': payload.printers?.documentPrinter || '',
        'printers.receiptPrinter': payload.printers?.receiptPrinter || '',
        'printers.cardPrinter': payload.printers?.cardPrinter || '',
        'system.installed': 'true',
        'system.installed_at': new Date().toISOString(),
        'system.version': '0.1.0'
      }

      const stmt = sqlite.prepare(`
        INSERT INTO settings (key, value, updated_at) 
        VALUES (?, ?, unixepoch()) 
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()
      `)

      for (const [k, v] of Object.entries(settingsEntries)) {
        stmt.run(k, v)
      }

      // 4. Save initial classrooms if provided
      if (payload.classrooms && payload.classrooms.length > 0) {
        // Clear any placeholder classrooms if they exist
        const existingClassrooms = db.select().from(classrooms).all()
        const existingNames = new Set(existingClassrooms.map((c: any) => c.name))

        for (const cls of payload.classrooms) {
          if (!existingNames.has(cls.name)) {
            db.insert(classrooms).values({
              id: randomUUID(),
              name: cls.name,
              room: cls.room || 'قاعة دراسية',
              capacity: cls.capacity || 20
            }).run()
          }
        }
      }

      // 5. Audit Log
      db.insert(auditLogs).values({
        id: randomUUID(),
        action: 'SYSTEM_INSTALLATION_COMPLETED',
        detail: `تم إكمال التثبيت والتهيئة الأولية للروضة: ${payload.branch.name} بواسطة: ${payload.admin.username}`
      }).run()
    })

    runSetup()

    return {
      ok: true,
      adminUsername: payload.admin.username,
      branchName: payload.branch.name
    }
  }
}
