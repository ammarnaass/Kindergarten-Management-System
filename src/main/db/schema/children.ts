import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { id, timestamps } from './_shared'
import { classrooms } from './classrooms'

export const guardians = sqliteTable('guardians', {
  id: id(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  nationalId: text('national_id'),
  ...timestamps
})

export const children = sqliteTable('children', {
  id: id(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  birthDate: text('birth_date').notNull(),
  gender: text('gender', { enum: ['male', 'female'] }).notNull(),
  photoPath: text('photo_path'),
  classroomId: text('classroom_id').references(() => classrooms.id, { onDelete: 'set null' }),
  status: text('status', { enum: ['active', 'waitlist', 'graduated', 'withdrawn'] }).notNull().default('active'),
  enrolledAt: text('enrolled_at'),
  allergies: text('allergies'),
  medicalNotes: text('medical_notes'),
  ...timestamps
}, (t) => ({
  children_classroom_idx: index('children_classroom_idx').on(t.classroomId),
  children_status_idx: index('children_status_idx').on(t.status),
  children_name_idx: index('children_name_idx').on(t.lastName, t.firstName)
})
)

export const childGuardians = sqliteTable('child_guardians', {
  childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  guardianId: text('guardian_id').notNull().references(() => guardians.id, { onDelete: 'cascade' }),
  relation: text('relation').notNull(),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  canPickup: integer('can_pickup', { mode: 'boolean' }).notNull().default(true)
}, (t) => ({
  pk: primaryKey({ columns: [t.childId, t.guardianId] })
})
)

export const authorizedPickups = sqliteTable('authorized_pickups', {
  id: id(),
  childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  nationalId: text('national_id'),
  note: text('note'),
  ...timestamps
})

export const documents = sqliteTable('documents', {
  id: id(),
  childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  filePath: text('file_path').notNull(),
  note: text('note'),
  ...timestamps
})

export const childrenRelations = relations(children, ({ one, many }) => ({
  classroom: one(classrooms, { fields: [children.classroomId], references: [classrooms.id] }),
  guardians: many(childGuardians)
}))
