import { ipc } from '../ipc'
import type { AppApi } from './types'

export const ipcApi: AppApi = {
  children: {
    list: (filter) => ipc('children:list', filter),
    get: (id) => ipc('children:get', { id }),
    create: (input) => ipc('children:create', input),
    update: (input) => ipc('children:update', input),
    remove: (id) => ipc('children:remove', { id }),
    getGuardians: (id) => ipc('children:guardians', { id }),
    getPickups: (id) => ipc('children:pickups', { id }),
    createGuardian: (input) => ipc('guardians:create', input),
    linkGuardian: (input) => ipc('children:linkGuardian', input)
  },
  classrooms: {
    list: () => ipc('classrooms:list')
  },
  attendance: {
    mark: (date, entries) => ipc('attendance:mark', { date, entries }),
    list: (filter) => ipc('attendance:list', filter)
  },
  finance: {
    createDraft: (input) => ipc('invoices:create', input),
    issue: (id) => ipc('invoices:issue', { id }),
    recordPayment: (input) => ipc('payments:record', input)
  },
  backup: {
    create: (destDir) => ipc('backup:create', { destDir }),
    list: () => ipc('backup:list')
  },
  diagnostics: {
    get: () => ipc('app:diagnostics')
  }
}
