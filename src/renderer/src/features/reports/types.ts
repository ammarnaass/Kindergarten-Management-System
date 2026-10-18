import type {
  ChildItem,
  ClassroomItem,
  InvoiceItem,
  CriticalAllergyChild,
  ClinicVisitItem
} from '@/lib/api/types'

export type ReportType =
  | 'roster'
  | 'cards'
  | 'attendance'
  | 'finance'
  | 'clinic'
  | 'registration'
  | 'receipt'

export type {
  ChildItem,
  ClassroomItem,
  InvoiceItem,
  CriticalAllergyChild,
  ClinicVisitItem
}
