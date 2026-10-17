import { z } from 'zod'

export const childCreateSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب').max(100),
  lastName: z.string().min(1, 'اسم العائلة مطلوب').max(100),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  gender: z.enum(['male', 'female']),
  photoPath: z.string().optional().nullable(),
  classroomId: z.string().uuid().optional().nullable(),
  status: z.enum(['active', 'waitlist', 'graduated', 'withdrawn']).default('active'),
  enrolledAt: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalNotes: z.string().optional().nullable()
})
export type ChildCreate = z.infer<typeof childCreateSchema>

export const childUpdateSchema = childCreateSchema.partial().extend({
  id: z.string().uuid()
})
export type ChildUpdate = z.infer<typeof childUpdateSchema>

export const childFilterSchema = z.object({
  search: z.string().optional().default(''),
  classroomId: z.string().uuid().optional().nullable(),
  status: z.enum(['active', 'waitlist', 'graduated', 'withdrawn']).optional().nullable(),
  limit: z.number().int().min(1).max(200).default(50),
  offset: z.number().int().min(0).default(0)
})
export type ChildFilter = z.infer<typeof childFilterSchema>
export type ChildFilterInput = z.input<typeof childFilterSchema>

export const guardianCreateSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(6).max(20),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  nationalId: z.string().optional().nullable()
})
export type GuardianCreate = z.infer<typeof guardianCreateSchema>

export const childGuardianLinkSchema = z.object({
  childId: z.string().uuid(),
  guardianId: z.string().uuid(),
  relation: z.string().min(1),
  isPrimary: z.boolean().default(false),
  canPickup: z.boolean().default(true)
})
export type ChildGuardianLink = z.infer<typeof childGuardianLinkSchema>

export const authorizedPickupCreateSchema = z.object({
  childId: z.string().uuid(),
  fullName: z.string().min(1).max(100),
  phone: z.string().min(6).max(20).optional().nullable(),
  nationalId: z.string().optional().nullable(),
  note: z.string().optional().nullable()
})
export type AuthorizedPickupCreate = z.infer<typeof authorizedPickupCreateSchema>
