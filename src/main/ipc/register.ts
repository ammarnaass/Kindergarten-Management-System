import { ipcMain } from 'electron'
import { ipcContract, type Channel } from '@shared/ipc-contract'
import { requirePermission } from '../security/permissions'
import { session } from '../security/session'
import { toAppError } from './errors'
import log from '../infra/logger'

function assertTrustedSender(event: Electron.IpcMainInvokeEvent) {
  const url = event.senderFrame?.url ?? ''
  if (url && !(url.startsWith('file://') || url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1'))) {
    const e: any = new Error('مصدر غير موثوق')
    e.code = 'FORBIDDEN'
    throw e
  }
}

export function handle<C extends Channel>(
  channel: C,
  permission: string | null,
  fn: (input: any, ctx: { userId: string | null }) => unknown
) {
  ipcMain.handle(channel, (event, raw) => {
    try {
      assertTrustedSender(event)
      let userId: string | null = session.get()?.id ?? null
      if (permission) userId = requirePermission(permission).id
      const input = (ipcContract[channel] as any).input.parse(raw)
      const data = fn(input, { userId, event } as any)
      return { ok: true, data }
    } catch (e) {
      log.warn(`ipc ${channel} failed`, e)
      return { ok: false, error: toAppError(e) }
    }
  })
}
