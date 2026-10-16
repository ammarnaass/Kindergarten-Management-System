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
    <footer className="fixed bottom-0 left-0 right-0 h-[32px] bg-inverse-surface text-inverse-on-surface z-50 flex items-center justify-between px-space-md font-label-sm text-label-sm select-none">
      <div className="flex items-center gap-space-lg">
        {/* Database Status */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-inverse-on-surface font-body-sm text-body-sm">
            قاعدة البيانات المحلية: SQLite متصلة وسليمة 100%
          </span>
        </div>

        {/* Backup Status */}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-400">
            check_circle
          </span>
          <span className="text-inverse-on-surface/90 font-body-sm text-body-sm">
            آخر نسخة احتياطية: {backupText}
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

      <div className="flex items-center gap-space-lg">
        <div className="text-inverse-on-surface/80 font-body-sm text-body-sm hidden md:block">
          السنة الدراسية: 2026 / 2027
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-mono text-caption text-inverse-on-surface/70">
            Ctrl+N طفل جديد
          </span>
          <span className="font-mono text-caption text-inverse-on-surface/70">•</span>
          <span className="font-mono text-caption text-inverse-on-surface/70">
            Ctrl+P طباعة
          </span>
        </div>
        <div className="px-2 py-0.5 rounded bg-surface-container-highest/20 font-mono text-caption text-inverse-on-surface/90">
          v2.0 Desktop Offline
        </div>
      </div>
    </footer>
  )
}
