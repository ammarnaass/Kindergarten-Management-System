import { Link } from 'react-router-dom'

interface AppFooterProps {
  backupText?: string
  backupOk?: boolean
  onQuickBackup?: () => void
}

export function AppFooter({
  backupText = 'اليوم 14:30 (24.3 MB)',
  backupOk = true,
  onQuickBackup,
}: AppFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[32px] bg-inverse-surface text-inverse-on-surface z-50 flex items-center justify-between px-2 sm:px-space-md font-label-sm text-label-sm select-none border-t border-inverse-on-surface/10">
      <div className="flex items-center gap-2 sm:gap-space-lg min-w-0">
        {/* Database Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-inverse-on-surface font-body-sm text-[11px] sm:text-body-sm truncate">
            <span className="hidden sm:inline">قاعدة البيانات المحلية: </span>
            SQLite متصلة وسليمة 100%
          </span>
        </div>

        {/* Backup Status */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined text-sm text-emerald-400">
            check_circle
          </span>
          <span className="text-inverse-on-surface/90 font-body-sm text-[11px] sm:text-body-sm truncate">
            آخر نسخة: {backupText}
          </span>
          {onQuickBackup ? (
            <button
              onClick={onQuickBackup}
              className="underline text-primary-fixed-dim hover:text-primary-fixed mr-1 font-semibold"
            >
              نسخ الآن
            </button>
          ) : (
            <Link
              to="/backup"
              className="underline text-primary-fixed-dim hover:text-primary-fixed mr-1 font-semibold"
            >
              نسخ الآن
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-space-lg shrink-0">
        <div className="text-inverse-on-surface/80 font-body-sm text-caption hidden lg:block">
          السنة الدراسية: 2026 / 2027
        </div>
        <div className="hidden xl:flex items-center gap-space-sm">
          <span className="font-mono text-caption text-inverse-on-surface/70">
            Ctrl+N طفل جديد
          </span>
          <span className="font-mono text-caption text-inverse-on-surface/70">•</span>
          <span className="font-mono text-caption text-inverse-on-surface/70">
            Ctrl+P طباعة
          </span>
          <span className="font-mono text-caption text-inverse-on-surface/70">•</span>
          <span className="font-mono text-caption text-inverse-on-surface/70">
            Ctrl+B القائمة
          </span>
        </div>
        <div className="px-2 py-0.5 rounded bg-surface-container-highest/20 font-mono text-[10px] text-inverse-on-surface/90">
          v2.0 Desktop
        </div>
      </div>
    </footer>
  )
}
