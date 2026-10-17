import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationFilterTabs } from './components/NotificationFilterTabs'
import { NotificationCard } from './components/NotificationCard'
import type { useNotifications } from './hooks/useNotifications'

interface NotificationsDrawerProps {
  open: boolean
  onClose: () => void
  notificationsHook: ReturnType<typeof useNotifications>
}

export function NotificationsDrawer({
  open,
  onClose,
  notificationsHook
}: NotificationsDrawerProps) {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    criticalCount,
    filter,
    setFilter,
    stats,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    refresh,
    loading
  } = notificationsHook

  // إغلاق المودال عند الضغط على زر Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleActionNavigation = (route: string) => {
    onClose()
    navigate(route)
  }

  return (
    <>
      {/* 1. Backdrop Scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-scrim/40 backdrop-blur-xs transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* 2. Left-Side Slide-Over Modal Drawer */}
      <aside
        aria-label="مركز التنبيهات والإشعارات"
        className={`fixed top-0 bottom-0 left-0 z-50 w-full sm:w-[420px] max-w-[90vw] bg-surface-container-lowest border-r border-outline-variant/30 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out select-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-space-md py-3.5 border-b border-outline-variant/30 bg-surface-container-lowest">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                criticalCount > 0
                  ? 'bg-error-container text-on-error-container animate-pulse'
                  : 'bg-primary-container text-on-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {criticalCount > 0 ? 'notification_important' : 'notifications'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  مركز التنبيهات
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-error text-on-error">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="font-caption text-caption text-on-surface-variant">
                متابعة فورية ومباشرة لحالات الروضة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={refresh}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              title="تحديث التنبيهات الآن"
              type="button"
            >
              <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              title="إغلاق (Esc)"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Quick Bulk Action Bar */}
        <div className="flex items-center justify-between px-space-md py-1.5 bg-surface-container-low/60 text-xs border-b border-outline-variant/20">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1 font-semibold text-primary hover:text-primary/80 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-sm leading-none">done_all</span>
            <span>تحديد الكل كمقروء</span>
          </button>

          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1 font-semibold text-on-surface-variant hover:text-error disabled:opacity-40 disabled:pointer-events-none transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-sm leading-none">delete_sweep</span>
            <span>مسح الكل</span>
          </button>
        </div>

        {/* Filter Tabs Strip */}
        <NotificationFilterTabs
          currentFilter={filter}
          onSelectFilter={setFilter}
          stats={stats}
        />

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto p-space-md space-y-space-sm overscroll-contain">
          {notifications.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-3 text-outline">
                <span className="material-symbols-outlined text-3xl">done_all</span>
              </div>
              <h4 className="font-title-sm text-title-sm font-bold text-on-surface mb-1">
                لا توجد تنبيهات في هذا القسم
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[260px]">
                كافة سجلات الأطفال والعيادة والمالية والبوابة تعمل بانتظام دون معلقات.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onAction={handleActionNavigation}
                onMarkAsRead={markAsRead}
                onDismiss={dismissNotification}
              />
            ))
          )}
        </div>

        {/* Persistent Bottom Status Footer */}
        <div className="px-space-md py-2.5 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">تنبيهات فورية محلية (SQLite)</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px]">
            Ctrl+J / Esc
          </kbd>
        </div>
      </aside>
    </>
  )
}
