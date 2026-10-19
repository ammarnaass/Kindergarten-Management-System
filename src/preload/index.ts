import { contextBridge, ipcRenderer } from 'electron'
import type { Channel } from '@shared/ipc-contract'
import type { IpcResult } from '@shared/ipc-contract'

const ALLOWED: Channel[] = [
  'auth:login','auth:loginPin','auth:logout','auth:me','auth:listUsers','auth:checkSetup','auth:registerSuperAdmin',
  'users:list','users:get','users:create','users:update','users:resetPassword','users:resetPin','users:toggleActive','users:delete','roles:list',
  'system:integrityCheck','system:isInstalled','system:completeSetup','system:getPrinters','system:openPath','system:selectDirectory',
  'children:list','children:get','children:guardians','children:pickups','children:createPickup',
  'children:create','children:update','children:remove','children:birthdaysSoon',
  'guardians:create','children:linkGuardian',
  'classrooms:list','classrooms:attendance',
  'attendance:mark','attendance:list',
  'daily:get','daily:save','daily:listByClassroom',
  'health:stats','health:clinicVisits','health:incidents','health:medications','health:criticalAllergies',
  'health:recordClinicVisit','health:recordIncident','health:recordMedication',
  'staff:stats','staff:list','staff:get','staff:create','staff:update','staff:delete',
  'staff:attendance:list','staff:attendance:record','staff:attendance:batch',
  'staff:leaves:list','staff:leaves:create',
  'invoices:list','invoices:get','invoices:create','invoices:createAndIssue','invoices:issue','invoices:listByChild','invoices:generateMonthly',
  'dashboard:stats',
  'timetable:listPeriods','timetable:savePeriod','timetable:deletePeriod','timetable:listDuties','timetable:saveDuty','timetable:deleteDuty',
  'backup:create','backup:list','app:diagnostics',
  'settings:getAll','settings:get','settings:set','settings:setMany','settings:vacuum',
  'window:minimize','window:maximize','window:close','window:isMaximized'
]

const api = {
  invoke: async (channel: Channel, payload?: unknown): Promise<unknown> => {
    if (!ALLOWED.includes(channel)) throw new Error('قناة غير مسموحة')
    const res = (await ipcRenderer.invoke(channel, payload)) as IpcResult
    if (!res.ok) { const e: any = new Error(res.error.message); e.code = res.error.code; e.details = res.error.details; throw e }
    return res.data
  },
  on: (channel: string, cb: (...a: any[]) => void) => {
    const allowed = ['backup:progress','update:available','db:locked','app:notify']
    if (!allowed.includes(channel)) return () => {}
    const fn = (_: any, ...args: any[]) => cb(...args)
    ipcRenderer.on(channel, fn)
    return () => ipcRenderer.removeListener(channel, fn)
  }
}

contextBridge.exposeInMainWorld('api', api)
export type Api = typeof api
