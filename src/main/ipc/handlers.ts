import { handle } from './register'
import { PERMISSIONS } from '@shared/constants'
import { authService } from '../services/authService'
import { childrenRepo } from '../repositories/childrenRepo'
import { classroomsRepo } from '../repositories/classroomsRepo'
import { attendanceRepo } from '../repositories/attendanceRepo'
import { financeService } from '../services/financeService'
import { createBackup, listBackups } from '../db/backup'
import { getSqlite, getDbPath } from '../db/client'

export function registerHandlers() {
  handle('auth:login', null, (input: any) => authService.login(input.username, input.password))
  handle('auth:logout', null, () => { authService.logout(); return true })
  handle('auth:me', null, () => authService.me())
  handle('users:create', PERMISSIONS.SETTINGS_WRITE, () => { throw Object.assign(new Error('غير مدعوم في v1'), { code: 'UNKNOWN' }) })

  handle('children:list', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.list(input))
  handle('children:get', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.getById(input.id))
  handle('children:guardians', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.getGuardians(input.id))
  handle('children:pickups', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.getAuthorizedPickups(input.id))
  handle('children:create', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.create(input))
  handle('children:update', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.update(input))
  handle('children:remove', PERMISSIONS.CHILDREN_WRITE, (input: any) => { childrenRepo.softDelete(input.id); return true })
  handle('guardians:create', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.createGuardian(input))
  handle('children:linkGuardian', PERMISSIONS.CHILDREN_WRITE, (input: any) => { childrenRepo.linkGuardian(input); return true })
  handle('classrooms:list', PERMISSIONS.CHILDREN_READ, () => classroomsRepo.list())

  handle('attendance:mark', PERMISSIONS.ATTENDANCE_WRITE, (input: any, ctx) => attendanceRepo.markDay(input.date, input.entries, ctx.userId ?? undefined))
  handle('attendance:list', PERMISSIONS.ATTENDANCE_READ, (input: any) => attendanceRepo.list(input))

  handle('invoices:create', PERMISSIONS.FINANCE_WRITE, (input: any) => financeService.createDraft(input))
  handle('invoices:issue', PERMISSIONS.FINANCE_WRITE, (input: any, ctx) => financeService.issue(input.id, ctx.userId ?? undefined))
  handle('payments:record', PERMISSIONS.FINANCE_WRITE, (input: any, ctx) => financeService.recordPayment(input, ctx.userId ?? undefined))

  handle('backup:create', PERMISSIONS.BACKUP_WRITE, (input: any) => createBackup(input?.destDir))
  handle('backup:list', PERMISSIONS.BACKUP_WRITE, () => listBackups())
  handle('app:diagnostics', null, () => ({
    dbPath: getDbPath(),
    dbSize: (() => { try { return (getSqlite().prepare("select page_count*page_size as s from pragma_page_count, pragma_page_size").get() as any)?.s ?? 0 } catch { return 0 } })(),
    backups: listBackups().length
  }))
}
