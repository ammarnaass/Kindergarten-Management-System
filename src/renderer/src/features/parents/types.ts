import type {
  GuardianItem,
  AuthorizedPickupItem,
  ChildItem,
  ClassroomItem
} from '@/lib/api'

export type {
  GuardianItem,
  AuthorizedPickupItem,
  ChildItem,
  ClassroomItem
}

export type CategoryTab = 'all' | 'fathers' | 'mothers' | 'pickups' | 'emergency' | 'restricted'
export type ViewMode = 'table' | 'cards'

export interface ParentsStats {
  total: number
  fathersCount: number
  mothersCount: number
  emergencyCount: number
  restrictedCount: number
  totalPickups: number
}
