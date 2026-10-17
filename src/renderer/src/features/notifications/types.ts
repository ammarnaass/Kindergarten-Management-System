export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success'

export type NotificationCategory =
  | 'all'
  | 'critical'
  | 'health'
  | 'gate'
  | 'finance'
  | 'system'
  | 'events'

export interface AppNotification {
  id: string
  title: string
  message: string
  category: 'health' | 'gate' | 'finance' | 'system' | 'events'
  severity: NotificationSeverity
  timestamp: number
  read: boolean
  actionRoute?: string
  actionLabel?: string
  metadata?: Record<string, any>
}

export interface NotificationFilterStats {
  all: number
  critical: number
  health: number
  gate: number
  finance: number
  system: number
  events: number
}
