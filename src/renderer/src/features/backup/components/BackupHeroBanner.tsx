interface BackupHeroBannerProps {
  lastBackupDate?: string
  lastBackupSize?: string
  walSize?: string
  isCreating?: boolean
  onCreateBackup: () => void
}

export function BackupHeroBanner({
  lastBackupDate = 'اليوم، 14:30',
  lastBackupSize = '24.3 MB',
  walSize = '1.4 MB',
  isCreating = false,
  onCreateBackup
}: BackupHeroBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-sm mb-space-lg select-none">
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg">
        <div className="flex items-start gap-space-md">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shrink-0">
            <span className="material-symbols-outlined text-3xl">cloud_sync</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-space-xs flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                إدارة النسخ الاحتياطي والبيانات المحلية
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                SQLite نشط وسليم 100% (Drizzle ORM)
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 flex-wrap">
              <span className="material-symbols-outlined text-base text-primary">verified_user</span>
              <span>نظام تخزين محلي غير معتمد على الإنترنت، يحفظ سجلات الأطفال، الدفعات، والملفات الطبية بأمان عالي.</span>
            </p>

            <div className="flex items-center gap-space-md pt-1 font-caption text-caption text-outline">
              <span>إصدار المحرك: SQLite v3.45.1</span>
              <span>•</span>
              <span>معيار التشفير: AES-GCM-256</span>
              <span>•</span>
              <span>حجم ملف العمليات (WAL): {walSize}</span>
            </div>
          </div>
        </div>

        {/* Quick Status & Primary Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full xl:w-auto shrink-0">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">schedule</span>
            </div>
            <div>
              <span className="block font-caption text-caption text-on-surface-variant">
                آخر نسخة احتياطية ناجحة
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {lastBackupDate}{' '}
                <span className="font-caption text-caption text-emerald-700 font-semibold">
                  ({lastBackupSize})
                </span>
              </span>
            </div>
          </div>

          <button
            onClick={onCreateBackup}
            disabled={isCreating}
            className="group relative overflow-hidden flex items-center justify-center gap-2 px-space-xl py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-xl transition-transform ${
                isCreating ? 'animate-spin' : 'group-hover:rotate-12'
              }`}
            >
              {isCreating ? 'autorenew' : 'save'}
            </span>
            <span>{isCreating ? 'جاري النسخ...' : 'إنشاء نسخة احتياطية الآن'}</span>
            <kbd className="px-1.5 py-0.5 rounded bg-on-primary/20 text-on-primary font-caption text-caption font-mono mr-1">
              Ctrl+B
            </kbd>
          </button>
        </div>
      </div>
    </div>
  )
}
