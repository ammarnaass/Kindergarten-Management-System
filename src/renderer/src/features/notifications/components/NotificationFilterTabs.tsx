import type { NotificationCategory, NotificationFilterStats } from '../types'

interface NotificationFilterTabsProps {
  currentFilter: NotificationCategory
  onSelectFilter: (filter: NotificationCategory) => void
  stats: NotificationFilterStats
}

export function NotificationFilterTabs({
  currentFilter,
  onSelectFilter,
  stats
}: NotificationFilterTabsProps) {
  const tabs: { id: NotificationCategory; label: string; count: number; badgeColor?: string }[] = [
    { id: 'all', label: 'الكل', count: stats.all },
    {
      id: 'critical',
      label: 'حرجة',
      count: stats.critical,
      badgeColor: 'bg-error text-on-error'
    },
    { id: 'health', label: 'صحة', count: stats.health },
    { id: 'gate', label: 'بوابة', count: stats.gate },
    { id: 'finance', label: 'مالية', count: stats.finance },
    { id: 'system', label: 'نظام', count: stats.system },
    { id: 'events', label: 'مناسبات', count: stats.events }
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-space-md border-b border-outline-variant/30 scrollbar-none select-none bg-surface-container-low/40">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectFilter(tab.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-label-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
              isActive
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-on-primary/20 text-on-primary'
                    : tab.badgeColor || 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
