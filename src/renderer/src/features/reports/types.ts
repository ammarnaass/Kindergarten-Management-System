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

export interface AttendanceRecordItem {
  id: string
  childId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  checkInAt?: number | null
  checkOutAt?: number | null
  pickedUpBy?: string | null
  note?: string | null
}

export type {
  ChildItem,
  ClassroomItem,
  InvoiceItem,
  CriticalAllergyChild,
  ClinicVisitItem
}
