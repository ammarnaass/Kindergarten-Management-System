export type PeriodCategory =
  | 'arrival'
  | 'assembly'
  | 'circle'
  | 'meal'
  | 'play'
  | 'outdoor'
  | 'nap'
  | 'closing'
  | 'pickup'
  | 'custom'

export interface TimetablePeriod {
  id: string
  classroomId?: string | null
  periodNumber: number
  title: string
  category: PeriodCategory | string
  startTime: string // "08:45"
  endTime: string   // "09:30"
  color: string
  icon: string
  supervisorStaffId?: string | null
  supervisorStaffName?: string | null
  notes?: string | null
  isActive: boolean
}

export type DutyLocation = 'main_gate' | 'playground' | 'dining_hall' | 'bus_zone' | 'corridors'

export interface StaffDuty {
  id: string
  staffId: string
  staffName?: string | null
  dutyLocation: DutyLocation | string
  dutyLocationTitle?: string
  dayOfWeek: number // 0 = Sunday, 4 = Thursday
  startTime: string
  endTime: string
  notes?: string | null
}

export interface CurrentPeriodStatus {
  currentPeriod: TimetablePeriod | null
  nextPeriod: TimetablePeriod | null
  minutesRemaining: number
  progressPercent: number
  isSchoolHours: boolean
  statusText: string
}
