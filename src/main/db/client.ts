import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { mkdirSync } from 'fs'
import * as schema from './schema'

let _sqlite: Database.Database | null = null
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDbPath(): string {
  try {
    return join(app.getPath('userData'), 'data', 'rawdati.db')
  } catch {
    return join(process.cwd(), 'data', 'rawdati.db')
  }
}

export function getSqlite(): Database.Database {
  if (_sqlite) return _sqlite
  const dbPath = getDbPath()
  try { mkdirSync(join(dbPath, '..'), { recursive: true }) } catch {}
  _sqlite = new Database(dbPath)
  _sqlite.pragma('journal_mode = WAL')
  _sqlite.pragma('foreign_keys = ON')
  _sqlite.pragma('synchronous = NORMAL')
  _sqlite.pragma('busy_timeout = 5000')
  return _sqlite
}

export function getDb() {
  if (_db) return _db
  _db = drizzle(getSqlite(), { schema })
  return _db
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get: (_t, p) => (getDb() as any)[p]
})
export type DB = ReturnType<typeof getDb>
