import { z } from 'zod'

export const attendanceEntrySchema = z.object({
  childId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  checkInAt: z.number().optional().nullable(),
  checkOutAt: z.number().optional().nullable(),
  pickedUpBy: z.string().optional().nullable(),
  note: z.string().optional().nullable()
})

export const attendanceMarkSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z.array(attendanceEntrySchema).min(1)
})
export type AttendanceMark = z.infer<typeof attendanceMarkSchema>

export const attendanceFilterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  classroomId: z.string().uuid().optional().nullable(),
  childId: z.string().uuid().optional().nullable()
})
export type AttendanceFilter = z.infer<typeof attendanceFilterSchema>
