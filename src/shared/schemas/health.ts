import { z } from 'zod'

export const clinicVisitCreateSchema = z.object({
  childId: z.string().uuid('معرف الطفل مطلوب'),
  kind: z.string().default('clinic_visit'),
  detail: z.string().min(1, 'تفاصيل المراجعة أو الأعراض مطلوبة'),
  recordedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'صيغة التاريخ YYYY-MM-DD')
})
export type ClinicVisitCreate = z.infer<typeof clinicVisitCreateSchema>

export const incidentCreateSchema = z.object({
  childId: z.string().uuid('معرف الطفل مطلوب'),
  happenedAt: z.string().min(1, 'وقت الحادث مطلوب'),
  description: z.string().min(1, 'وصف الواقعة مطلوب'),
  actionTaken: z.string().optional().nullable(),
  notifiedGuardian: z.boolean().default(false)
})
export type IncidentCreate = z.infer<typeof incidentCreateSchema>

export const medicationLogCreateSchema = z.object({
  childId: z.string().uuid('معرف الطفل مطلوب'),
  medicine: z.string().min(1, 'اسم الدواء مطلوب'),
  dose: z.string().optional().nullable(),
  givenAt: z.string().min(1, 'وقت إعطاء الدواء مطلوب'),
  givenBy: z.string().optional().nullable()
})
export type MedicationLogCreate = z.infer<typeof medicationLogCreateSchema>

export const healthFilterSchema = z.object({
  childId: z.string().uuid().optional(),
  date: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50)
})
export type HealthFilter = z.infer<typeof healthFilterSchema>
