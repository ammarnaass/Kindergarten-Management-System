import { session } from './session'

export function hasPermission(code: string): boolean {
  const u = session.get()
  if (!u) return false
  return u.permissions.includes(code) || u.permissions.includes('*')
}

export function requirePermission(code: string) {
  const u = session.require()
  if (!u.permissions.includes(code) && !u.permissions.includes('*')) {
    const e: any = new Error('صلاحية مرفوضة: ' + code)
    e.code = 'FORBIDDEN'
    throw e
  }
  return u
}
