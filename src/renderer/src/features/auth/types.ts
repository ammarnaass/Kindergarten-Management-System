import type { LocalUserSummary } from '@/lib/api/types'

export type AuthMode = 'pin' | 'password'
export type StationTab = 'login' | 'register'

export interface AuthStationFeedback {
  type: 'error' | 'success' | 'info'
  message: string
}

export interface AvatarOption {
  id: string
  label: string
}

export type { LocalUserSummary }
