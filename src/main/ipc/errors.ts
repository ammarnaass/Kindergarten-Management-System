import { ZodError } from 'zod'
import type { AppErrorCode } from '@shared/types'

export function toAppError(e: unknown): { code: AppErrorCode; message: string; details?: unknown } {
  if (e instanceof ZodError) return { code: 'VALIDATION', message: 'بيانات غير صالحة', details: e.flatten() }
  const err = e as any
  const code = (err?.code as AppErrorCode) ?? 'UNKNOWN'
  const known: AppErrorCode[] = ['VALIDATION','FORBIDDEN','NOT_FOUND','CONFLICT','DB_LOCKED','UNAUTHORIZED','UNKNOWN']
  return { code: known.includes(code) ? code : 'UNKNOWN', message: err?.message ?? 'خطأ غير متوقع' }
}
