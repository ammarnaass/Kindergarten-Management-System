import React from 'react'
import type { HealthTab } from '../types'

interface HealthNavigationTabsProps {
  activeTab: HealthTab
  onSelectTab: (tab: HealthTab) => void
  search: string
  onSearchChange: (val: string) => void
}

export const HealthNavigationTabs: React.FC<HealthNavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  search,
  onSearchChange
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/60">
      <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
        {(
          [
            { id: 'visits', label: 'مراجعات العيادة', icon: 'medical_services' },
            { id: 'allergies', label: 'الحالات الحرجة والحساسية', icon: 'warning' },
            { id: 'medications', label: 'سجل إعطاء الأدوية', icon: 'medication' },
            { id: 'incidents', label: 'سجل الحوادث والإصابات', icon: 'emergency' }
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="relative w-64">
        <span className="material-symbols-outlined absolute right-2.5 top-2 text-base text-outline">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث في السجلات..."
          className="w-full h-9 pr-8 pl-3 rounded-xl bg-surface-container border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}
