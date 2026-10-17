import { z } from 'zod'

export const periodCategorySchema = z.enum([
  'arrival',
  'assembly',
  'circle',
  'meal',
  'play',
  'outdoor',
  'nap',
  'closing',
  'pickup',
  'custom'
])

export type PeriodCategory = z.infer<typeof periodCategorySchema>

export const timetablePeriodInputSchema = z.object({
  id: z.string().uuid().optional(),
  classroomId: z.string().uuid().nullable().optional(),
  periodNumber: z.number().int().min(1).max(20),
  title: z.string().min(2, 'عنوان الفترة مطلوب'),
  category: periodCategorySchema.default('circle'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'صيغة الوقت يجب أن تكون HH:MM'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'صيغة الوقت يجب أن تكون HH:MM'),
  color: z.string().default('#0284c7'),
  icon: z.string().default('schedule'),
  supervisorStaffId: z.string().uuid().nullable().optional(),
  supervisorStaffName: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().default(true)
})

export type TimetablePeriodInput = z.infer<typeof timetablePeriodInputSchema>

export const staffDutyInputSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string().min(1, 'الموظف المسؤول مطلوب'),
  staffName: z.string().optional(),
  dutyLocation: z.enum(['main_gate', 'playground', 'dining_hall', 'bus_zone', 'corridors']),
  dutyLocationTitle: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6), // 0 = الأحد, 4 = الخميس
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'صيغة الوقت HH:MM'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'صيغة الوقت HH:MM'),
  notes: z.string().nullable().optional()
})

export type StaffDutyInput = z.infer<typeof staffDutyInputSchema>
