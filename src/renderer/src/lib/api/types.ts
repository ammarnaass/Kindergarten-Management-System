import type { ChildFilterInput, ChildCreate, ChildUpdate, GuardianCreate, ChildGuardianLink, AuthorizedPickupCreate } from '@shared/schemas/children'
import type { AttendanceFilter } from '@shared/schemas/attendance'
import type { InvoiceCreate, PaymentCreate, InvoiceFilterInput, MonthlyBilling } from '@shared/schemas/finance'
import type { DailyReportSave } from '@shared/schemas/daily'
import type { ClinicVisitCreate, IncidentCreate, MedicationLogCreate, HealthFilter } from '@shared/schemas/health'
import type { StaffCreateInput, StaffUpdateInput, StaffFilterInput, StaffAttendanceRecordInput, StaffAttendanceBatchInput, LeaveCreateInput } from '@shared/schemas/staff'
import type { SetupPayload } from '@shared/schemas/setup'

// ── أنواع مشتركة ────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

// ── الأطفال ─────────────────────────────────────────────────
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

export interface BirthdaySoon {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  classroomName: string | null
  turnsAge: number
  daysUntil: number
}

// ── الفصول ──────────────────────────────────────────────────
export interface ClassroomItem {
  id: string
  name: string
  capacity: number
  room?: string | null
  schoolYearId?: string | null
  createdAt?: number
  updatedAt?: number
}

export interface ClassroomAttendanceStat {
  id: string
  name: string
  capacity: number
  room: string | null
  totalChildren: number
  presentCount: number
  absentCount: number
  lateCount: number
  progressPercent: number
}

export interface AttendanceEntry {
  childId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  checkInAt?: number | null
  checkOutAt?: number | null
  pickedUpBy?: string | null
  note?: string | null
}

// ── التقرير اليومي والملاحظات التربوية ───────────────────────
export interface DailyReportItem {
  id: string
  reportId: string
  category: string
  value?: string | null
  note?: string | null
}

export interface DailyReportData {
  id: string
  childId: string
  date: string
  mood?: string | null
  summary?: string | null
  items: DailyReportItem[]
  createdAt?: number
  updatedAt?: number
}

export interface DailyClassroomChild {
  id: string
  firstName: string
  lastName: string
  allergies?: string | null
  medicalNotes?: string | null
  photoPath?: string | null
  classroomId: string
  attendanceStatus: string
  reportStatus: 'completed' | 'in_progress' | 'pending' | 'absent'
  reportId?: string | null
  mood?: string | null
  summary?: string | null
}

export interface DailyApi {
  get(childId: string, date: string): Promise<DailyReportData | null>
  save(input: DailyReportSave): Promise<DailyReportData>
  listByClassroom(classroomId: string, date: string): Promise<DailyClassroomChild[]>
}

// ── الصحة والسلامة والعيادة ─────────────────────────────────
export interface HealthStats {
  targetDate: string
  criticalAllergiesCount: number
  medicationsTodayCount: number
  clinicVisitsTodayCount: number
  incidentsTodayCount: number
}

export interface ClinicVisitItem {
  id: string
  childId: string
  childFirstName: string
  childLastName: string
  classroomName: string | null
  allergies?: string | null
  kind: string
  detail: string
  recordedOn: string
  createdAt?: number
}

export interface IncidentItem {
  id: string
  childId: string
  childFirstName: string
  childLastName: string
  classroomName: string | null
  happenedAt: string
  description: string
  actionTaken?: string | null
  notifiedGuardian: boolean
  createdAt?: number
}

export interface MedicationLogItem {
  id: string
  childId: string
  childFirstName: string
  childLastName: string
  classroomName: string | null
  medicine: string
  dose?: string | null
  givenAt: string
  givenBy?: string | null
  createdAt?: number
}

export interface CriticalAllergyChild {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  classroomId?: string | null
  classroomName?: string | null
  allergies: string
  medicalNotes?: string | null
}

export interface HealthApi {
  stats(date?: string): Promise<HealthStats>
  clinicVisits(filter?: HealthFilter): Promise<ClinicVisitItem[]>
  incidents(filter?: HealthFilter): Promise<IncidentItem[]>
  medications(filter?: HealthFilter): Promise<MedicationLogItem[]>
  criticalAllergies(): Promise<CriticalAllergyChild[]>
  recordClinicVisit(input: ClinicVisitCreate): Promise<any>
  recordIncident(input: IncidentCreate): Promise<any>
  recordMedication(input: MedicationLogCreate): Promise<any>
}

// ── الموظفون والكادر ─────────────────────────────────────────
export interface StaffStats {
  targetDate: string
  totalCount: number
  activeCount: number
  payrollCents: number
  presentCount: number
  lateCount: number
  absentCount: number
  excusedCount: number
  activeLeavesCount: number
}

export interface StaffMember {
  id: string
  firstName: string
  lastName: string
  role: string
  phone: string | null
  email: string | null
  salaryCents: number
  hiredAt: string | null
  isActive: boolean
  createdAt?: number
  updatedAt?: number
  recentAttendance?: any[]
  leaves?: any[]
}

