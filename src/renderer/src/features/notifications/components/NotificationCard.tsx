import type { AppNotification } from '../types'

interface NotificationCardProps {
  notification: AppNotification
  onAction?: (route: string) => void
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'الآن'
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  return 'اليوم'
}

export function NotificationCard({
  notification,
  onAction,
  onMarkAsRead,
  onDismiss
}: NotificationCardProps) {
  const { id, title, message, category, severity, timestamp, read, actionRoute, actionLabel } =
    notification

  const getCategoryTheme = () => {
    switch (category) {
      case 'health':
        return {
          icon: 'medical_services',
          label: 'صحة وعيادة',
          badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40'
        }
      case 'gate':
        return {
          icon: 'sensor_door',
          label: 'بوابة وأمن',
          badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/40'
        }
      case 'finance':
        return {
          icon: 'receipt_long',
          label: 'مالية ورسوم',
          badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40'
        }
      case 'events':
        return {
          icon: 'cake',
          label: 'مناسبات',
          badgeClass: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200/50 dark:border-pink-800/40'
        }
      case 'system':
      default:
        return {
          icon: 'security',
          label: 'نظام وأمان',
          badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/40'
        }
    }
  }

  const getSeverityStyles = () => {
    switch (severity) {
      case 'critical':
        return {
          containerClass:
            'bg-error-container/20 border-error/40 hover:border-error/70 dark:bg-error-container/10',
          iconColor: 'text-error',
          pulse: true
        }
      case 'warning':
        return {
          containerClass:
            'bg-amber-50/50 border-amber-300/50 hover:border-amber-400 dark:bg-amber-950/15 dark:border-amber-800/50',
          iconColor: 'text-amber-600 dark:text-amber-400',
          pulse: false
        }
      case 'success':
        return {
          containerClass:
            'bg-emerald-50/40 border-emerald-300/40 hover:border-emerald-400 dark:bg-emerald-950/15 dark:border-emerald-800/50',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          pulse: false
        }
      case 'info':
      default:
        return {
          containerClass:
            'bg-surface-container-low/60 border-outline-variant/40 hover:border-outline-variant/80 dark:bg-surface-container-low/40',
          iconColor: 'text-primary',
          pulse: false
        }
    }
  }

  const categoryMeta = getCategoryTheme()
  const severityMeta = getSeverityStyles()

  return (
    <div
      onClick={() => {
        if (!read) onMarkAsRead(id)
      }}
      className={`group relative rounded-xl p-space-md border transition-all duration-200 select-none shadow-2xs hover:shadow-xs ${
        severityMeta.containerClass
      } ${read ? 'opacity-75 hover:opacity-100' : 'opacity-100'}`}
    >
      {/* Unread Indicator Bar */}
      {!read && (
        <span className="absolute top-3 left-3 flex h-2 w-2">
          {severityMeta.pulse && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
      )}

      {/* Dismiss Button (Visible on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDismiss(id)
        }}
        className="absolute top-2.5 left-2.5 p-1 rounded-md text-on-surface-variant/40 hover:text-error hover:bg-error-container/30 opacity-0 group-hover:opacity-100 transition-opacity"
        title="تجاهل التنبيه"
        type="button"
      >
        <span className="material-symbols-outlined text-sm leading-none">close</span>
      </button>

      {/* Header: Category Badge & Time */}
      <div className="flex items-center justify-between gap-2 mb-1.5 pl-6">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${categoryMeta.badgeClass}`}
          >
            <span className="material-symbols-outlined text-xs leading-none">
              {categoryMeta.icon}
            </span>
            <span>{categoryMeta.label}</span>
          </span>
          {severity === 'critical' && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-error text-on-error">
              عاجل
            </span>
          )}
        </div>
        <span className="font-caption text-caption text-on-surface-variant font-mono">
          {formatRelativeTime(timestamp)}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-label-lg text-label-lg font-bold text-on-surface leading-snug mb-1">
        {title}
      </h4>

      {/* Message Body */}
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
        {message}
      </p>

      {/* Quick Action Button */}
      {actionRoute && (
        <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-caption text-caption text-on-surface-variant/80">
            إجراء فوري مطلوب
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(id)
              if (onAction) onAction(actionRoute)
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-label-sm font-semibold transition-colors shadow-2xs group-hover:bg-primary group-hover:text-on-primary"
            type="button"
          >
            <span>{actionLabel || 'عرض التفاصيل'}</span>
            <span className="material-symbols-outlined text-sm leading-none">arrow_back</span>
          </button>
        </div>
      )}
    </div>
  )
}
