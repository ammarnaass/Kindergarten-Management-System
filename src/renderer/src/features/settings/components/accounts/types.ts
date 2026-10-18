import type { DetailedUserItem, RoleWithPermissionsItem } from '@/lib/api/types'

export type UserRoleFilter = 'all' | 'admin' | 'educator' | 'accountant' | 'staff'
export type UserStatusFilter = 'all' | 'active' | 'inactive'

export interface AccountsFilterState {
  search: string
  role: UserRoleFilter
  status: UserStatusFilter
}

export type ModalType = 'none' | 'add' | 'edit' | 'reset-password' | 'reset-pin'

export interface ActiveModalState {
  type: ModalType
  user: DetailedUserItem | null
}
