import type { ChildFilter, ChildCreate, ChildUpdate, GuardianCreate, ChildGuardianLink } from '@shared/schemas/children'
import type { AttendanceFilter } from '@shared/schemas/attendance'
import type { InvoiceCreate, PaymentCreate } from '@shared/schemas/finance'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export interface ChildItem {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: 'male' | 'female'
  photoPath?: string | null
  classroomId?: string | null
  status: 'active' | 'waitlist' | 'graduated' | 'withdrawn'
  enrolledAt?: string | null
  allergies?: string | null
  medicalNotes?: string | null
  createdAt?: number
  updatedAt?: number
}

export interface ClassroomItem {
  id: string
  name: string
  capacity: number
  room?: string | null
  schoolYearId?: string | null
  createdAt?: number
  updatedAt?: number
}

export interface AttendanceEntry {
  childId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  checkInTime?: string | null
  checkOutTime?: string | null
  note?: string | null
}

export interface ChildrenApi {
  list(filter: ChildFilter): Promise<PaginatedResult<ChildItem>>
  get(id: string): Promise<ChildItem | null>
  create(input: ChildCreate): Promise<ChildItem>
  update(input: ChildUpdate): Promise<ChildItem>
  remove(id: string): Promise<boolean>
  getGuardians(childId: string): Promise<any[]>
  getPickups(childId: string): Promise<any[]>
  createGuardian(input: GuardianCreate): Promise<any>
  linkGuardian(input: ChildGuardianLink): Promise<boolean>
}

export interface ClassroomsApi {
  list(): Promise<ClassroomItem[]>
}

export interface AttendanceApi {
  mark(date: string, entries: AttendanceEntry[]): Promise<any>
  list(filter: AttendanceFilter): Promise<any[]>
}

export interface FinanceApi {
  createDraft(input: InvoiceCreate): Promise<any>
  issue(id: string): Promise<any>
  recordPayment(input: PaymentCreate): Promise<any>
}

export interface BackupApi {
  create(destDir?: string): Promise<any>
  list(): Promise<any[]>
}

export interface DiagnosticsApi {
  get(): Promise<any>
}

export interface AppApi {
  children: ChildrenApi
  classrooms: ClassroomsApi
  attendance: AttendanceApi
  finance: FinanceApi
  backup: BackupApi
  diagnostics: DiagnosticsApi
}
