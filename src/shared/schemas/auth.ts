import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
})
export type LoginInput = z.infer<typeof loginSchema>

export const loginPinSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  pin: z.string().min(4, 'رمز PIN لا يقل عن 4 أرقام').max(6, 'رمز PIN لا يزيد عن 6 أرقام')
})
export type LoginPinInput = z.infer<typeof loginPinSchema>

export const superAdminRegisterSchema = z.object({
  fullName: z.string().min(3, 'الاسم الرباعي مطلوب'),
  roleTitle: z.string().default('مالك المنشأة / المدير العام التنفيذي'),
  nationalId: z.string().regex(/^[12]\d{9}$/, 'رقم الهوية الوطنية/الإقامة 10 أرقام تبدأ بـ 1 أو 2'),
  phone: z.string().min(9, 'رقم الجوال مطلوب'),
  adminEmail: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  username: z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل').max(50),
  password: z.string().min(8, 'كلمة المرور 8 خانات على الأقل'),
  pinCode: z.string().min(4).max(6).optional(),
  recoveryKey: z.string().optional(),
  securityQuestions: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
})
export type SuperAdminRegisterInput = z.infer<typeof superAdminRegisterSchema>

export const userCreateSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
  displayName: z.string().min(1),
  roleId: z.string().min(1),
  roleTitle: z.string().optional(),
  pinCode: z.string().min(4).max(6).optional(),
  avatarIcon: z.string().optional(),
  isActive: z.boolean().default(true)
})
export type UserCreate = z.infer<typeof userCreateSchema>

