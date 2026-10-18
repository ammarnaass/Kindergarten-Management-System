import { BrowserWindow, shell, dialog } from 'electron'
import { handle } from './register'
import { PERMISSIONS } from '@shared/constants'
import { authService } from '../services/authService'
import { childrenRepo } from '../repositories/childrenRepo'
import { classroomsRepo } from '../repositories/classroomsRepo'
import { attendanceRepo } from '../repositories/attendanceRepo'
import { dailyRepo } from '../repositories/dailyRepo'
import { healthRepo } from '../repositories/healthRepo'
import { staffRepo } from '../repositories/staffRepo'
import { financeService } from '../services/financeService'
import { dashboardRepo } from '../repositories/dashboardRepo'
import { createBackup, listBackups } from '../db/backup'
import { getSqlite, getDbPath } from '../db/client'
import { settingsRepo } from '../repositories/settingsRepo'
import { timetableRepo } from '../repositories/timetableRepo'
import { setupService } from '../services/setupService'

export function registerHandlers() {
  // ── المصادقة ────────────────────────────────────────────────
  handle('auth:login', null, (input: any) => authService.login(input.username, input.password))
  handle('auth:loginPin', null, (input: any) => authService.loginPin(input.username, input.pin))
  handle('auth:logout', null, () => { authService.logout(); return true })
  handle('auth:me', null, () => authService.me())
  handle('auth:listUsers', null, () => authService.listUsers())
  handle('auth:checkSetup', null, () => authService.checkSetup())
  handle('auth:registerSuperAdmin', null, (input: any) => authService.registerSuperAdmin(input))

  // ── إدارة المستخدمين والحسابات ─────────────────────────────
  handle('users:list', null, () => authService.listDetailedUsers())
  handle('users:get', null, (input: any) => authService.getUserById(input.id))
  handle('users:create', null, (input: any) => authService.createUser(input))
  handle('users:update', null, (input: any) => authService.updateUser(input))
  handle('users:resetPassword', null, (input: any) => authService.resetPassword(input))
  handle('users:resetPin', null, (input: any) => authService.resetPin(input))
  handle('users:toggleActive', null, (input: any) => authService.toggleActive(input.id, input.isActive))
  handle('users:delete', null, (input: any) => authService.deleteUser(input.id))
  handle('roles:list', null, () => authService.listRoles())
  handle('system:isInstalled', null, () => setupService.isInstalled())
  handle('system:completeSetup', null, (input: any) => setupService.completeSetup(input))
  handle('system:integrityCheck', null, () => {
    const sqlite = getSqlite()
    const result = sqlite.pragma('integrity_check') as any[]
    const isOk = result.length > 0 && result[0]?.integrity_check === 'ok'
    return {
      ok: isOk,
      result: result.map((r) => r.integrity_check || 'ok').join(', '),
      dbPath: getDbPath(),
      journalMode: 'WAL',
      encryption: 'AES-256 (محلي)'
    }
  })
  handle('system:getPrinters', null, async (_input: any, ctx: any) => {
    try {
      const win = BrowserWindow.fromWebContents(ctx.event?.sender) || BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
      if (!win) return []
      const printers = await win.webContents.getPrintersAsync()
      return printers.map((p) => ({
        name: p.name,
        displayName: p.displayName || p.name,
        description: p.description || '',
        isDefault: Boolean((p as any).isDefault ?? (p.options as any)?.['printer-is-default'] === 'true'),
        status: (p as any).status ?? 0
      }))
    } catch (err) {
      console.error('Failed to get printers:', err)
      return []
    }
  })
  handle('system:openPath', null, async (input: any) => {
    if (!input?.path) return false
    try {
      shell.showItemInFolder(input.path)
      return true
    } catch (err) {
      console.error('Failed to open path:', err)
      return false
    }
  })
  handle('system:selectDirectory', null, async (_input: any, ctx: any) => {
    try {
      const win = BrowserWindow.fromWebContents(ctx.event?.sender) || BrowserWindow.getFocusedWindow()
      const result = await dialog.showOpenDialog(win!, {
        properties: ['openDirectory', 'createDirectory'],
        title: 'اختر مجلد الحفظ الاحتياطي الخارجي'
      })
      if (result.canceled || result.filePaths.length === 0) return null
      return result.filePaths[0]
    } catch (err) {
      console.error('Failed to select directory:', err)
      return null
    }
  })


  // ── الأطفال والأولياء ───────────────────────────────────────
  handle('children:list', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.list(input))
  handle('children:get', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.getById(input.id))
  handle('children:guardians', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.getGuardians(input.id))
  handle('children:pickups', PERMISSIONS.CHILDREN_READ, (input: any) => childrenRepo.getAuthorizedPickups(input.id))
  handle('children:createPickup', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.createAuthorizedPickup(input))
  handle('children:removePickup', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.deleteAuthorizedPickup(input.id))
  handle('children:create', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.create(input))
  handle('children:update', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.update(input))
  handle('children:remove', PERMISSIONS.CHILDREN_WRITE, (input: any) => { childrenRepo.softDelete(input.id); return true })
  handle('children:birthdaysSoon', PERMISSIONS.CHILDREN_READ, (input: any) => dashboardRepo.getBirthdaysSoon(input?.withinDays ?? 7))
  handle('guardians:list', PERMISSIONS.CHILDREN_READ, () => childrenRepo.listGuardians())
  handle('guardians:allPickups', PERMISSIONS.CHILDREN_READ, () => childrenRepo.listAllAuthorizedPickups())
  handle('guardians:create', PERMISSIONS.CHILDREN_WRITE, (input: any) => childrenRepo.createGuardian(input))
  handle('children:linkGuardian', PERMISSIONS.CHILDREN_WRITE, (input: any) => { childrenRepo.linkGuardian(input); return true })

  // ── الفصول ──────────────────────────────────────────────────
  handle('classrooms:list', PERMISSIONS.CHILDREN_READ, () => classroomsRepo.list())
  handle('classrooms:attendance', PERMISSIONS.CHILDREN_READ, (input: any) => dashboardRepo.getClassroomsAttendance(input?.date))
  handle('classrooms:create', PERMISSIONS.CHILDREN_WRITE, (input: any) => classroomsRepo.create(input))
  handle('classrooms:update', PERMISSIONS.CHILDREN_WRITE, (input: any) => classroomsRepo.update(input.id, input))
  handle('classrooms:delete', PERMISSIONS.CHILDREN_WRITE, (input: any) => classroomsRepo.delete(input.id))

  // ── الحضور ──────────────────────────────────────────────────
  handle('attendance:mark', PERMISSIONS.ATTENDANCE_WRITE, (input: any, ctx) => attendanceRepo.markDay(input.date, input.entries, ctx.userId ?? undefined))
  handle('attendance:list', PERMISSIONS.ATTENDANCE_READ, (input: any) => attendanceRepo.list(input))

  // ── التقرير اليومي والملاحظات التربوية ───────────────────────
  handle('daily:get', PERMISSIONS.CHILDREN_READ, (input: any) => dailyRepo.get(input.childId, input.date))
  handle('daily:save', PERMISSIONS.CHILDREN_WRITE, (input: any, ctx) => dailyRepo.save(input, ctx.userId ?? undefined))
  handle('daily:listByClassroom', PERMISSIONS.CHILDREN_READ, (input: any) => dailyRepo.listByClassroom(input.classroomId, input.date))

  // ── الصحة والسلامة والعيادة المدرسية ───────────────────────
  handle('health:stats', PERMISSIONS.CHILDREN_READ, (input: any) => healthRepo.getStats(input?.date))
  handle('health:clinicVisits', PERMISSIONS.CHILDREN_READ, (input: any) => healthRepo.listClinicVisits(input))
  handle('health:incidents', PERMISSIONS.CHILDREN_READ, (input: any) => healthRepo.listIncidents(input))
  handle('health:medications', PERMISSIONS.CHILDREN_READ, (input: any) => healthRepo.listMedications(input))
  handle('health:criticalAllergies', PERMISSIONS.CHILDREN_READ, () => healthRepo.listCriticalAllergies())
  handle('health:recordClinicVisit', PERMISSIONS.CHILDREN_WRITE, (input: any, ctx) => healthRepo.recordClinicVisit(input, ctx.userId ?? undefined))
  handle('health:recordIncident', PERMISSIONS.CHILDREN_WRITE, (input: any, ctx) => healthRepo.recordIncident(input, ctx.userId ?? undefined))
  handle('health:recordMedication', PERMISSIONS.CHILDREN_WRITE, (input: any, ctx) => healthRepo.recordMedication(input, ctx.userId ?? undefined))

  // ── الموظفون وإدارة الكادر ─────────────────────────────────
  handle('staff:stats', PERMISSIONS.STAFF_READ, (input: any) => staffRepo.getStats(input?.date))
  handle('staff:list', PERMISSIONS.STAFF_READ, (input: any) => staffRepo.list(input))
  handle('staff:get', PERMISSIONS.STAFF_READ, (input: any) => staffRepo.getById(input.id))
  handle('staff:create', PERMISSIONS.STAFF_WRITE, (input: any, ctx) => staffRepo.create(input, ctx.userId ?? undefined))
  handle('staff:update', PERMISSIONS.STAFF_WRITE, (input: any, ctx) => staffRepo.update(input, ctx.userId ?? undefined))
  handle('staff:attendance:list', PERMISSIONS.STAFF_READ, (input: any) => staffRepo.listAttendance(input?.date))
  handle('staff:attendance:record', PERMISSIONS.STAFF_WRITE, (input: any) => staffRepo.recordAttendance(input))
  handle('staff:attendance:batch', PERMISSIONS.STAFF_WRITE, (input: any) => staffRepo.batchRecordAttendance(input))
  handle('staff:leaves:list', PERMISSIONS.STAFF_READ, (input: any) => staffRepo.listLeaves(input?.staffId))
  handle('staff:leaves:create', PERMISSIONS.STAFF_WRITE, (input: any, ctx) => staffRepo.createLeave(input, ctx.userId ?? undefined))

  // ── المالية ─────────────────────────────────────────────────
  handle('invoices:list', PERMISSIONS.FINANCE_READ, (input: any) => financeService.list(input))
  handle('invoices:get', PERMISSIONS.FINANCE_READ, (input: any) => financeService.getById(input.id))
  handle('invoices:create', PERMISSIONS.FINANCE_WRITE, (input: any) => financeService.createDraft(input))
  handle('invoices:createAndIssue', PERMISSIONS.FINANCE_WRITE, (input: any, ctx) => financeService.createAndIssue(input, ctx.userId ?? undefined))
  handle('invoices:issue', PERMISSIONS.FINANCE_WRITE, (input: any, ctx) => financeService.issue(input.id, ctx.userId ?? undefined))
  handle('invoices:listByChild', PERMISSIONS.FINANCE_READ, (input: any) => dashboardRepo.getInvoicesByChild(input.childId, input.status))
  handle('invoices:generateMonthly', PERMISSIONS.FINANCE_WRITE, (input: any, ctx) => financeService.generateMonthly(input, ctx.userId ?? undefined))
  handle('payments:record', PERMISSIONS.FINANCE_WRITE, (input: any, ctx) => financeService.recordPayment(input, ctx.userId ?? undefined))
  handle('payments:recent', PERMISSIONS.FINANCE_READ, (input: any) => dashboardRepo.getRecentPayments(input?.limit ?? 10))

  // ── لوحة المؤشرات ───────────────────────────────────────────
  handle('dashboard:stats', PERMISSIONS.CHILDREN_READ, () => dashboardRepo.getStats())

  // ── النسخ الاحتياطي والتشخيص ─────────────────────────────────
  handle('backup:create', PERMISSIONS.BACKUP_WRITE, (input: any) => createBackup(input?.destDir))
  handle('backup:list', PERMISSIONS.BACKUP_WRITE, () => listBackups())
  handle('app:diagnostics', null, () => {
    const sqlite = getSqlite()
    const getCount = (table: string) => {
      try {
        return (sqlite.prepare(`select count(*) as c from ${table}`).get() as any)?.c ?? 0
      } catch {
        return 0
      }
    }
    const childrenCount = getCount('children')
    const guardiansCount = getCount('guardians')
    const staffCount = getCount('staff')
    const attendanceCount = getCount('attendance_records')
    const invoicesCount = getCount('invoices')
    const totalRecords = childrenCount + guardiansCount + staffCount + attendanceCount + invoicesCount

    return {
      dbPath: getDbPath(),
      dbSize: (() => { try { return (sqlite.prepare("select page_count*page_size as s from pragma_page_count, pragma_page_size").get() as any)?.s ?? 0 } catch { return 0 } })(),
      backups: listBackups().length,
      totalRecords,
      recordsBreakdown: {
        children: childrenCount,
        guardians: guardiansCount,
        staff: staffCount,
        attendance: attendanceCount,
        invoices: invoicesCount
      }
    }
  })

  // ── الإعدادات وإدارة النظام ────────────────────────────────────
  handle('settings:getAll', PERMISSIONS.CHILDREN_READ, () => settingsRepo.getAll())
  handle('settings:get', PERMISSIONS.CHILDREN_READ, (input: any) => settingsRepo.get(input.key))
  handle('settings:set', PERMISSIONS.SETTINGS_WRITE, (input: any) => { settingsRepo.set(input.key, input.value); return true })
  handle('settings:setMany', PERMISSIONS.SETTINGS_WRITE, (input: any) => { settingsRepo.setMany(input.entries); return true })
  handle('settings:vacuum', PERMISSIONS.SETTINGS_WRITE, () => settingsRepo.vacuum())

  // ── التوقيت والجدول الزمني ────────────────────────────────────
  handle('timetable:listPeriods', null, (input: any) => timetableRepo.listPeriods(input?.classroomId))
  handle('timetable:savePeriod', PERMISSIONS.CHILDREN_WRITE, (input: any) => timetableRepo.savePeriod(input))
  handle('timetable:deletePeriod', PERMISSIONS.CHILDREN_WRITE, (input: any) => timetableRepo.deletePeriod(input.id))
  handle('timetable:listDuties', null, (input: any) => timetableRepo.listStaffDuties(input?.dayOfWeek))
  handle('timetable:saveDuty', PERMISSIONS.CHILDREN_WRITE, (input: any) => timetableRepo.saveStaffDuty(input))
  handle('timetable:deleteDuty', PERMISSIONS.CHILDREN_WRITE, (input: any) => timetableRepo.deleteStaffDuty(input.id))

  // ── نافذة التطبيق ──────────────────────────────────────────
  handle('window:minimize', null, (_input: any, ctx: any) => {
    const win = BrowserWindow.fromWebContents(ctx.event?.sender) || BrowserWindow.getFocusedWindow()
    win?.minimize()
    return true
  })
  handle('window:maximize', null, (_input: any, ctx: any) => {
    const win = BrowserWindow.fromWebContents(ctx.event?.sender) || BrowserWindow.getFocusedWindow()
    if (!win) return false
    if (win.isMaximized()) { win.unmaximize(); return false }
    else { win.maximize(); return true }
  })
  handle('window:close', null, (_input: any, ctx: any) => {
    const win = BrowserWindow.fromWebContents(ctx.event?.sender) || BrowserWindow.getFocusedWindow()
    win?.close()
    return true
  })
  handle('window:isMaximized', null, (_input: any, ctx: any) => {
    const win = BrowserWindow.fromWebContents(ctx.event?.sender) || BrowserWindow.getFocusedWindow()
    return win?.isMaximized() ?? false
  })
}
