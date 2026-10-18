export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unknown'

export interface ClassroomTeacher {
  id: string
  name: string
}

export interface ClassroomItem {
  id: string
  name: string
  capacity: number
  room: string | null
  schoolYearId?: string | null
  teacher: ClassroomTeacher | null
  totalChildren: number
  presentCount: number
  absentCount: number
  lateCount: number
  progressPercent: number
  createdAt?: string
  updatedAt?: string
}

export interface ClassroomStudent {
  id: string
  firstName: string
  lastName: string
  birthDate?: string
  gender?: 'male' | 'female'
  photoPath?: string | null
  classroomId: string
  allergies?: string | null
  medicalNotes?: string | null
  attendanceStatus: AttendanceStatus
  arrivalTime?: string | null
  departureTime?: string | null
  reportStatus?: 'completed' | 'in_progress' | 'pending' | 'absent'
  mood?: string | null
  summary?: string | null
}

export interface TimetableActivePeriod {
  id?: string
  periodNumber: number
  title: string
  category: string
  startTime: string
  endTime: string
  color: string
  icon: string
  notes?: string | null
}

export interface ClassroomMetricsData {
  totalClassrooms: number
  totalEnrolled: number
  totalCapacity: number
  averageAttendanceRate: number
  presentToday: number
  absentToday: number
  lateToday: number
  utilizationRate: number
}

export interface PickupAlertItem {
  id: string
  childId: string
  childName: string
  guardianName: string
  guardianRelation: string
  time: string
  photoPath?: string | null
}

export interface ActivityTimerPreset {
  id: string
  title: string
  durationMinutes: number
  category: string
  icon: string
}
