import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './_shared'
import { children } from './children'

export const dailyReports = sqliteTable('daily_reports', {
  id: id(), childId: text('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), summary: text('summary'), mood: text('mood'), ...timestamps
}, (t) => ({
  daily_child_date_idx: index('daily_child_date_idx').on(t.childId, t.date)
})
)

export const dailyReportItems = sqliteTable('daily_report_items', {
  id: id(), reportId: text('report_id').notNull().references(() => dailyReports.id, { onDelete: 'cascade' }),
  category: text('category').notNull(), value: text('value'), note: text('note')
})

export const media = sqliteTable('media', {
  id: id(), ownerType: text('owner_type').notNull(), ownerId: text('owner_id').notNull(),
  filePath: text('file_path').notNull(), mime: text('mime'), ...timestamps
})

export const announcements = sqliteTable('announcements', {
  id: id(), title: text('title').notNull(), body: text('body').notNull(),
  publishedAt: text('published_at'), ...timestamps
})

export const messageTemplates = sqliteTable('message_templates', {
  id: id(), name: text('name').notNull().unique(), body: text('body').notNull(), ...timestamps
})

export const eventCalendar = sqliteTable('event_calendar', {
  id: id(), title: text('title').notNull(), startsOn: text('starts_on').notNull(),
  endsOn: text('ends_on'), description: text('description'), ...timestamps
})
