import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'
import { children } from './children'
import { users } from './system'

export const feeTypes = sqliteTable('fee_types', {
  id: id(), name: text('name').notNull(), amountCents: integer('amount_cents').notNull().default(0),
  frequency: text('frequency').notNull().default('monthly'), isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true), ...timestamps
})

export const feePlans = sqliteTable('fee_plans', {
  id: id(), name: text('name').notNull(), totalCents: integer('total_cents').notNull(),
  description: text('description'), isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true), ...timestamps
})

export const invoices = sqliteTable('invoices', {
  id: id(),
  number: text('number').notNull().unique(),
  childId: text('child_id').notNull().references(() => children.id),
  period: text('period'),
  totalCents: integer('total_cents').notNull(),
  discountCents: integer('discount_cents').notNull().default(0),
  dueDate: text('due_date').notNull(),
  status: text('status', { enum: ['draft', 'issued', 'partial', 'paid', 'void'] }).notNull().default('draft'),
  ...timestamps
}, (t) => ({
  invoices_child_idx: index('invoices_child_idx').on(t.childId),
  invoices_status_due_idx: index('invoices_status_due_idx').on(t.status, t.dueDate)
})
)

export const invoiceItems = sqliteTable('invoice_items', {
  id: id(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  feeTypeId: text('fee_type_id').references(() => feeTypes.id, { onDelete: 'set null' }),
  label: text('label').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitCents: integer('unit_cents').notNull(),
  ...timestamps
}, (t) => ({
  invoice_items_invoice_idx: index('invoice_items_invoice_idx').on(t.invoiceId)
})
)

export const payments = sqliteTable('payments', {
  id: id(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id, { onDelete: 'restrict' }),
  amountCents: integer('amount_cents').notNull(),
  method: text('method', { enum: ['cash', 'transfer', 'card', 'cheque'] }).notNull(),
  paidAt: integer('paid_at', { mode: 'timestamp' }).notNull(),
  receiptNumber: text('receipt_number').notNull().unique(),
  recordedBy: text('recorded_by').references(() => users.id),
  ...timestamps
}, (t) => ({
  payments_invoice_idx: index('payments_invoice_idx').on(t.invoiceId)
})
)

export const expenseCategories = sqliteTable('expense_categories', {
  id: id(), name: text('name').notNull().unique(), ...timestamps
})

export const expenses = sqliteTable('expenses', {
  id: id(), categoryId: text('category_id').references(() => expenseCategories.id, { onDelete: 'set null' }),
  amountCents: integer('amount_cents').notNull(), description: text('description'),
  spentOn: text('spent_on').notNull(), recordedBy: text('recorded_by').references(() => users.id), ...timestamps
})
