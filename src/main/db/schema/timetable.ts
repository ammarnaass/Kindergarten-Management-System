import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'
import { classrooms } from './classrooms'

export const timetablePeriods = sqliteTable(
  'timetable_periods',
  {
    id: id(),
    classroomId: text('classroom_id').references(() => classrooms.id, { onDelete: 'cascade' }),
    periodNumber: integer('period_number').notNull(),
    title: text('title').notNull(),
    category: text('category').notNull().default('circle'),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    color: text('color').notNull().default('#0284c7'),
    icon: text('icon').notNull().default('schedule'),
    supervisorStaffId: text('supervisor_staff_id'),
    supervisorStaffName: text('supervisor_staff_name'),
    notes: text('notes'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    ...timestamps
  },
  (t) => ({
    timetable_classroom_idx: index('timetable_classroom_idx').on(t.classroomId),
    timetable_period_num_idx: index('timetable_period_num_idx').on(t.periodNumber)
  })
)

export const staffDuties = sqliteTable(
  'staff_duties',
  {
    id: id(),
    staffId: text('staff_id').notNull(),
    staffName: text('staff_name'),
    dutyLocation: text('duty_location').notNull(),
    dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 4 = Thursday
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    notes: text('notes'),
    ...timestamps
  },
  (t) => ({
    staff_duty_day_idx: index('staff_duty_day_idx').on(t.dayOfWeek)
  })
)
