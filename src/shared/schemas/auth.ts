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
  fullName: z.string().min(3, 'الاسم مطلوب'),
  roleTitle: z.string().default('مدير النظام / المشرف العام'),
  nationalId: z.string().regex(/^[12]\d{9}$/, 'رقم الهوية الوطنية/الإقامة 10 أرقام تبدأ بـ 1 أو 2').optional().or(z.literal('')),
  phone: z.string().min(9, 'رقم الجوال مطلوب').optional().or(z.literal('')),
  adminEmail: z.string().email('صيغة البريد الإلكتروني غير صحيحة').optional().or(z.literal('')),
  username: z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل').max(50),
  password: z.string().min(8, 'كلمة المرور 8 خانات على الأقل'),
  pinCode: z.string().min(4).max(6).optional().or(z.literal('')),
  recoveryKey: z.string().optional(),
  securityQuestions: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
})
export type SuperAdminRegisterInput = z.infer<typeof superAdminRegisterSchema>

export const userCreateSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل').max(50),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
  displayName: z.string().min(2, 'الاسم الكامل مطلوب'),
  roleId: z.string().min(1, 'الدور الوظيفي مطلوب'),
  roleTitle: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  pinCode: z.string().min(4).max(6).optional(),
  avatarIcon: z.string().optional(),
  isActive: z.boolean().default(true)
})
export type UserCreate = z.infer<typeof userCreateSchema>

export const userUpdateSchema = z.object({
  id: z.string().uuid('معرف المستخدم غير صحيح'),
  displayName: z.string().min(2, 'الاسم الكامل مطلوب'),
  roleId: z.string().min(1, 'الدور الوظيفي مطلوب'),
  roleTitle: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  avatarIcon: z.string().optional(),
  isActive: z.boolean().optional()
})
export type UserUpdate = z.infer<typeof userUpdateSchema>

export const userResetPasswordSchema = z.object({
  id: z.string().uuid('معرف المستخدم غير صحيح'),
  newPassword: z.string().min(6, 'كلمة المرور الجديدة 6 أحرف على الأقل')
})
export type UserResetPassword = z.infer<typeof userResetPasswordSchema>

export const userResetPinSchema = z.object({
  id: z.string().uuid('معرف المستخدم غير صحيح'),
  newPin: z.string().min(4, 'رمز PIN لا يقل عن 4 أرقام').max(6, 'رمز PIN لا يزيد عن 6 أرقام').nullable()
})
export type UserResetPin = z.infer<typeof userResetPinSchema>

export const userToggleActiveSchema = z.object({
  id: z.string().uuid('معرف المستخدم غير صحيح'),
  isActive: z.boolean()
})
export type UserToggleActive = z.infer<typeof userToggleActiveSchema>

export const userDeleteSchema = z.object({
  id: z.string().uuid('معرف المستخدم غير صحيح')
})
export type UserDelete = z.infer<typeof userDeleteSchema>


