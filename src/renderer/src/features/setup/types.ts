export type SetupStep = 1 | 2 | 3 | 4 | 5 | 6

export interface SetupClassroomItem {
  id: string
  name: string
  room: string
  capacity: number
}

export interface SetupFormData {
  // الخطوة 1: فحص النظام والشروط
  agreedToTerms: boolean

  // الخطوة 2: هوية الروضة
  branchName: string
  licenseNumber: string
  city: string
  phone: string
  email: string
  logoDataUrl: string
  academicYear: string
  currency: string
  timeFormat: '12h' | '24h'

  // الخطوة 3: حساب المشرف العام
  adminUsername: string
  adminDisplayName: string
  adminPassword: string
  adminConfirmPassword: string
  adminPin: string
  recoveryKey: string

  // الخطوة 4: الفصول الدراسية
  classrooms: SetupClassroomItem[]

  // الخطوة 5: العتاد والطابعات
  documentPrinter: string
  receiptPrinter: string
  cardPrinter: string
}

export interface StepMeta {
  step: SetupStep
  title: string
  subtitle: string
  iconName: string
}
