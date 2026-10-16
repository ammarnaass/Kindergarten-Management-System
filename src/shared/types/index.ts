export interface CurrentUser { id: string; username: string; displayName: string; role: string; permissions: string[] }
export interface Paged<T> { items: T[]; total: number; limit: number; offset: number }
export type AppErrorCode = 'VALIDATION' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'DB_LOCKED' | 'UNAUTHORIZED' | 'UNKNOWN'