export interface StaffAttendanceItem {
  staffId: string
  firstName: string
  lastName: string
  role: string
  phone: string | null
  attendanceId: string | null
  date: string
  status: 'present' | 'absent' | 'late' | 'excused' | null
  note: string | null
}

export interface StaffAttendanceListResult {
  date: string
  items: StaffAttendanceItem[]
}

export interface StaffLeaveItem {
  id: string
  staffId: string
  staffFirstName: string
  staffLastName: string
  staffRole: string
  fromDate: string
  toDate: string
  reason: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: number
}

export interface StaffApi {
  stats(date?: string): Promise<StaffStats>
  list(filter?: StaffFilterInput): Promise<StaffMember[]>
  get(id: string): Promise<StaffMember | null>
  create(input: StaffCreateInput): Promise<StaffMember>
  update(input: StaffUpdateInput): Promise<StaffMember>
  listAttendance(date?: string): Promise<StaffAttendanceListResult>
  recordAttendance(input: StaffAttendanceRecordInput): Promise<any>
  batchRecordAttendance(input: StaffAttendanceBatchInput): Promise<any>
  listLeaves(staffId?: string): Promise<StaffLeaveItem[]>
  createLeave(input: LeaveCreateInput): Promise<any>
}

// ── المالية ─────────────────────────────────────────────────
export interface InvoiceLineItem {
  id: string
  label: string
  quantity: number
  unitCents: number
}

export interface InvoiceItem {
  id: string
  number: string
  childId: string
  childFirstName?: string
  childLastName?: string
  childPhotoPath?: string | null
  classroomId?: string | null
  classroomName?: string | null
  period?: string | null
  totalCents: number
  discountCents: number
  netCents?: number
  paidCents?: number
  remainingCents?: number
  dueDate: string
  status: 'draft' | 'issued' | 'partial' | 'paid' | 'void'
  isOverdue?: boolean
  items?: InvoiceLineItem[]
  payments?: any[]
  createdAt?: number
}

export interface MonthlyBillingResult {
  generatedCount: number
  skippedCount: number
  totalCents: number
  period: string
}

export interface RecentPayment {
  id: string
  receiptNumber: string
  childFirstName: string
  childLastName: string
  method: string
  amountCents: number
  paidAt: Date | number
  invoiceId: string
}

// ── لوحة المؤشرات ───────────────────────────────────────────
export interface DashboardStats {
  totalChildren: number
  presentToday: number
  absentToday: number
  lateToday: number
  attendanceRate: number
  overdueInvoicesCount: number
  overdueAmountCents: number
  collectedThisMonthCents: number
  totalTargetThisMonthCents: number
  tuitionPercent: number
  lastBackupAt: string | null
}

// ── واجهات الـ API ───────────────────────────────────────────
export interface ChildrenApi {
  list(filter: ChildFilterInput): Promise<PaginatedResult<ChildItem>>
  get(id: string): Promise<ChildItem | null>
  create(input: ChildCreate): Promise<ChildItem>
  update(input: ChildUpdate): Promise<ChildItem>
  remove(id: string): Promise<boolean>
  getGuardians(childId: string): Promise<any[]>
  getPickups(childId: string): Promise<any[]>
  createPickup(input: AuthorizedPickupCreate): Promise<any>
  createGuardian(input: GuardianCreate): Promise<any>
  linkGuardian(input: ChildGuardianLink): Promise<boolean>
  birthdaysSoon(withinDays?: number): Promise<BirthdaySoon[]>
}

export interface GuardianChildLink {
  childId: string
  childName: string
  classroomId: string | null
  relation: string
  isPrimary: boolean
  canPickup: boolean
}

export interface GuardianItem {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  address?: string | null
  nationalId?: string | null
  children: GuardianChildLink[]
  createdAt?: string | null
}

export interface AuthorizedPickupItem {
  id: string
  childId: string
  childName: string
  fullName: string
  phone?: string | null
  nationalId?: string | null
  note?: string | null
  createdAt?: string | null
}

export interface GuardiansApi {
  list(): Promise<GuardianItem[]>
  allPickups(): Promise<AuthorizedPickupItem[]>
  create(input: GuardianCreate): Promise<any>
  linkChild(input: ChildGuardianLink): Promise<boolean>
  removePickup(id: string): Promise<boolean>
}

export interface ClassroomsApi {
  list(): Promise<ClassroomItem[]>
  attendance(date?: string): Promise<ClassroomAttendanceStat[]>
  create(input: { name: string; capacity?: number; room?: string | null; teacherId?: string | null }): Promise<any>
  update(input: { id: string; name?: string; capacity?: number; room?: string | null; teacherId?: string | null }): Promise<any>
  delete(id: string): Promise<boolean>
}

export interface AttendanceApi {
  mark(date: string, entries: AttendanceEntry[]): Promise<any>
  list(filter: AttendanceFilter): Promise<any[]>
}

