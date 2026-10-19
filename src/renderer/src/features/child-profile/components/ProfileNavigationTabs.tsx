import React from 'react'

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
  attendanceRate?: number | null
  unpaidInvoicesCount?: number
  documentsCount?: number
}

export function ProfileNavigationTabs({
  activeTab,
  onTabChange,
  attendanceRate,
  unpaidInvoicesCount = 0,
  documentsCount = 3
}: ProfileNavigationTabsProps) {
  const tabs = [
    {
      id: 'overview' as ProfileTabId,
      label: 'نظرة عامة',
      icon: 'visibility',
      badge: null
    },
    {
      id: 'guardians' as ProfileTabId,
      label: 'بيانات الأولياء والمخوّلين',
      icon: 'family_restroom',
      badge: null
    },
    {
      id: 'attendance' as ProfileTabId,
      label: 'سجل الحضور والغياب',
      icon: 'how_to_reg',
      badge:
        attendanceRate !== null && attendanceRate !== undefined ? (
          <span className="font-caption text-caption px-1.5 py-0.5 rounded font-mono font-bold bg-surface-container-highest">
            {attendanceRate}%
          </span>
        ) : null
    },
    {
      id: 'growth' as ProfileTabId,
      label: 'التقارير اليومية والنمو',
      icon: 'assignment',
      badge: null
    },
    {
      id: 'finance' as ProfileTabId,
      label: 'الملف المالي والفواتير',
      icon: 'account_balance_wallet',
      badge:
        unpaidInvoicesCount > 0 ? (
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" title="توجد مستحقات معلقة" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="الحساب مسوى" />
        )
    },
    {
      id: 'documents' as ProfileTabId,
      label: 'المستندات والملفات الورقية',
      icon: 'folder_open',
      badge: (
        <span className="font-mono text-caption px-1.5 py-0.5 rounded bg-surface-container-highest font-bold">
          {documentsCount}
        </span>
      )
    },
    {
      id: 'audit' as ProfileTabId,
      label: 'سجل التغييرات والتدقيق',
      icon: 'history',
      badge: null
    }
  ]

  return (
    <nav
      aria-label="أقسام ملف الطفل"
      className="flex items-center gap-1.5 overflow-x-auto bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/30 shadow-xs scrollbar-none select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            id={`profile-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={`px-4 py-2.5 rounded-xl font-label-md text-sm whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-primary text-on-primary font-bold shadow-xs scale-[1.02]'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${isActive ? 'text-on-primary' : 'text-primary'}`}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge}
          </button>
        )
      })}
    </nav>
  )
}
