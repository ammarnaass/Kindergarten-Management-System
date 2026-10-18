import { z } from 'zod'

export const setupPayloadSchema = z.object({
  branch: z.object({
    name: z.string().min(2, 'اسم الروضة مطلوب (حرفين على الأقل)'),
    licenseNumber: z.string().optional().default(''),
    city: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    email: z.string().optional().default(''),
    logoDataUrl: z.string().optional().default(''),
    academicYear: z.string().optional().default('2024-2025'),
    currency: z.string().optional().default('SAR'),
    timeFormat: z.string().optional().default('12h')
  }),
  admin: z.object({
    username: z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل'),
    displayName: z.string().min(2, 'الاسم الكامل مطلوب'),
    password: z.string().min(4, 'كلمة المرور يجب أن تكون 4 خانات على الأقل'),
    pin: z.string().min(4, 'رمز PIN 4 خانات على الأقل').max(6),
    recoveryKey: z.string().min(8, 'مفتاح الاسترداد مطلوب')
  }),
  classrooms: z.array(
    z.object({
      name: z.string().min(2, 'اسم الفصل مطلوب'),
      room: z.string().optional().default(''),
      capacity: z.number().int().min(1).default(20)
    })
  ).min(1, 'يجب تحديد فصل دراسي واحد على الأقل'),
  printers: z.object({
    documentPrinter: z.string().optional().default(''),
    receiptPrinter: z.string().optional().default(''),
    cardPrinter: z.string().optional().default('')
  }).optional().default({ documentPrinter: '', receiptPrinter: '', cardPrinter: '' })
})

export type SetupPayload = z.infer<typeof setupPayloadSchema>
