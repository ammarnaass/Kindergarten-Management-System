import { NavLink } from 'react-router-dom'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: 'dashboard', path: '/dashboard' },
  { id: 'children', label: 'الأطفال', icon: 'escalator_warning', path: '/children' },
  { id: 'classrooms', label: 'الفصول ووضع الفصل', icon: 'meeting_room', path: '/attendance' },
  { id: 'attendance', label: 'الحضور والانصراف', icon: 'how_to_reg', path: '/attendance' },
  { id: 'safe-pickup', label: 'الاستلام الآمن عند البوابة', icon: 'qr_code_scanner', path: '/safe-pickup' },
  { id: 'finance', label: 'المالية والمدفوعات', icon: 'account_balance_wallet', path: '/finance' },
  { id: 'daily-reports', label: 'التقرير اليومي', icon: 'assignment', path: '/reports' },
  { id: 'health-safety', label: 'الصحة والسلامة', icon: 'medical_services', path: '/children' },
  { id: 'parents', label: 'أولياء الأمور', icon: 'family_restroom', path: '/children' },
  { id: 'staff', label: 'الموظفون', icon: 'badge', path: '/settings' },
  { id: 'reports', label: 'التقارير والمطبوعات', icon: 'print', path: '/reports' },
  { id: 'backup', label: 'النسخ الاحتياطي والبيانات', icon: 'database', path: '/backup' },
  { id: 'settings', label: 'الإعدادات', icon: 'settings', path: '/settings' },
]

export function AppSidebar() {
  return (
    <aside className="fixed right-0 top-[102px] bottom-[32px] w-64 bg-surface-container-lowest z-30 flex flex-col justify-between py-space-sm px-space-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      <div className="overflow-y-auto flex-1 space-y-1">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-md py-2 transition-all font-label-lg text-label-lg ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold rounded-lg shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface rounded-lg'
                }`
              }
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Storage and shortcut footer card */}
      <div className="p-space-sm rounded-lg bg-surface-container-low mx-1">
        <div className="flex items-center justify-between text-on-surface-variant font-caption text-caption mb-1">
          <span>سعة التخزين المحلي</span>
          <span className="font-mono font-bold text-primary">12%</span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: '12%' }} />
        </div>
        <div className="flex items-center justify-between mt-2 font-caption text-caption text-outline">
          <span>مفتاح سريع</span>
          <span className="font-mono">F11 ملء الشاشة</span>
        </div>
      </div>
    </aside>
  )
}
