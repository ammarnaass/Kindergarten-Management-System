import { contextBridge, ipcRenderer } from 'electron'
import type { Channel } from '@shared/ipc-contract'
import type { IpcResult } from '@shared/ipc-contract'

const ALLOWED: Channel[] = [
  'auth:login','auth:logout','auth:me','users:create',
  'children:list','children:get','children:guardians','children:pickups','children:create','children:update','children:remove',
  'guardians:create','children:linkGuardian','classrooms:list',
  'attendance:mark','attendance:list',
  'invoices:create','invoices:issue','payments:record',
  'backup:create','backup:list','app:diagnostics',
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
