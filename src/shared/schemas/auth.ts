import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
})
export type LoginInput = z.infer<typeof loginSchema>

export const userCreateSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
  displayName: z.string().min(1),
  roleId: z.string().uuid(),
  isActive: z.boolean().default(true)
})
export type UserCreate = z.infer<typeof userCreateSchema>
