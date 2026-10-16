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
