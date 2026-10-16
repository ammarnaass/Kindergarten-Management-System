import type { Channel } from '@shared/ipc-contract'

declare global { interface Window { api: { invoke: (c: Channel, p?: unknown) => Promise<unknown> } } }

export async function ipc<T>(channel: Channel, payload?: unknown): Promise<T> {
  return (await window.api.invoke(channel, payload)) as T
}
