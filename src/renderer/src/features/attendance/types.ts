import type { ClassroomItem } from '@/lib/api/types'
import type { AttendanceStatus, StudentAttendanceItem } from './components/StudentAttendanceCard'

export interface AttendanceCounts {
  present: number
  absent: number
  late: number
  unmarked: number
  total: number
}

export type { ClassroomItem, AttendanceStatus, StudentAttendanceItem }
