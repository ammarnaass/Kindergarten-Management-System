import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { TitleBar } from './components/TitleBar'
import { AppHeader } from './components/AppHeader'
import { AppSidebar } from './components/AppSidebar'
import { AppFooter } from './components/AppFooter'
import { CommandPalette } from './components/CommandPalette'
import { NewChildModal } from './components/NewChildModal'
import { NotificationsDrawer, useNotifications } from '@/features/notifications'
import { ipc } from '@/lib/ipc'
import { useTheme } from './providers/ThemeProvider'

export function Layout() {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const notificationsHook = useNotifications()
  const [searchOpen, setSearchOpen] = useState(false)
  const [newChildOpen, setNewChildOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [backupInfo, setBackupInfo] = useState<{ ok: boolean; text: string }>({
    ok: true,
    text: 'اليوم 14:30 (24.3 MB)',
  })
  const [user, setUser] = useState<{ username: string; role: string } | null>({
    username: 'أ. نادية المنصوري',
    role: 'مديرة الروضة',
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const diag = await ipc<any>('app:diagnostics')
        if (diag) {
          setBackupInfo({
            ok: true,
            text: `اليوم (${diag.backups ?? 0} نسخ محفوظة)`,
          })
        }
      } catch {}
      try {
        const me = await ipc<any>('auth:me')
        if (me) setUser({ username: me.username, role: me.role })
      } catch {}
    }
    fetchStatus()
  }, [])

  // Desktop Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        toggleTheme()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setNotificationsOpen((prev) => !prev)
      } else if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setNotificationsOpen((prev) => !prev)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setNewChildOpen(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        navigate('/finance')
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        navigate('/attendance')
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        window.print()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        navigate('/login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, toggleTheme])

  return (
    <div dir="rtl" className="min-h-screen w-screen bg-surface font-body-md text-on-surface antialiased select-none overflow-x-hidden">
      {/* 1. Desktop Window Chrome */}
      <TitleBar />

      {/* 2. Top Header Navigation */}
      <AppHeader
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNewChild={() => setNewChildOpen(true)}
        onOpenQuickPayment={() => navigate('/finance')}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadNotificationsCount={notificationsHook.unreadCount}
        hasCriticalAlerts={notificationsHook.criticalCount > 0}
        currentUser={user}
      />

      {/* 3. Right Collapsible Navigation Sidebar */}
      <AppSidebar />

      {/* 4. Main Scrollable Workspace Canvas */}
      <div className="pr-64 pt-[102px] pb-[32px] min-h-screen">
        <main className="w-full min-h-[calc(100vh-134px)] px-space-lg py-space-md bg-surface">
          <Outlet context={{ user }} />
        </main>
      </div>

      {/* 5. Persistent Offline Bottom Status Footer */}
      <AppFooter
        backupText={backupInfo.text}
        backupOk={backupInfo.ok}
        onQuickBackup={async () => {
          try {
            await ipc('backup:create')
            setBackupInfo({ ok: true, text: 'تم النسخ الآن بنجاح' })
          } catch {}
        }}
      />

      {/* 6. Global Command Palette Modal (Ctrl+K) */}
      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenNewChild={() => setNewChildOpen(true)}
        onOpenQuickPayment={() => navigate('/finance')}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* 7. New Child Modal (Ctrl+N) */}
      <NewChildModal
        open={newChildOpen}
        onClose={() => setNewChildOpen(false)}
      />

      {/* 8. Left-Side Slide-Over Notifications Drawer (Ctrl+J) */}
      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notificationsHook={notificationsHook}
      />
    </div>
  )
}
