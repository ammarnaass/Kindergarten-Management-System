import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'

export const staff = sqliteTable('staff', {
  id: id(), firstName: text('first_name').notNull(), lastName: text('last_name').notNull(),
  role: text('role').notNull(), phone: text('phone'), email: text('email'),
  salaryCents: integer('salary_cents').notNull().default(0),
  hiredAt: text('hired_at'), isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true), ...timestamps
})

export const leaves = sqliteTable('leaves', {
  id: id(), staffId: text('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  fromDate: text('from_date').notNull(), toDate: text('to_date').notNull(),
  reason: text('reason'), status: text('status').notNull().default('pending'), ...timestamps
}, (t) => ({
  leaves_staff_idx: index('leaves_staff_idx').on(t.staffId)
})
)

export const payrollEntries = sqliteTable('payroll_entries', {
  id: id(), staffId: text('staff_id').notNull().references(() => staff.id),
  period: text('period').notNull(), grossCents: integer('gross_cents').notNull(),
  deductionsCents: integer('deductions_cents').notNull().default(0),
  netCents: integer('net_cents').notNull(), paidAt: text('paid_at'), ...timestamps
})
