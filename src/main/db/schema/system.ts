import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { id, timestamps } from './_shared'

export const roles = sqliteTable('roles', {
  id: id(),
  name: text('name').notNull().unique(),
  description: text('description'),
  ...timestamps
})

export const permissions = sqliteTable('permissions', {
  id: id(),
  code: text('code').notNull().unique(),
  description: text('description')
})

export const rolePermissions = sqliteTable('role_permissions', {
  roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: text('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' })
})

export const users = sqliteTable('users', {
  id: id(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  roleId: text('role_id').references(() => roles.id, { onDelete: 'set null' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  ...timestamps
}, (t) => ({
  users_role_idx: index('users_role_idx').on(t.roleId)
})
)

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})
export const auditLogs = sqliteTable('audit_logs', {
  id: id(),
  userId: text('user_id'),
  action: text('action').notNull(),
  entityId: text('entity_id'),
  detail: text('detail'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
}, (t) => ({
  audit_action_idx: index('audit_action_idx').on(t.action)
})
)

export const sequences = sqliteTable('sequences', {
  name: text('name').primaryKey(),
  lastValue: integer('last_value').notNull().default(0),
  prefix: text('prefix').notNull().default('')
})

export const appMeta = sqliteTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
})
