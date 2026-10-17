import { z } from 'zod'

export const invoiceItemSchema = z.object({
  feeTypeId: z.string().uuid().optional().nullable(),
  label: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  unitCents: z.number().int().min(0)
})

export const invoiceCreateSchema = z.object({
  childId: z.string().uuid(),
  period: z.string().regex(/^\d{4}-\d{2}$/).optional().nullable(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  discountCents: z.number().int().min(0).default(0),
  items: z.array(invoiceItemSchema).min(1)
})
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>

export const paymentCreateSchema = z.object({
  invoiceId: z.string().uuid(),
  amountCents: z.number().int().min(1),
  method: z.enum(['cash', 'transfer', 'card', 'cheque']),
  paidAt: z.number().optional()
})
export type PaymentCreate = z.infer<typeof paymentCreateSchema>

export const invoiceFilterSchema = z.object({
  status: z.enum(['all', 'draft', 'issued', 'partial', 'paid', 'void', 'overdue']).optional().default('all'),
  search: z.string().optional().default(''),
  period: z.string().optional(),
  classroomId: z.string().optional(),
  limit: z.number().int().min(1).max(200).default(50),
  offset: z.number().int().min(0).default(0)
})
export type InvoiceFilter = z.infer<typeof invoiceFilterSchema>
export type InvoiceFilterInput = z.input<typeof invoiceFilterSchema>

export const monthlyBillingSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/, 'صيغة الشهر YYYY-MM'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  label: z.string().min(1, 'عنوان الرسم مطلوب'),
  unitCents: z.number().int().min(1, 'المبلغ مطلوب'),
  classroomId: z.string().optional()
})
export type MonthlyBilling = z.infer<typeof monthlyBillingSchema>
