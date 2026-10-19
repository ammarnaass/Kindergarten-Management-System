import { z } from 'zod'
import { childCreateSchema, childUpdateSchema, childFilterSchema, guardianCreateSchema, childGuardianLinkSchema, authorizedPickupCreateSchema } from './schemas/children'
import { attendanceMarkSchema, attendanceFilterSchema } from './schemas/attendance'
import { invoiceCreateSchema, paymentCreateSchema, invoiceFilterSchema, monthlyBillingSchema } from './schemas/finance'
import { dailyReportSaveSchema } from './schemas/daily'
import { clinicVisitCreateSchema, incidentCreateSchema, medicationLogCreateSchema, healthFilterSchema } from './schemas/health'
import { staffCreateSchema, staffUpdateSchema, staffFilterSchema, staffAttendanceRecordSchema, staffAttendanceBatchSchema, leaveCreateSchema } from './schemas/staff'
import {
  loginSchema,
  loginPinSchema,
  superAdminRegisterSchema,
  userCreateSchema,
  userUpdateSchema,
  userResetPasswordSchema,
  userResetPinSchema,
  userToggleActiveSchema,
  userDeleteSchema
} from './schemas/auth'
import { timetablePeriodInputSchema, staffDutyInputSchema } from './schemas/timetable'
import { setupPayloadSchema } from './schemas/setup'

