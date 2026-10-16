interface SettingsBottomBarProps {
  onSave: () => void
}

export function SettingsBottomBar({ onSave }: SettingsBottomBarProps) {
  return (
    <div className="mt-space-lg p-space-md bg-surface-container-lowest rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-surface-variant/40">
      <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
        <span className="material-symbols-outlined text-secondary-container text-[20px]">
          security
        </span>
        <span>
          يتم تشفير وتحديث ملف الإعدادات المحلي{' '}
          <code className="font-mono bg-surface-container px-1.5 py-0.5 rounded text-on-surface text-caption">
            config.sqlite.enc
          </code>{' '}
          تلقائياً وبشكل دوري.
        </span>
      </div>

      <div className="flex items-center gap-space-sm">
        <button
          type="button"
          onClick={onSave}
          className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold hover:opacity-95 shadow-md shadow-primary/20 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>حفظ كافة التغييرات الحالية</span>
        </button>
      </div>
    </div>
  )
}
