import { getDb, getSqlite } from '../db/client'
import { settings } from '../db/schema'
import { eq } from 'drizzle-orm'

export const settingsRepo = {
  get(key: string): string | null {
    const db = getDb() as any
    const row = db.select().from(settings).where(eq(settings.key, key)).get()
    return row?.value ?? null
  },

  getAll(): Record<string, string> {
    const db = getDb() as any
    const rows = db.select().from(settings).all()
    const result: Record<string, string> = {}
    for (const r of rows) {
      result[r.key] = r.value
    }
    return result
  },

  set(key: string, value: string): void {
    const db = getDb() as any
    db.insert(settings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() }
      })
      .run()
  },

  setMany(entries: Record<string, string>): void {
    const db = getDb() as any
    db.transaction((tx: any) => {
      for (const [key, value] of Object.entries(entries)) {
        tx.insert(settings)
          .values({ key, value, updatedAt: new Date() })
          .onConflictDoUpdate({
            target: settings.key,
            set: { value, updatedAt: new Date() }
          })
          .run()
      }
    })
  },

  vacuum(): { initialSize: number; currentSize: number; freedBytes: number } {
    const sqlite = getSqlite()
    const getSize = () => {
      try {
        const row = sqlite
          .prepare('select page_count * page_size as s from pragma_page_count, pragma_page_size')
          .get() as any
        return row?.s ?? 0
      } catch {
        return 0
      }
    }
    const initialSize = getSize()
    sqlite.exec('VACUUM')
    sqlite.exec('PRAGMA optimize')
    const currentSize = getSize()
    const freedBytes = Math.max(0, initialSize - currentSize)
    return { initialSize, currentSize, freedBytes }
  }
}
