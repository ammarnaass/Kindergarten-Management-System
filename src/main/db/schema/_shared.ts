import { text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const id = () =>
  text('id').primaryKey().$defaultFn(() => crypto.randomUUID())

export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`).$onUpdate(() => new Date()),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
}