export interface FinanceApi {
  list(filter?: InvoiceFilterInput): Promise<PaginatedResult<InvoiceItem>>
  get(id: string): Promise<InvoiceItem | null>
  createDraft(input: InvoiceCreate): Promise<any>
  createAndIssue(input: InvoiceCreate): Promise<any>
  issue(id: string): Promise<any>
  listByChild(childId: string, status?: string): Promise<InvoiceItem[]>
  generateMonthly(input: MonthlyBilling): Promise<MonthlyBillingResult>
  recordPayment(input: PaymentCreate): Promise<any>
  recentPayments(limit?: number): Promise<RecentPayment[]>
}

export interface DashboardApi {
  stats(): Promise<DashboardStats>
}

export interface BackupApi {
  create(destDir?: string): Promise<any>
  list(): Promise<any[]>
}

export interface DiagnosticsApi {
  get(): Promise<{
    dbPath: string
    dbSize: number
    backups: number
    totalRecords?: number
    recordsBreakdown?: {
      children: number
      guardians: number
      staff: number
      attendance: number
      invoices: number
    }
  }>
}

export interface SettingsApi {
  getAll(): Promise<Record<string, string>>
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<boolean>
  setMany(entries: Record<string, string>): Promise<boolean>
  vacuum(): Promise<{ initialSize: number; currentSize: number; freedBytes: number }>
}

export interface LocalUserSummary {
  id: string
  username: string
  displayName: string
  role: string
  roleTitle?: string | null
  avatarIcon?: string | null
  hasPin: boolean
  lastLoginAt?: string | null
}

export interface SetupStatus {
  isSetupComplete: boolean
  hasAdmin: boolean
  allowRegistration?: boolean
  userCount: number
}

export interface IntegrityCheckResult {
  ok: boolean
  result: string
  dbPath: string
  journalMode: string
  encryption: string
}

export interface SystemPrinter {
  name: string
  displayName: string
  description: string
  isDefault: boolean
  status: number
}

export interface InstallationStatus {
  isInstalled: boolean
  installedAt?: string | null
  branchName?: string | null
}

export interface SystemApi {
  integrityCheck(): Promise<IntegrityCheckResult>
  isInstalled(): Promise<InstallationStatus>
  completeSetup(payload: SetupPayload): Promise<{ ok: boolean; adminUsername: string; branchName: string }>
  getPrinters(): Promise<SystemPrinter[]>
  openPath(path: string): Promise<boolean>
  selectDirectory(): Promise<string | null>
}

export interface AuthApi {
  login(input: { username: string; password: string }): Promise<any>
  loginPin(input: { username: string; pin: string }): Promise<any>
  logout(): Promise<boolean>
  me(): Promise<any>
  listUsers(): Promise<LocalUserSummary[]>
  checkSetup(): Promise<SetupStatus>
  registerSuperAdmin(input: any): Promise<{ user: any; recoveryKey: string }>
  createUser(input: any): Promise<{ user: any }>
}

export interface DetailedUserItem {
  id: string
  username: string
  displayName: string
  roleId: string
  roleName: string
  roleTitle: string | null
  avatarIcon: string | null
  phone: string | null
  email: string | null
  hasPin: boolean
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string | null
}

export interface RoleWithPermissionsItem {
  id: string
  name: string
  description: string | null
  permissions: string[]
}

export interface UsersApi {
  list(): Promise<DetailedUserItem[]>
  get(id: string): Promise<DetailedUserItem>
  create(input: any): Promise<{ user: any }>
  update(input: any): Promise<DetailedUserItem>
  resetPassword(input: { id: string; newPassword: string }): Promise<boolean>
  resetPin(input: { id: string; newPin: string | null }): Promise<boolean>
  toggleActive(input: { id: string; isActive: boolean }): Promise<boolean>
  delete(id: string): Promise<boolean>
  listRoles(): Promise<RoleWithPermissionsItem[]>
}

export interface TimetablePeriod {
  id: string
  classroomId?: string | null
  periodNumber: number
  title: string
  category: string
  startTime: string
  endTime: string
  color: string
  icon: string
  supervisorStaffId?: string | null
  supervisorStaffName?: string | null
  notes?: string | null
  isActive: boolean
}

export interface StaffDuty {
  id: string
  staffId: string
  staffName?: string | null
  dutyLocation: string
  dayOfWeek: number
  startTime: string
  endTime: string
  notes?: string | null
}

export interface TimetableApi {
  listPeriods(classroomId?: string | null): Promise<TimetablePeriod[]>
  savePeriod(input: any): Promise<TimetablePeriod>
  deletePeriod(id: string): Promise<boolean>
  listDuties(dayOfWeek?: number): Promise<StaffDuty[]>
  saveDuty(input: any): Promise<StaffDuty>
  deleteDuty(id: string): Promise<boolean>
}

export interface AppApi {
  auth: AuthApi
  users: UsersApi
  system: SystemApi
  children: ChildrenApi
  guardians: GuardiansApi
  classrooms: ClassroomsApi
  attendance: AttendanceApi
  daily: DailyApi
  health: HealthApi
  staff: StaffApi
  finance: FinanceApi
  dashboard: DashboardApi
  timetable: TimetableApi
  backup: BackupApi
  diagnostics: DiagnosticsApi
  settings: SettingsApi
}

