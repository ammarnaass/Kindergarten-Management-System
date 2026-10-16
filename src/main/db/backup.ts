import { app } from 'electron'
import { join, basename } from 'path'
import { mkdirSync, copyFileSync, readdirSync, statSync, rmSync, existsSync } from 'fs'
import { getDbPath, getSqlite } from './client'
import { BACKUP_KEEP_COUNT } from '@shared/constants'

export function backupDir(): string {
  const dir = join(app.getPath('userData'), 'backups')
  mkdirSync(dir, { recursive: true })
  return dir
}

export function createBackup(destDir?: string): string {
  const dir = destDir ?? backupDir()
  mkdirSync(dir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const file = join(dir, `rawdati-${ts}.db`)
  const sqlite = getSqlite()
  // نسخة متسقة: VACUUM INTO ينشئ لقطة سليمة أثناء التشغيل (يدعم WAL)
  try {
    sqlite.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`)
  } catch {
    copyFileSync(getDbPath(), file)
  }
  pruneBackups(dir)
  return file
}

export function createPreMigrationBackup(): string {
  return createBackup(backupDir())
}

export function listBackups(): { path: string; size: number; mtime: number }[] {
  const dir = backupDir()
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.db'))
      .map((f) => { const p = join(dir, f); const s = statSync(p); return { path: p, size: s.size, mtime: s.mtimeMs } })
      .sort((a, b) => b.mtime - a.mtime)
  } catch { return [] }
}

function pruneBackups(dir: string) {
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith('.db'))
      .map((f) => join(dir, f))
      .map((p) => ({ p, m: statSync(p).mtimeMs }))
      .sort((a, b) => b.m - a.m)
    for (const f of files.slice(BACKUP_KEEP_COUNT)) rmSync(f.p, { force: true })
  } catch {}
}

export function backupFileName(p: string) { return basename(p) }
