import { z } from 'zod'

export const dailyReportItemInputSchema = z.object({
  category: z.string().min(1),
  value: z.string().optional().nullable(),
  note: z.string().optional().nullable()
})
export type DailyReportItemInput = z.infer<typeof dailyReportItemInputSchema>

export const dailyReportSaveSchema = z.object({
  childId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ YYYY-MM-DD'),
  mood: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  items: z.array(dailyReportItemInputSchema).default([])
})
export type DailyReportSave = z.infer<typeof dailyReportSaveSchema>
