import { DatabaseSettings } from '../types'

interface SqliteWalHealthCardProps {
  settings: DatabaseSettings
  onChange: (fields: Partial<DatabaseSettings>) => void
  onOptimize: () => void
  onOpenFolder?: () => void
}

export function SqliteWalHealthCard({
  settings,
  onChange,
  onOptimize,
  onOpenFolder
}: SqliteWalHealthCardProps) {
  return (
    <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                محرك قاعدة البيانات المحلية (SQLite WAL)
              </h3>
              <span className="font-caption text-caption text-outline">
                تخزين داخلي فائق السرعة يعمل محلياً دون أي خوادم خارجية
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-bold shadow-xs">
            سليم 100%
          </span>
        </div>

        <div className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              مسار الملف الرئيسي النشط
            </label>
            <div className="flex items-center gap-2">
              <input
                dir="ltr"
                readOnly
                type="text"
                value={settings.activeDbPath}
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono text-body-sm border border-surface-variant/30"
              />
              {onOpenFolder && (
                <button
                  type="button"
                  onClick={onOpenFolder}
                  className="px-3 py-2 bg-surface-container hover:bg-surface-variant rounded-xl text-primary font-label-sm text-label-sm font-bold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  <span>فتح المجلد</span>
                </button>
              )}
            </div>
          </div>

          {/* Database Size & Metrics Bento */}
          <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-md rounded-xl text-center border border-surface-variant/30">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant">حجم البيانات</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary font-mono">
                {settings.dataSize}
              </span>
            </div>
            <div className="flex flex-col border-r border-surface-variant">
              <span className="font-caption text-caption text-on-surface-variant">عدد السجلات</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">
                {settings.recordsCount}
              </span>
            </div>
            <div className="flex flex-col border-r border-surface-variant">
              <span className="font-caption text-caption text-on-surface-variant">وضع التسجيل</span>
              <span className="font-headline-sm text-headline-sm font-bold text-secondary font-mono">
                {settings.encryptionType}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vacuumOnExit}
                onChange={(e) => onChange({ vacuumOnExit: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                تفعيل ضغط وصيانة الملف التلقائي (Vacuum on App Exit)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.walCheckpointing}
                onChange={(e) => onChange({ walCheckpointing: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                الاحتفاظ بسجل المعاملات اليومي المستقل (WAL Checkpointing)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <button
          type="button"
          onClick={onOptimize}
          className="flex items-center gap-1.5 px-space-md py-2 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">build_circle</span>
          <span>فحص وضغط البيانات الآن (VACUUM)</span>
        </button>
        <span className="font-caption text-caption text-outline">محرك SQLite مدمج محلياً</span>
      </div>
    </div>
  )
}
