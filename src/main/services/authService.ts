import { getDb } from '../db/client'
import { users, roles, rolePermissions, permissions } from '../db/schema/system'
import { eq, desc } from 'drizzle-orm'
import { verifyPassword, hashPassword } from '../security/password'
import { session } from '../security/session'
import type { CurrentUser } from '@shared/types'
import { randomUUID } from 'crypto'
import type { SuperAdminRegisterInput, UserCreate, UserUpdate, UserResetPassword, UserResetPin } from '@shared/schemas/auth'

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

export interface DetailedUserItem {
  id: string
  username: string
  displayName: string
  roleId: string
  roleName: string
  roleTitle: string | null
  avatarIcon: string | null
  phone: string | null
  email: string | null
  hasPin: boolean
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date | null
}

export interface RoleWithPermissionsItem {
  id: string
  name: string
  description: string | null
  permissions: string[]
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

  checkSetup(): { isSetupComplete: boolean; hasAdmin: boolean; allowRegistration: boolean; userCount: number } {
    const db = getDb() as any
    const allUsers = db.select().from(users).all()
    const allRoles = db.select().from(roles).where(eq(roles.name, 'admin')).all()
    const adminRoleId = allRoles[0]?.id
    const hasAdmin = adminRoleId ? allUsers.some((u: any) => u.roleId === adminRoleId) : allUsers.length > 0
    return {
      isSetupComplete: hasAdmin,
      hasAdmin,
      allowRegistration: !hasAdmin,
      userCount: allUsers.length
    }
  },

  registerSuperAdmin(input: SuperAdminRegisterInput): { user: CurrentUser; recoveryKey: string } {
    const setup = this.checkSetup()
    if (setup.hasAdmin) {
      const err: any = new Error('تم إنشاء وتعيين مدير النظام مسبقاً! إنشاء الحسابات الإضافية يتم فقط من داخل الإعدادات بواسطة المشرف.')
      err.code = 'FORBIDDEN'
      throw err
    }

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
    const current = session.get()
    if (!current) {
      session.set(cu)
    }
    return { user: cu }
  },

