// src/shared/constants.ts — ثوابت مشتركة بين main و renderer
export const APP_NAME = 'روضتي'
export const DB_FILE_NAME = 'rawdati.db'
export const BACKUP_KEEP_COUNT = 30
export const SCHEMA_VERSION = 1

export const ATTENDANCE_STATUS = ['present', 'absent', 'late', 'excused'] as const
export const CHILD_STATUS = ['active', 'waitlist', 'graduated', 'withdrawn'] as const
export const GENDER = ['male', 'female'] as const
export const INVOICE_STATUS = ['draft', 'issued', 'partial', 'paid', 'void'] as const
export const PAYMENT_METHOD = ['cash', 'transfer', 'card', 'cheque'] as const

export const PERMISSIONS = {
  CHILDREN_READ: 'children.read',
  CHILDREN_WRITE: 'children.write',
  ATTENDANCE_READ: 'attendance.read',
  ATTENDANCE_WRITE: 'attendance.write',
  FINANCE_READ: 'finance.read',
  FINANCE_WRITE: 'finance.write',
  STAFF_READ: 'staff.read',
  STAFF_WRITE: 'staff.write',
  HEALTH_READ: 'health.read',
  HEALTH_WRITE: 'health.write',
  SETTINGS_WRITE: 'settings.write',
  BACKUP_WRITE: 'backup.write'
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
