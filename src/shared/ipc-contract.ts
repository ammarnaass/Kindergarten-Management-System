import { z } from 'zod'
import { childCreateSchema, childUpdateSchema, childFilterSchema, guardianCreateSchema, childGuardianLinkSchema } from './schemas/children'
import { attendanceMarkSchema, attendanceFilterSchema } from './schemas/attendance'
import { invoiceCreateSchema, paymentCreateSchema } from './schemas/finance'
import { loginSchema, userCreateSchema } from './schemas/auth'

export const ipcContract = {
  'auth:login': { input: loginSchema },
  'auth:logout': { input: z.void() },
  'auth:me': { input: z.void() },
  'users:create': { input: userCreateSchema },
  'children:list': { input: childFilterSchema },
  'children:get': { input: z.object({ id: z.string().uuid() }) },
  'children:guardians': { input: z.object({ id: z.string().uuid() }) },
  'children:pickups': { input: z.object({ id: z.string().uuid() }) },
  'children:create': { input: childCreateSchema },
  'children:update': { input: childUpdateSchema },
  'children:remove': { input: z.object({ id: z.string().uuid() }) },
  'guardians:create': { input: guardianCreateSchema },
  'children:linkGuardian': { input: childGuardianLinkSchema },
  'classrooms:list': { input: z.void().optional() },
  'attendance:mark': { input: attendanceMarkSchema },
  'attendance:list': { input: attendanceFilterSchema },
  'invoices:create': { input: invoiceCreateSchema },
  'invoices:issue': { input: z.object({ id: z.string().uuid() }) },
  'payments:record': { input: paymentCreateSchema },
  'backup:create': { input: z.object({ destDir: z.string().optional() }).optional() },
  'backup:list': { input: z.void() },
  'app:diagnostics': { input: z.void() }
} as const

export type Channel = keyof typeof ipcContract

export type IpcSuccess<T = unknown> = { ok: true; data: T }
export type IpcFailure = { ok: false; error: { code: string; message: string; details?: unknown } }
export type IpcResult<T = unknown> = IpcSuccess<T> | IpcFailure
