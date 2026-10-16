import type { CurrentUser } from '@shared/types'
let current: CurrentUser | null = null
export const session = {
  get: () => current,
  set: (u: CurrentUser | null) => { current = u },
  require: (): CurrentUser => {
    if (!current) { const e: any = new Error('غير مصرح'); e.code = 'UNAUTHORIZED'; throw e }
    return current
  }
}
