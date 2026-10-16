import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'
import { children } from './children'
import { users } from './system'

export const attendance = sqliteTable('attendance', {
  id: id(),
  childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  status: text('status', { enum: ['present', 'absent', 'late', 'excused'] }).notNull(),
  checkInAt: integer('check_in_at', { mode: 'timestamp' }),
  checkOutAt: integer('check_out_at', { mode: 'timestamp' }),
  pickedUpBy: text('picked_up_by'),
  recordedBy: text('recorded_by').references(() => users.id),
  note: text('note'),
  ...timestamps
}, (t) => ({
  attendance_child_date_uq: uniqueIndex('attendance_child_date_uq').on(t.childId, t.date),
  attendance_date_idx: index('attendance_date_idx').on(t.date)
})
)

export const staffAttendance = sqliteTable('staff_attendance', {
  id: id(),
  staffId: text('staff_id').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(),
  note: text('note'),
  ...timestamps
}, (t) => ({
  staff_attendance_date_idx: index('staff_attendance_date_idx').on(t.date)
})
)
