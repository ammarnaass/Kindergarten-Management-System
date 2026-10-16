import { ipcApi } from './ipc'
import type { AppApi } from './types'

export const api: AppApi = ipcApi
export * from './types'
