import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { app } from 'electron'
import { join } from 'path'
import { getDb } from './client'
import { createPreMigrationBackup } from './backup'
import log from '../infra/logger'

export function runMigrations() {
  const migrationsFolder = app.isPackaged
    ? join(process.resourcesPath, 'drizzle')
    : join(app.getAppPath(), 'drizzle')
  try {
    createPreMigrationBackup()
  } catch (e) {
    log.warn('pre-migration backup failed', e)
  }
  migrate(getDb() as any, { migrationsFolder })
  log.info('migrations applied from ' + migrationsFolder)
}