  listDetailedUsers(): DetailedUserItem[] {
    const db = getDb() as any
    const rows = db.select().from(users).orderBy(desc(users.createdAt)).all()
    const allRoles = db.select().from(roles).all()
    const roleMap = new Map<string, string>(allRoles.map((r: any) => [r.id, r.name]))

    return rows.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roleId: u.roleId || '',
      roleName: (u.roleId && roleMap.get(u.roleId)) || 'staff',
      roleTitle: u.roleTitle || null,
      avatarIcon: u.avatarIcon || null,
      phone: u.phone || null,
      email: u.email || null,
      hasPin: Boolean(u.pinHash),
      isActive: Boolean(u.isActive),
      lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
      createdAt: u.createdAt ? new Date(u.createdAt) : null
    }))
  },

  getUserById(id: string): DetailedUserItem {
    const db = getDb() as any
    const rows = db.select().from(users).where(eq(users.id, id)).all()
    const u = rows[0]
    if (!u) {
      throw Object.assign(new Error('المستخدم غير موجود'), { code: 'NOT_FOUND' })
    }
    const allRoles = db.select().from(roles).all()
    const roleMap = new Map<string, string>(allRoles.map((r: any) => [r.id, r.name]))

    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roleId: u.roleId || '',
      roleName: (u.roleId && roleMap.get(u.roleId)) || 'staff',
      roleTitle: u.roleTitle || null,
      avatarIcon: u.avatarIcon || null,
      phone: u.phone || null,
      email: u.email || null,
      hasPin: Boolean(u.pinHash),
      isActive: Boolean(u.isActive),
      lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
      createdAt: u.createdAt ? new Date(u.createdAt) : null
    }
  },

  updateUser(input: UserUpdate): DetailedUserItem {
    const db = getDb() as any
    const existing = db.select().from(users).where(eq(users.id, input.id)).all()[0]
    if (!existing) {
      throw Object.assign(new Error('المستخدم غير موجود'), { code: 'NOT_FOUND' })
    }

    const allRoles = db.select().from(roles).all()
    let targetRole = allRoles.find((r: any) => r.id === input.roleId || r.name === input.roleId)
    const roleId = targetRole ? targetRole.id : input.roleId

    db.update(users).set({
      displayName: input.displayName,
      roleId: roleId,
      roleTitle: input.roleTitle !== undefined ? input.roleTitle : existing.roleTitle,
      phone: input.phone !== undefined ? input.phone : existing.phone,
      email: input.email !== undefined ? input.email : existing.email,
      avatarIcon: input.avatarIcon !== undefined ? input.avatarIcon : existing.avatarIcon,
      isActive: input.isActive !== undefined ? input.isActive : existing.isActive,
      updatedAt: new Date()
    }).where(eq(users.id, input.id)).run()

    return this.getUserById(input.id)
  },

  resetPassword(input: UserResetPassword): boolean {
    const db = getDb() as any
    const existing = db.select().from(users).where(eq(users.id, input.id)).all()[0]
    if (!existing) {
      throw Object.assign(new Error('المستخدم غير موجود'), { code: 'NOT_FOUND' })
    }

    db.update(users).set({
      passwordHash: hashPassword(input.newPassword),
      updatedAt: new Date()
    }).where(eq(users.id, input.id)).run()

    return true
  },

  resetPin(input: UserResetPin): boolean {
    const db = getDb() as any
    const existing = db.select().from(users).where(eq(users.id, input.id)).all()[0]
    if (!existing) {
      throw Object.assign(new Error('المستخدم غير موجود'), { code: 'NOT_FOUND' })
    }

    db.update(users).set({
      pinHash: input.newPin ? hashPassword(input.newPin) : null,
      updatedAt: new Date()
    }).where(eq(users.id, input.id)).run()

    return true
  },

  toggleActive(id: string, isActive: boolean): boolean {
    const db = getDb() as any
    const existing = db.select().from(users).where(eq(users.id, id)).all()[0]
    if (!existing) {
      throw Object.assign(new Error('المستخدم غير موجود'), { code: 'NOT_FOUND' })
    }

    // Safeguard: Check if this is the only active admin
    if (!isActive) {
      const allRoles = db.select().from(roles).where(eq(roles.name, 'admin')).all()
      const adminRoleId = allRoles[0]?.id
      if (existing.roleId === adminRoleId) {
        const otherActiveAdmins = db.select().from(users).where(eq(users.roleId, adminRoleId)).all().filter((u: any) => u.id !== id && u.isActive)
        if (otherActiveAdmins.length === 0) {
          throw Object.assign(new Error('لا يمكن تعطيل المشرف الإداري الوحيد النشط في النظام'), { code: 'FORBIDDEN' })
        }
      }
    }

    db.update(users).set({
      isActive,
      updatedAt: new Date()
    }).where(eq(users.id, id)).run()

    return true
  },

  deleteUser(id: string): boolean {
    const db = getDb() as any
    const existing = db.select().from(users).where(eq(users.id, id)).all()[0]
    if (!existing) {
      throw Object.assign(new Error('المستخدم غير موجود'), { code: 'NOT_FOUND' })
    }

    // Safeguard 1: Do not delete current logged in user
    const current = session.get()
    if (current && current.id === id) {
      throw Object.assign(new Error('لا يمكنك حذف الحساب الذي قمت بتسجيل الدخول به حالياً'), { code: 'FORBIDDEN' })
    }

    // Safeguard 2: Do not delete the only admin
    const allRoles = db.select().from(roles).where(eq(roles.name, 'admin')).all()
    const adminRoleId = allRoles[0]?.id
    if (existing.roleId === adminRoleId) {
      const otherAdmins = db.select().from(users).where(eq(users.roleId, adminRoleId)).all().filter((u: any) => u.id !== id)
      if (otherAdmins.length === 0) {
        throw Object.assign(new Error('لا يمكن حذف المشرف الإداري الوحيد في النظام'), { code: 'FORBIDDEN' })
      }
    }

    db.delete(users).where(eq(users.id, id)).run()
    return true
  },

  listRoles(): RoleWithPermissionsItem[] {
    const db = getDb() as any
    const allRoles = db.select().from(roles).all()
    const allRolePerms = db.select({
      roleId: rolePermissions.roleId,
      code: permissions.code
    }).from(rolePermissions).innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id)).all()

    const rolePermsMap = new Map<string, string[]>()
    for (const rp of allRolePerms) {
      const list = rolePermsMap.get(rp.roleId) || []
      list.push(rp.code)
      rolePermsMap.set(rp.roleId, list)
    }

    return allRoles.map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description || null,
      permissions: r.name === 'admin' ? ['*'] : rolePermsMap.get(r.id) || []
    }))
  },

  logout() { session.set(null) },
  me(): CurrentUser | null { return session.get() }
}


