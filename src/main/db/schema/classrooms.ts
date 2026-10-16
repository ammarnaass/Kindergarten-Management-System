import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'

export const schoolYears = sqliteTable('school_years', {
  id: id(),
  name: text('name').notNull().unique(),
  startsOn: text('starts_on').notNull(),
  endsOn: text('ends_on').notNull(),
  isCurrent: integer('is_current', { mode: 'boolean' }).notNull().default(false),
  ...timestamps
})

export const classrooms = sqliteTable('classrooms', {
  id: id(),
  name: text('name').notNull(),
  schoolYearId: text('school_year_id').references(() => schoolYears.id, { onDelete: 'set null' }),
  capacity: integer('capacity').notNull().default(20),
  room: text('room'),
  ...timestamps
}, (t) => ({
  classrooms_year_idx: index('classrooms_year_idx').on(t.schoolYearId)
})
)

export const classroomStaff = sqliteTable('classroom_staff', {
  classroomId: text('classroom_id').notNull().references(() => classrooms.id, { onDelete: 'cascade' }),
  staffId: text('staff_id').notNull(),
  role: text('role').notNull().default('teacher')
})

export const childClassroomHistory = sqliteTable('child_classroom_history', {
  id: id(),
  childId: text('child_id').notNull(),
  classroomId: text('classroom_id').notNull(),
  movedAt: text('moved_at').notNull(),
  note: text('note'),
  ...timestamps
})
