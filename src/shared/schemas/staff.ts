import { z } from 'zod'

export const staffRoleEnum = z.enum([
  'معلمة رياض أطفال',
  'مساعدة معلمة',
  'أخصائية نطق وتخاطب',
  'ممرضة صحية',
  'إدارية شؤون أطفال',
  'مشرفة نقل وحافلات',
  'عاملة رعاية وخدمات',
  'أخرى'
])

export const staffCreateSchema = z.object({
  firstName: z.string().trim().min(2, 'الاسم الأول مطلوب حرفان على الأقل'),
  lastName: z.string().trim().min(2, 'اسم العائلة مطلوب'),
  role: z.string().trim().min(2, 'المسمى الوظيفي مطلوب'),
  phone: z.string().trim().optional().nullable(),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').optional().nullable().or(z.literal('')),
  salaryCents: z.number().int().min(0).default(0),
  hiredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD').optional().nullable(),
  isActive: z.boolean().default(true)
})

export type StaffCreateInput = z.infer<typeof staffCreateSchema>

export const staffUpdateSchema = staffCreateSchema.partial().extend({
  id: z.string().uuid()
})

export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>

export const staffFilterSchema = z.object({
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional()
})

export type StaffFilterInput = z.infer<typeof staffFilterSchema>

export const staffAttendanceStatusEnum = z.enum(['present', 'absent', 'late', 'excused'])

export const staffAttendanceRecordSchema = z.object({
  staffId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  status: staffAttendanceStatusEnum,
  note: z.string().trim().optional().nullable()
})

export type StaffAttendanceRecordInput = z.infer<typeof staffAttendanceRecordSchema>

export const staffAttendanceBatchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  records: z.array(
    z.object({
      staffId: z.string().uuid(),
      status: staffAttendanceStatusEnum,
      note: z.string().trim().optional().nullable()
    })
  ).min(1, 'يجب تقديم سجل واحد على الأقل')
})

export type StaffAttendanceBatchInput = z.infer<typeof staffAttendanceBatchSchema>

export const leaveCreateSchema = z.object({
  staffId: z.string().uuid(),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  reason: z.string().trim().optional().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending')
})

export type LeaveCreateInput = z.infer<typeof leaveCreateSchema>
