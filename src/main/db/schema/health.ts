import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'
import { children } from './children'

export const healthRecords = sqliteTable('health_records', {
  id: id(), childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(), detail: text('detail'), recordedOn: text('recorded_on').notNull(), ...timestamps
}, (t) => ({
  health_child_idx: index('health_child_idx').on(t.childId)
})
)

export const incidents = sqliteTable('incidents', {
  id: id(), childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  happenedAt: text('happened_at').notNull(), description: text('description').notNull(),
  actionTaken: text('action_taken'), notifiedGuardian: integer('notified_guardian', { mode: 'boolean' }).default(false), ...timestamps
})

export const medicationsLog = sqliteTable('medications_log', {
  id: id(), childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  medicine: text('medicine').notNull(), dose: text('dose'), givenAt: text('given_at').notNull(), givenBy: text('given_by'), ...timestamps
})

export const vaccinations = sqliteTable('vaccinations', {
  id: id(), childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  vaccine: text('vaccine').notNull(), givenOn: text('given_on').notNull(), note: text('note'), ...timestamps
})

export const growthMeasurements = sqliteTable('growth_measurements', {
  id: id(), childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  heightCm: integer('height_cm'), weightKg: integer('weight_kg'), measuredOn: text('measured_on').notNull(), ...timestamps
})
