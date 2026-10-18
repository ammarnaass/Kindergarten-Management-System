import { SettingsTab } from '../types'

interface TabItem {
  id: SettingsTab
  label: string
  icon: string
  badgeDot?: boolean
}

const TABS: TabItem[] = [
  { id: 'branch', label: 'بيانات الروضة والفرع', icon: 'apartment' },
  { id: 'users', label: 'إدارة الحسابات والمستخدمين', icon: 'manage_accounts', badgeDot: true },
  { id: 'printers', label: 'الأجهزة والطابعات (Hardware)', icon: 'print', badgeDot: true },
  { id: 'scanner', label: 'قارئات الباركود والبطاقات', icon: 'qr_code_scanner' },
  { id: 'backup', label: 'قاعدة البيانات والأرشفة', icon: 'dns' },
  { id: 'appearance', label: 'المظهر والسنة الدراسية', icon: 'palette' }
]

interface SettingsNavigationTabsProps {
  activeTab: SettingsTab
  onSelectTab: (tab: SettingsTab) => void
}

export function SettingsNavigationTabs({
  activeTab,
  onSelectTab
}: SettingsNavigationTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-space-lg border-b border-surface-variant no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badgeDot && (
              <span className="w-2 h-2 rounded-full bg-secondary-container inline-block" />
            )}
          </button>
        )
      })}
    </div>
  )
}
