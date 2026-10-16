interface SettingsHeaderBannerProps {
  isSaving: boolean
  toastMessage: string | null
  onSave: () => void
  onReset: () => void
}

export function SettingsHeaderBanner({
  isSaving,
  toastMessage,
  onSave,
  onReset
}: SettingsHeaderBannerProps) {
  return (
    <>
      {/* Floating toast notification for offline SQLite sync */}
      <div
        className={`fixed top-[52px] left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 pointer-events-none ${
          toastMessage
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-16'
        }`}
      >
        <div className="flex items-center gap-2 bg-on-surface text-surface py-2 px-5 rounded-full shadow-2xl font-label-md text-label-md border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary-container text-[18px]">
            cloud_done
          </span>
          <span>{toastMessage || 'تمت مزامنة وحفظ التعديلات في SQLite محلياً (WAL-commit)'}</span>
        </div>
      </div>

      {/* Main executive settings header banner */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl shadow-xs mb-space-lg p-space-lg border border-surface-variant/40">
        <div className="absolute -left-12 -bottom-16 w-64 h-64 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-secondary-fixed/20 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2 font-caption text-caption text-primary font-semibold tracking-wide">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>لوحة التحكم والتفضيلات المركزية • Electron Native Engine</span>
            </div>
            <h1 className="font-display-md text-display-md text-on-surface tracking-tight font-bold">
              إعدادات النظام والتفضيلات المحلية (Offline Settings)
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              إدارة هوية الروضة، تكوين وتوصيل الطابعات وقارئات الباركود اللحظية، سياسات النسخ
              الاحتياطي لقاعدة SQLite المشفرة دون الحاجة للاتصال بالإنترنت.
            </p>
          </div>

          {/* Quick Action Controls & Status Indicator */}
          <div className="flex flex-wrap items-center gap-space-sm pt-2 lg:pt-0">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl text-on-surface-variant border border-surface-variant/40">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm font-semibold">
                محرك البيانات: SQLite v3.44 متصل
              </span>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-lg text-label-lg font-semibold shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>استعادة الافتراضي</span>
            </button>

            <button
              type="button"
              onClick={onSave}
              className={`flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary hover:opacity-95 text-on-primary transition-all duration-200 font-label-lg text-label-lg font-semibold shadow-md shadow-primary/25 active:scale-95 ${
                isSaving ? 'scale-95 opacity-80' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>حفظ التعديلات</span>
              <kbd className="px-2 py-0.5 bg-white/20 text-on-primary rounded font-mono text-label-sm font-bold">
                Ctrl+S
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
