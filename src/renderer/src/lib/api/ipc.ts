import { ipc } from '../ipc'
import type { AppApi } from './types'

export const ipcApi: AppApi = {
  auth: {
    login: (input) => ipc('auth:login', input),
    loginPin: (input) => ipc('auth:loginPin', input),
    logout: () => ipc('auth:logout'),
    me: () => ipc('auth:me'),
    listUsers: () => ipc('auth:listUsers'),
    checkSetup: () => ipc('auth:checkSetup'),
    registerSuperAdmin: (input) => ipc('auth:registerSuperAdmin', input),
    createUser: (input) => ipc('users:create', input)
  },
  users: {
    list: () => ipc('users:list'),
    get: (id) => ipc('users:get', { id }),
    create: (input) => ipc('users:create', input),
    update: (input) => ipc('users:update', input),
    resetPassword: (input) => ipc('users:resetPassword', input),
    resetPin: (input) => ipc('users:resetPin', input),
    toggleActive: (input) => ipc('users:toggleActive', input),
    delete: (id) => ipc('users:delete', { id }),
    listRoles: () => ipc('roles:list')
  },
  system: {
    integrityCheck: () => ipc('system:integrityCheck'),
    isInstalled: () => ipc('system:isInstalled'),
    completeSetup: (payload) => ipc('system:completeSetup', payload),
    getPrinters: () => ipc('system:getPrinters'),
    openPath: (path: string) => ipc('system:openPath', { path }),
    selectDirectory: () => ipc('system:selectDirectory')
  },
  children: {
    list: (filter) => ipc('children:list', filter),
    get: (id) => ipc('children:get', { id }),
    create: (input) => ipc('children:create', input),
    update: (input) => ipc('children:update', input),
    remove: (id) => ipc('children:remove', { id }),
    getGuardians: (id) => ipc('children:guardians', { id }),
    getPickups: (id) => ipc('children:pickups', { id }),
    createPickup: (input) => ipc('children:createPickup', input),
    createGuardian: (input) => ipc('guardians:create', input),
    linkGuardian: (input) => ipc('children:linkGuardian', input),
    birthdaysSoon: (withinDays = 7) => ipc('children:birthdaysSoon', { withinDays })
  },
  guardians: {
    list: () => ipc('guardians:list'),
    allPickups: () => ipc('guardians:allPickups'),
    create: (input) => ipc('guardians:create', input),
    linkChild: (input) => ipc('children:linkGuardian', input),
    removePickup: (id) => ipc('children:removePickup', { id })
  },
  classrooms: {
    list: () => ipc<any[]>('classrooms:list'),
    attendance: (date?: string) => ipc<any[]>('classrooms:attendance', date ? { date } : undefined),
    create: (input: { name: string; capacity?: number; room?: string | null; teacherId?: string | null }) =>
      ipc<any>('classrooms:create', input),
    update: (input: { id: string; name?: string; capacity?: number; room?: string | null; teacherId?: string | null }) =>
      ipc<any>('classrooms:update', input),
    delete: (id: string) => ipc<boolean>('classrooms:delete', { id })
  },
  attendance: {
    mark: (date, entries) => ipc('attendance:mark', { date, entries }),
    list: (filter) => ipc('attendance:list', filter)
  },
  daily: {
    get: (childId, date) => ipc('daily:get', { childId, date }),
    save: (input) => ipc('daily:save', input),
    listByClassroom: (classroomId, date) => ipc('daily:listByClassroom', { classroomId, date })
  },
  health: {
    stats: (date?) => ipc('health:stats', date ? { date } : undefined),
    clinicVisits: (filter?) => ipc('health:clinicVisits', filter),
    incidents: (filter?) => ipc('health:incidents', filter),
    medications: (filter?) => ipc('health:medications', filter),
    criticalAllergies: () => ipc('health:criticalAllergies'),
    recordClinicVisit: (input) => ipc('health:recordClinicVisit', input),
    recordIncident: (input) => ipc('health:recordIncident', input),
    recordMedication: (input) => ipc('health:recordMedication', input)
  },
  staff: {
    stats: (date?) => ipc('staff:stats', date ? { date } : undefined),
    list: (filter?) => ipc('staff:list', filter),
    get: (id) => ipc('staff:get', { id }),
    create: (input) => ipc('staff:create', input),
    update: (input) => ipc('staff:update', input),
    delete: (id) => ipc('staff:delete', { id }),
    listAttendance: (date?) => ipc('staff:attendance:list', date ? { date } : undefined),
    recordAttendance: (input) => ipc('staff:attendance:record', input),
    batchRecordAttendance: (input) => ipc('staff:attendance:batch', input),
    listLeaves: (staffId?) => ipc('staff:leaves:list', staffId ? { staffId } : undefined),
    createLeave: (input) => ipc('staff:leaves:create', input)
  },
  finance: {
    list: (filter) => ipc('invoices:list', filter),
    get: (id) => ipc('invoices:get', { id }),
    createDraft: (input) => ipc('invoices:create', input),
    createAndIssue: (input) => ipc('invoices:createAndIssue', input),
    issue: (id) => ipc('invoices:issue', { id }),
    listByChild: (childId, status?) => ipc('invoices:listByChild', { childId, ...(status ? { status } : {}) }),
    generateMonthly: (input) => ipc('invoices:generateMonthly', input),
    recordPayment: (input) => ipc('payments:record', input),
    recentPayments: (limit = 10) => ipc('payments:recent', { limit })
  },
  dashboard: {
    stats: () => ipc('dashboard:stats')
  },
  timetable: {
    listPeriods: (classroomId?) => ipc('timetable:listPeriods', classroomId !== undefined ? { classroomId } : undefined),
    savePeriod: (input) => ipc('timetable:savePeriod', input),
    deletePeriod: (id) => ipc('timetable:deletePeriod', { id }),
    listDuties: (dayOfWeek?) => ipc('timetable:listDuties', dayOfWeek !== undefined ? { dayOfWeek } : undefined),
    saveDuty: (input) => ipc('timetable:saveDuty', input),
    deleteDuty: (id) => ipc('timetable:deleteDuty', { id })
  },
  backup: {
    create: (destDir?) => ipc('backup:create', { destDir }),
    list: () => ipc('backup:list')
  },
  diagnostics: {
    get: () => ipc('app:diagnostics')
  },
  settings: {
    getAll: () => ipc('settings:getAll'),
    get: (key) => ipc('settings:get', { key }),
    set: (key, value) => ipc('settings:set', { key, value }),
    setMany: (entries) => ipc('settings:setMany', { entries }),
    vacuum: () => ipc('settings:vacuum')
  }
}

export const api = ipcApi

