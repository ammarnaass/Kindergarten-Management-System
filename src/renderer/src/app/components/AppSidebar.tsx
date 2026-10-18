import React from 'react'
import { NavLink } from 'react-router-dom'

export type SidebarMode = 'expanded' | 'rail' | 'drawer'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: 'dashboard', path: '/dashboard' },
  { id: 'children', label: 'الأطفال', icon: 'escalator_warning', path: '/children' },
  { id: 'classrooms', label: 'الفصول ووضع الفصل', icon: 'meeting_room', path: '/classrooms' },
  { id: 'attendance', label: 'الحضور والانصراف', icon: 'how_to_reg', path: '/attendance' },
  { id: 'safe-pickup', label: 'الاستلام الآمن عند البوابة', icon: 'qr_code_scanner', path: '/safe-pickup' },
  { id: 'finance', label: 'المالية والمدفوعات', icon: 'account_balance_wallet', path: '/finance' },
  { id: 'daily-reports', label: 'التقرير اليومي والملاحظات', icon: 'summarize', path: '/daily' },
  { id: 'timetable', label: 'التوقيت والجدول اليومي', icon: 'schedule', path: '/timetable' },
  { id: 'health-safety', label: 'الصحة والسلامة', icon: 'medical_services', path: '/health' },
  { id: 'parents', label: 'أولياء الأمور', icon: 'family_restroom', path: '/parents' },
  { id: 'staff', label: 'الموظفون', icon: 'badge', path: '/staff' },
  { id: 'reports', label: 'التقارير والمطبوعات', icon: 'print', path: '/reports' },
  { id: 'backup', label: 'النسخ الاحتياطي والبيانات', icon: 'database', path: '/backup' },
  { id: 'settings', label: 'الإعدادات', icon: 'settings', path: '/settings' },
]

export interface AppSidebarProps {
  mode?: SidebarMode
  isOpen?: boolean
  onCloseDrawer?: () => void
  onToggleMode?: () => void
}

export function AppSidebar({
  mode = 'expanded',
  isOpen = false,
  onCloseDrawer,
  onToggleMode
}: AppSidebarProps) {
  // ── 1. Drawer Mode (Mobile & Narrow Windows < 1024px) ──
  if (mode === 'drawer') {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-hidden select-none">
        {/* Backdrop */}
        <div
          onClick={onCloseDrawer}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />

        {/* Sliding Drawer Container */}
        <aside className="fixed right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-surface-container-lowest z-50 flex flex-col justify-between py-4 px-3 shadow-2xl border-l border-outline-variant/30 animate-in slide-in-from-right duration-200">
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/30 px-1">
              <div className="flex items-center gap-2 text-primary font-bold text-headline-sm">
                <span className="material-symbols-outlined text-[24px]">school</span>
                <span>قائمة روضتي</span>
              </div>
              <button
                type="button"
                onClick={onCloseDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                title="إغلاق القائمة"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-0.5">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={onCloseDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-label-md text-label-md transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-xs border-r-3 border-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Drawer Footer Status */}
          <div className="pt-3 border-t border-outline-variant/30 text-caption text-on-surface-variant flex items-center justify-between">
            <span>نظام محلي 100%</span>
            <span className="font-mono text-primary font-bold">SQLite WAL</span>
          </div>
        </aside>
      </div>
    )
  }

  // ── 2. Compact Rail Mode (1024px - 1279px or User Preference) ──
  if (mode === 'rail') {
    return (
      <aside className="fixed right-0 top-[102px] bottom-[32px] w-[72px] bg-surface-container-lowest z-30 flex flex-col justify-between py-2.5 px-1 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-outline-variant/30 select-none transition-all duration-200">
        <div>
          {/* Quick Expand Toggle Button */}
          {onToggleMode && (
            <div className="flex justify-center pb-2 mb-1 border-b border-outline-variant/20">
              <button
                type="button"
                onClick={onToggleMode}
                className="w-10 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                title="توسيع القائمة الجانبية (Ctrl+B)"
              >
                <span className="material-symbols-outlined text-[20px]">dock_to_right</span>
              </button>
            </div>
          )}

          {/* Rail Items */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-none">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/dashboard'}
                title={item.label}
                className={({ isActive }) =>
                  `group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-2xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="text-[10px] leading-tight truncate text-center w-full mt-0.5 font-medium">
                  {item.label.split(' ')[0]}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Rail Footer Mini Indicator */}
        <div className="flex flex-col items-center justify-center gap-1 pt-2 border-t border-outline-variant/20">
          <span
            className="material-symbols-outlined text-[18px] text-emerald-500"
            title="قاعدة البيانات متصلة ومحفوظة محلياً"
          >
            database
          </span>
          <span className="text-[9px] font-mono text-on-surface-variant">WAL</span>
        </div>
      </aside>
    )
  }

  // ── 3. Full Expanded Mode (≥ 1280px) ──
  return (
    <aside className="fixed right-0 top-[102px] bottom-[32px] w-64 bg-surface-container-lowest z-30 flex flex-col justify-between py-space-sm px-space-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-outline-variant/30 select-none transition-all duration-200">
      <div className="overflow-y-auto flex-1 space-y-1">
        {onToggleMode && (
          <div className="flex items-center justify-between px-2 pb-1.5 mb-1 border-b border-outline-variant/20">
            <span className="text-caption font-semibold text-on-surface-variant">الأقسام الرئيسية</span>
            <button
              type="button"
              onClick={onToggleMode}
              className="w-7 h-7 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              title="تصغير إلى شريط أيقونات سريع (Rail)"
            >
              <span className="material-symbols-outlined text-[18px]">menu_open</span>
            </button>
          </div>
        )}

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-md py-2 transition-all font-label-lg text-label-lg rounded-xl ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-2xs border-r-3 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Storage and shortcut footer card */}
      <div className="p-space-sm rounded-xl bg-surface-container-low mx-1 border border-outline-variant/20 mt-2">
        <div className="flex items-center justify-between text-on-surface-variant font-caption text-caption mb-1">
          <span>سعة التخزين المحلي</span>
          <span className="font-mono font-bold text-primary">12%</span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: '12%' }} />
        </div>
        <div className="flex items-center justify-between mt-2 font-caption text-caption text-outline">
          <span>مفتاح سريع</span>
          <span className="font-mono font-bold">F11 ملء الشاشة</span>
        </div>
      </div>
    </aside>
  )
}

