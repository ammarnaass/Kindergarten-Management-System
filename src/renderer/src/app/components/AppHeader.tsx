import { useNavigate } from 'react-router-dom'
import { AppLogo } from './AppLogo'
import { useTheme } from '@/app/providers/ThemeProvider'
import type { SidebarMode } from './AppSidebar'

interface AppHeaderProps {
  onOpenSearch: () => void
  onOpenQuickPayment?: () => void
  onOpenNewChild?: () => void
  onOpenNotifications?: () => void
  onToggleSidebar?: () => void
  sidebarMode?: SidebarMode
  unreadNotificationsCount?: number
  hasCriticalAlerts?: boolean
  currentUser?: { username: string; role: string } | null
}

export function AppHeader({
  onOpenSearch,
  onOpenQuickPayment,
  onOpenNewChild,
  onOpenNotifications,
  onToggleSidebar,
  sidebarMode = 'expanded',
  unreadNotificationsCount = 0,
  hasCriticalAlerts = false,
  currentUser = { username: 'مدير النظام', role: 'الإدارة' }
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="fixed top-[38px] right-0 left-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 flex items-center justify-between px-3 sm:px-space-md lg:px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none border-b border-outline-variant/20">
      <div className="flex items-center gap-2 sm:gap-space-md min-w-0">
        {/* Sidebar Toggle Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title={sidebarMode === 'expanded' ? 'تصغير القائمة إلى شريط سريع' : 'فتح وتوسيع القائمة الجانبية'}
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all active:scale-95 border border-outline-variant/30 shadow-2xs shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">
              {sidebarMode === 'expanded' ? 'menu_open' : 'menu'}
            </span>
          </button>
        )}

        {/* Brand Logo & Name */}
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center cursor-pointer group shrink-0"
        >
          <AppLogo size="sm" className="hidden sm:flex" />
          <AppLogo size="xs" iconOnly className="sm:hidden" />
        </div>

        {/* Quick Search Bar (Ctrl+K) */}
        <div
          onClick={onOpenSearch}
          className="relative hidden md:flex items-center w-44 lg:w-64 xl:w-80 cursor-pointer"
        >
          <span className="material-symbols-outlined absolute right-3 text-outline pointer-events-none text-lg">
            search
          </span>
          <input
            className="w-full h-9 pr-9 pl-12 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer hover:bg-surface-container transition-colors"
            placeholder="بحث فوري عن طفل أو فاتورة..."
            readOnly
            type="text"
          />
          <kbd className="absolute left-2 px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-[11px] font-semibold shadow-xs">
            Ctrl+K
          </kbd>
        </div>

        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          title="بحث فوري (Ctrl+K)"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
        {/* Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-space-xs">
          <button
            onClick={() => (onOpenQuickPayment ? onOpenQuickPayment() : navigate('/finance'))}
            className="flex items-center gap-1.5 px-2.5 sm:px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all shadow-xs"
            type="button"
            title="تسجيل دفعة مالية"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span className="hidden sm:inline">تسجيل دفعة</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-1.5 px-2.5 sm:px-space-md py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors"
            type="button"
            title="تسجيل حضور اليوم"
          >
            <span className="material-symbols-outlined text-base">checklist</span>
            <span className="hidden lg:inline">حضور اليوم</span>
          </button>

          <button
            onClick={() => (onOpenNewChild ? onOpenNewChild() : navigate('/children'))}
            className="flex items-center gap-1.5 px-2.5 sm:px-space-md py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors"
            type="button"
            title="تسجيل طفل جديد"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span className="hidden xl:inline">طفل جديد</span>
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant/50 hidden sm:block" />

        {/* Utilities & User Status */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="قفل الشاشة وتبديل المستخدم (Ctrl+L)"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">lock</span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="التنبيهات المحلية (Ctrl+J)"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {hasCriticalAlerts ? 'notification_important' : 'notifications'}
            </span>
            {unreadNotificationsCount > 0 ? (
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white leading-none shadow-xs ${
                  hasCriticalAlerts ? 'bg-error animate-pulse' : 'bg-primary'
                }`}
              >
                {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
              </span>
            ) : null}
          </button>

          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all active:scale-90"
            title={isDark ? 'التبديل إلى النمط النهاري المشرق (Ctrl+Shift+D)' : 'التبديل إلى النمط الليلي المظلم (Ctrl+Shift+D)'}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pr-1">
            <div className="text-left">
              <div className="font-label-md text-label-md font-semibold text-on-surface">
                {currentUser?.username || 'أ. نادية المنصوري'}
              </div>
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-caption text-caption text-on-surface-variant">متصل محلياً</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold text-caption ring-1 ring-outline-variant">
              ن
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
