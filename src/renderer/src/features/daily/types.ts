import type { ClassroomItem, DailyClassroomChild } from '@/lib/api/types'

export type MoodType = 'happy' | 'calm' | 'active' | 'tired' | 'fussy'
export type FoodValue = 'full' | 'half' | 'none'
export type NapValue = 'good_sleep' | 'rested' | 'restless'
export type DailyFilterStatus = 'all' | 'pending' | 'completed' | 'absent' | 'allergy'

export interface DailyReportFormState {
  mood: MoodType | null
  breakfastValue: FoodValue | null
  breakfastNote: string
  lunchValue: FoodValue | null
  lunchNote: string
  snackNote: string
  napValue: NapValue | null
  napTime: string
  activities: string
  teacherNote: string
  guardianNotice: string
  isSaved: boolean
}

export interface DailyStats {
  total: number
  completed: number
  absent: number
  withAllergies: number
  percent: number
}

export type { ClassroomItem, DailyClassroomChild }
