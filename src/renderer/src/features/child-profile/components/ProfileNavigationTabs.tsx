export type ProfileTabId =
  | 'overview'
  | 'guardians'
  | 'attendance'
  | 'growth'
  | 'finance'
  | 'documents'
  | 'audit'

interface ProfileNavigationTabsProps {
  activeTab: ProfileTabId
  onTabChange: (tab: ProfileTabId) => void
}

export function ProfileNavigationTabs({ activeTab, onTabChange }: ProfileNavigationTabsProps) {
  const tabs = [
    { id: 'overview' as ProfileTabId, label: 'نظرة عامة', icon: 'visibility' },
    {
      id: 'guardians' as ProfileTabId,
      label: 'بيانات الأولياء والمخوّلين',
      icon: 'family_restroom',
      badge: <span className="w-2 h-2 rounded-full bg-secondary" />
    },
    {
      id: 'attendance' as ProfileTabId,
      label: 'سجل الحضور والغياب',
      icon: 'how_to_reg',
      badge: <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container-highest">96%</span>
    },
    { id: 'growth' as ProfileTabId, label: 'التقارير اليومية والنمو', icon: 'assignment' },
    {
      id: 'finance' as ProfileTabId,
      label: 'الملف المالي والفواتير',
      icon: 'account_balance_wallet',
      badge: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    },
    {
      id: 'documents' as ProfileTabId,
      label: 'المستندات الورقية الممسوحة (3)',
      icon: 'folder_open'
    },
    {
      id: 'audit' as ProfileTabId,
      label: 'سجل التغييرات والتدقيق',
      icon: 'history',
      badge: <span className="font-mono text-caption text-on-surface-variant">Audit</span>
    }
  ]

  return (
    <nav
      aria-label="أقسام ملف الطفل"
      className="flex items-center gap-1 overflow-x-auto bg-surface-container-lowest p-1.5 rounded-xl shadow-xs scrollbar-none select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              isActive
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge}
          </button>
        )
      })}
    </nav>
  )
}