export const ipcContract = {
  'auth:login': { input: loginSchema },
  'auth:loginPin': { input: loginPinSchema },
  'auth:logout': { input: z.void() },
  'auth:me': { input: z.void() },
  'auth:listUsers': { input: z.void().optional() },
  'auth:checkSetup': { input: z.void().optional() },
  'auth:registerSuperAdmin': { input: superAdminRegisterSchema },

  'users:list': { input: z.void().optional() },
  'users:get': { input: z.object({ id: z.string().uuid() }) },
  'users:create': { input: userCreateSchema },
  'users:update': { input: userUpdateSchema },
  'users:resetPassword': { input: userResetPasswordSchema },
  'users:resetPin': { input: userResetPinSchema },
  'users:toggleActive': { input: userToggleActiveSchema },
  'users:delete': { input: userDeleteSchema },
  'roles:list': { input: z.void().optional() },
  'system:integrityCheck': { input: z.void().optional() },
  'system:isInstalled': { input: z.void().optional() },
  'system:completeSetup': { input: setupPayloadSchema },
  'system:getPrinters': { input: z.void().optional() },
  'system:openPath': { input: z.object({ path: z.string() }) },
  'system:selectDirectory': { input: z.void().optional() },

  'children:list': { input: childFilterSchema },
  'children:get': { input: z.object({ id: z.string().uuid() }) },
  'children:guardians': { input: z.object({ id: z.string().uuid() }) },
  'children:pickups': { input: z.object({ id: z.string().uuid() }) },
  'children:createPickup': { input: authorizedPickupCreateSchema },
  'children:removePickup': { input: z.object({ id: z.string().uuid() }) },
  'children:create': { input: childCreateSchema },
  'children:update': { input: childUpdateSchema },
  'children:remove': { input: z.object({ id: z.string().uuid() }) },
  'children:birthdaysSoon': { input: z.object({ withinDays: z.number().int().min(1).max(30).default(7) }).optional() },
  'guardians:create': { input: guardianCreateSchema },
  'guardians:list': { input: z.void().optional() },
  'guardians:allPickups': { input: z.void().optional() },
  'children:linkGuardian': { input: childGuardianLinkSchema },

  'classrooms:list': { input: z.void().optional() },
  'classrooms:attendance': { input: z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).optional() },
  'classrooms:create': {
    input: z.object({
      name: z.string().min(1, 'اسم الفصل مطلوب'),
      capacity: z.number().int().min(1).default(20),
      room: z.string().optional().nullable(),
      teacherId: z.string().uuid().optional().nullable()
    })
  },
  'classrooms:update': {
    input: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      capacity: z.number().int().min(1).optional(),
      room: z.string().optional().nullable(),
      teacherId: z.string().uuid().optional().nullable()
    })
  },
  'classrooms:delete': {
    input: z.object({ id: z.string().uuid() })
  },

  'attendance:mark': { input: attendanceMarkSchema },
  'attendance:list': { input: attendanceFilterSchema },

  'daily:get': { input: z.object({ childId: z.string().uuid(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }) },
  'daily:save': { input: dailyReportSaveSchema },
  'daily:listByClassroom': { input: z.object({ classroomId: z.string().uuid(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }) },

  'health:stats': { input: z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional() },
  'health:clinicVisits': { input: healthFilterSchema.optional() },
  'health:incidents': { input: healthFilterSchema.optional() },
  'health:medications': { input: healthFilterSchema.optional() },
  'health:criticalAllergies': { input: z.void().optional() },
  'health:recordClinicVisit': { input: clinicVisitCreateSchema },
  'health:recordIncident': { input: incidentCreateSchema },
  'health:recordMedication': { input: medicationLogCreateSchema },

  'staff:stats': { input: z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional() },
  'staff:list': { input: staffFilterSchema.optional() },
  'staff:get': { input: z.object({ id: z.string().uuid() }) },
  'staff:create': { input: staffCreateSchema },
  'staff:update': { input: staffUpdateSchema },
  'staff:delete': { input: z.object({ id: z.string().uuid() }) },
  'staff:attendance:list': { input: z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional() },
  'staff:attendance:record': { input: staffAttendanceRecordSchema },
  'staff:attendance:batch': { input: staffAttendanceBatchSchema },
  'staff:leaves:list': { input: z.object({ staffId: z.string().uuid().optional() }).optional() },
  'staff:leaves:create': { input: leaveCreateSchema },

  'invoices:list': { input: invoiceFilterSchema.optional() },
  'invoices:get': { input: z.object({ id: z.string().uuid() }) },
  'invoices:create': { input: invoiceCreateSchema },
  'invoices:createAndIssue': { input: invoiceCreateSchema },
  'invoices:issue': { input: z.object({ id: z.string().uuid() }) },
  'invoices:listByChild': { input: z.object({ childId: z.string().uuid(), status: z.enum(['draft','issued','partial','paid','void']).optional() }) },
  'invoices:generateMonthly': { input: monthlyBillingSchema },
  'payments:record': { input: paymentCreateSchema },
  'payments:recent': { input: z.object({ limit: z.number().int().min(1).max(50).default(10) }).optional() },

  'dashboard:stats': { input: z.void().optional() },
  'timetable:listPeriods': { input: z.object({ classroomId: z.string().uuid().nullable().optional() }).optional() },
  'timetable:savePeriod': { input: timetablePeriodInputSchema },
  'timetable:deletePeriod': { input: z.object({ id: z.string() }) },
  'timetable:listDuties': { input: z.object({ dayOfWeek: z.number().int().min(0).max(6).optional() }).optional() },
  'timetable:saveDuty': { input: staffDutyInputSchema },
  'timetable:deleteDuty': { input: z.object({ id: z.string() }) },

  'backup:create': { input: z.object({ destDir: z.string().optional() }).optional() },
  'backup:list': { input: z.void() },
  'app:diagnostics': { input: z.void() },

  'settings:getAll': { input: z.void().optional() },
  'settings:get': { input: z.object({ key: z.string() }) },
  'settings:set': { input: z.object({ key: z.string(), value: z.string() }) },
  'settings:setMany': { input: z.object({ entries: z.record(z.string()) }) },
  'settings:vacuum': { input: z.void().optional() },

  'window:minimize': { input: z.void().optional() },
  'window:maximize': { input: z.void().optional() },
  'window:close': { input: z.void().optional() },
  'window:isMaximized': { input: z.void().optional() }
} as const

export type Channel = keyof typeof ipcContract

export type IpcSuccess<T = unknown> = { ok: true; data: T }
export type IpcFailure = { ok: false; error: { code: string; message: string; details?: unknown } }
export type IpcResult<T = unknown> = IpcSuccess<T> | IpcFailure
