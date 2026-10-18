import type { StaffStats, StaffMember, StaffAttendanceItem, StaffLeaveItem } from '@/lib/api/types'

export type ActiveTab = 'attendance' | 'directory' | 'leaves'
export type DirectoryViewMode = 'table' | 'cards'
export type AttendanceStatusType = 'present' | 'absent' | 'late' | 'excused'

export type AttendanceDraftMap = Record<
  string,
  { status: AttendanceStatusType; note: string }
>

export type { StaffStats, StaffMember, StaffAttendanceItem, StaffLeaveItem }
