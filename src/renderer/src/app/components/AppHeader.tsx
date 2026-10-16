import { useNavigate } from 'react-router-dom'
import { AppLogo } from './AppLogo'

interface AppHeaderProps {
  onOpenSearch: () => void
  onOpenQuickPayment?: () => void
  onOpenNewChild?: () => void
  currentUser?: { username: string; role: string } | null
}

export function AppHeader({
  onOpenSearch,
  onOpenQuickPayment,
  onOpenNewChild,
  currentUser = { username: 'أ. نادية المنصوري', role: 'مديرة الروضة' }
}: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-[38px] right-0 left-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      <div className="flex items-center gap-space-md">
        {/* Brand Logo & Name */}
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center pl-space-md cursor-pointer group"
        >
          <AppLogo size="md" subtitle="فرع الياسمين النموذجي" />
        </div>

        {/* Quick Search Bar (Ctrl+K) */}
        <div
          onClick={onOpenSearch}
          className="relative flex items-center w-72 lg:w-96 cursor-pointer"
        >
          <span className="material-symbols-outlined absolute right-3 text-outline pointer-events-none text-lg">
            search
          </span>
          <input
            className="w-full h-9 pr-9 pl-14 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer hover:bg-surface-container transition-colors"
            placeholder="بحث فوري عن طفل، ولي أمر، فاتورة..."
            readOnly
            type="text"
          />
          <kbd className="absolute left-2.5 px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption font-semibold shadow-xs">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        {/* Quick Actions */}
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => (onOpenQuickPayment ? onOpenQuickPayment() : navigate('/finance'))}
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>تسجيل دفعة</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-base">checklist</span>
            <span>حضور اليوم</span>
          </button>

          <button
            onClick={() => (onOpenNewChild ? onOpenNewChild() : navigate('/children'))}
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>طفل جديد</span>
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant/50" />

        {/* Utilities & User Status */}
        <div className="flex items-center gap-space-sm">
          <button
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="قفل الشاشة (Ctrl+L)"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">lock</span>
          </button>

          <button
            className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="التنبيهات المحلية"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
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
