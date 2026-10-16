import { getDb } from '../db/client'
import { users, roles, rolePermissions, permissions } from '../db/schema/system'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../security/password'
import { session } from '../security/session'
import type { CurrentUser } from '@shared/types'

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
    let roleName = 'staff'
    let perms: string[] = []
    if (u.roleId) {
      const r = db.select().from(roles).where(eq(roles.id, u.roleId)).all()[0]
      if (r) roleName = r.name
      const rp = db.select({ code: permissions.code }).from(rolePermissions).innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id)).where(eq(rolePermissions.roleId, u.roleId)).all()
      perms = rp.map((x: any) => x.code)
    }
    const cu: CurrentUser = { id: u.id, username: u.username, displayName: u.displayName, role: roleName, permissions: perms }
    session.set(cu)
    db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, u.id)).run()
    return cu
  },
  logout() { session.set(null) },
  me(): CurrentUser | null { return session.get() }
}
