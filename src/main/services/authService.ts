import { getDb } from '../db/client'
import { users, roles, rolePermissions, permissions } from '../db/schema/system'
import { eq, desc } from 'drizzle-orm'
import { verifyPassword, hashPassword } from '../security/password'
import { session } from '../security/session'
import type { CurrentUser } from '@shared/types'
import { randomUUID } from 'crypto'
import type { SuperAdminRegisterInput, UserCreate } from '@shared/schemas/auth'

export interface LocalUserSummary {
  id: string
  username: string
  displayName: string
  role: string
  roleTitle?: string | null
  avatarIcon?: string | null
  hasPin: boolean
  lastLoginAt?: Date | null
}

export const authService = {
  login(username: string, password: string): CurrentUser {
    const db = getDb() as any
    const rows = db.select().from(users).where(eq(users.username, username)).all()
    const u = rows[0]
    if (!u || !u.isActive || !verifyPassword(password, u.passwordHash)) {
      const e: any = new Error('بيانات الدخول غير صحيحة')
      e.code = 'UNAUTHORIZED'
      throw e
    }
    return this._completeLogin(db, u)
  },

  loginPin(username: string, pin: string): CurrentUser {
    const db = getDb() as any
    const rows = db.select().from(users).where(eq(users.username, username)).all()
    const u = rows[0]
    if (!u || !u.isActive || !u.pinHash || !verifyPassword(pin, u.pinHash)) {
      const e: any = new Error('رمز PIN غير صحيح أو غير مفعل لهذا الحساب')
      e.code = 'UNAUTHORIZED'
      throw e
    }
    return this._completeLogin(db, u)
  },

  _completeLogin(db: any, u: any): CurrentUser {
    let roleName = 'staff'
    let perms: string[] = []
    if (u.roleId) {
      const r = db.select().from(roles).where(eq(roles.id, u.roleId)).all()[0]
      if (r) roleName = r.name
      const rp = db.select({ code: permissions.code }).from(rolePermissions).innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id)).where(eq(rolePermissions.roleId, u.roleId)).all()
      perms = rp.map((x: any) => x.code)
    }
    const cu: CurrentUser = {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      role: roleName,
      permissions: perms
    }
    session.set(cu)
    try {
      db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, u.id)).run()
    } catch {}
    return cu
  },

  listUsers(): LocalUserSummary[] {
    const db = getDb() as any
    const rows = db.select().from(users).where(eq(users.isActive, true)).orderBy(desc(users.lastLoginAt)).all()
    const allRoles = db.select().from(roles).all()
    const roleMap = new Map<string, string>(allRoles.map((r: any) => [r.id, r.name]))

    return rows.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      role: (u.roleId && roleMap.get(u.roleId)) || 'staff',
      roleTitle: u.roleTitle || null,
      avatarIcon: u.avatarIcon || null,
      hasPin: Boolean(u.pinHash),
      lastLoginAt: u.lastLoginAt || null
    }))
  },

  checkSetup(): { isSetupComplete: boolean; hasAdmin: boolean; userCount: number } {
    const db = getDb() as any
    const allUsers = db.select().from(users).all()
    const allRoles = db.select().from(roles).where(eq(roles.name, 'admin')).all()
    const adminRoleId = allRoles[0]?.id
    const hasAdmin = adminRoleId ? allUsers.some((u: any) => u.roleId === adminRoleId) : allUsers.length > 0
    return {
      isSetupComplete: allUsers.length > 0,
      hasAdmin,
      userCount: allUsers.length
    }
  },

  registerSuperAdmin(input: SuperAdminRegisterInput): { user: CurrentUser; recoveryKey: string } {
    const db = getDb() as any
    let adminRole = db.select().from(roles).where(eq(roles.name, 'admin')).all()[0]
    if (!adminRole) {
      const rId = randomUUID()
      db.insert(roles).values({ id: rId, name: 'admin', description: 'مدير النظام الأعلى' }).run()
      adminRole = { id: rId, name: 'admin' }
    }

    const userId = randomUUID()
    const recoveryKey = input.recoveryKey || `RAW-${Math.floor(1000 + Math.random() * 9000)}-${randomUUID().slice(0, 4).toUpperCase()}-2026`

    db.insert(users).values({
      id: userId,
      username: input.username,
      passwordHash: hashPassword(input.password),
      displayName: input.fullName,
      roleId: adminRole.id,
      roleTitle: input.roleTitle,
      phone: input.phone,
      nationalId: input.nationalId,
      email: input.adminEmail,
      avatarIcon: 'shield_person',
      pinHash: input.pinCode ? hashPassword(input.pinCode) : null,
      recoveryKeyHash: hashPassword(recoveryKey),
      securityQuestions: input.securityQuestions ? JSON.stringify(input.securityQuestions) : null,
      isActive: true,
      lastLoginAt: new Date()
    }).run()

    const cu: CurrentUser = {
      id: userId,
      username: input.username,
      displayName: input.fullName,
      role: 'admin',
      permissions: ['*']
    }
    session.set(cu)
    return { user: cu, recoveryKey }
  },

  createUser(input: UserCreate): { user: CurrentUser } {
    const db = getDb() as any
    const allRoles = db.select().from(roles).all()
    let targetRole = allRoles.find((r: any) => r.id === input.roleId || r.name === input.roleId)
    if (!targetRole) {
      targetRole = allRoles.find((r: any) => r.name === 'staff') || allRoles[0]
    }
    const roleId = targetRole ? targetRole.id : input.roleId

    // Check if username already exists
    const existing = db.select().from(users).where(eq(users.username, input.username)).all()
    if (existing.length > 0) {
      throw Object.assign(new Error('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر'), { code: 'CONFLICT' })
    }

    const userId = randomUUID()
    db.insert(users).values({
      id: userId,
      username: input.username,
      passwordHash: hashPassword(input.password),
      displayName: input.displayName,
      roleId: roleId,
      roleTitle: input.roleTitle || targetRole?.description || 'كادر معتمد بالروضة',
      avatarIcon: input.avatarIcon || (targetRole?.name === 'admin' ? 'shield_person' : targetRole?.name === 'educator' ? 'school' : 'badge'),
      pinHash: input.pinCode ? hashPassword(input.pinCode) : null,
      isActive: input.isActive ?? true,
      lastLoginAt: new Date()
    }).run()

    const cu: CurrentUser = {
      id: userId,
      username: input.username,
      displayName: input.displayName,
      role: targetRole?.name || 'staff',
      permissions: targetRole?.name === 'admin' ? ['*'] : []
    }
    session.set(cu)
    return { user: cu }
  },

  logout() { session.set(null) },
  me(): CurrentUser | null { return session.get() }
}

