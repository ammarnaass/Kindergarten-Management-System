import { app, BrowserWindow, shell, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import log from './infra/logger'
import { runMigrations } from './db/migrate'
import { ensureSeed } from './security/seed'
import { registerHandlers } from './ipc/handlers'
import { createBackup } from './db/backup'

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 800, show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })
  win.on('ready-to-show', () => win?.show())
  win.webContents.setWindowOpenHandler((details) => { shell.openExternal(details.url); return { action: 'deny' } })
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://') && !url.startsWith('http://localhost')) e.preventDefault()
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  else win.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.rawdati.app')
  optimizer.watchWindowShortcuts(win!)
  try {
    runMigrations()
    ensureSeed()
  } catch (e) {
    log.error('migration failed', e)
    dialog.showErrorBox('خطأ في قاعدة البيانات', 'فشل تحديث قاعدة البيانات. تم الاحتفاظ بنسخة احتياطية.')
    app.quit()
    return
  }
  registerHandlers()
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('before-quit', () => { try { createBackup() } catch (e) { log.warn('auto backup failed', e) } })
