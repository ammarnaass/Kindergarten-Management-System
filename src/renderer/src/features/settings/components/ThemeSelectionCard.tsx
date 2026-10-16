import { AppearanceSettings } from '../types'

interface ThemeSelectionCardProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
}

export function ThemeSelectionCard({
  settings,
  onChange
}: ThemeSelectionCardProps) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">dark_mode</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            نمط العرض ومظهر النظام (Theme)
          </h2>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">desktop_windows</span>
      </div>

      {/* 3 Interactive Visual Theme Cards */}
      <div className="grid grid-cols-1 gap-space-sm">
        {/* Light Mode */}
        <div
          onClick={() => onChange({ activeTheme: 'light' })}
          className={`p-space-md rounded-xl cursor-pointer flex items-center justify-between transition-all border ${
            settings.activeTheme === 'light'
              ? 'bg-surface-container-high/60 border-primary shadow-xs'
              : 'bg-surface-container-low hover:bg-surface-container border-transparent'
          }`}
        >
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-11 rounded-lg bg-surface p-1 shadow-xs flex flex-col gap-1 justify-between border border-surface-variant/40">
              <div className="w-full h-2 rounded bg-surface-container-high flex items-center justify-between px-1">
                <div className="w-1 h-1 rounded-full bg-error" />
                <div className="w-4 h-1 rounded bg-outline-variant" />
              </div>
              <div className="flex gap-1 flex-1">
                <div className="w-2.5 h-full rounded bg-surface-container-low" />
                <div className="flex-1 rounded bg-white p-0.5">
                  <div className="w-full h-1 bg-primary/30 rounded mb-0.5" />
                  <div className="w-2/3 h-1 bg-surface-variant rounded" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  النمط النهاري الهادئ
                </span>
                {settings.activeTheme === 'light' && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary text-on-primary">
                    نشط
                  </span>
                )}
              </div>
              <span className="font-caption text-caption text-on-surface-variant">
                النمط المكتبي الافتراضي عالي التباين
              </span>
            </div>
          </div>
          {settings.activeTheme === 'light' ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-variant" />
          )}
        </div>

        {/* Dark / Slate Mode */}
        <div
          onClick={() => onChange({ activeTheme: 'dark' })}
          className={`p-space-md rounded-xl cursor-pointer flex items-center justify-between transition-all border ${
            settings.activeTheme === 'dark'
              ? 'bg-surface-container-high/60 border-primary shadow-xs'
              : 'bg-surface-container-low hover:bg-surface-container border-transparent'
          }`}
        >
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-11 rounded-lg bg-inverse-surface p-1 flex flex-col gap-1 justify-between">
              <div className="w-full h-2 rounded bg-surface-variant/20 flex items-center justify-between px-1">
                <div className="w-1 h-1 rounded-full bg-error" />
                <div className="w-4 h-1 rounded bg-surface-variant/40" />
              </div>
              <div className="flex gap-1 flex-1">
                <div className="w-2.5 h-full rounded bg-surface-variant/10" />
                <div className="flex-1 rounded bg-surface-variant/30 p-0.5">
                  <div className="w-full h-1 bg-primary-fixed rounded mb-0.5" />
                  <div className="w-2/3 h-1 bg-surface-variant/40 rounded" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-medium text-on-surface">
                النمط الداكن المكتبي
              </span>
              <span className="font-caption text-caption text-outline">
                Slate Dark - يخفف إجهاد العين ليلاً
              </span>
            </div>
          </div>
          {settings.activeTheme === 'dark' ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-variant" />
          )}
        </div>

        {/* OS Sync Mode */}
        <div
          onClick={() => onChange({ activeTheme: 'system' })}
          className={`p-space-md rounded-xl cursor-pointer flex items-center justify-between transition-all border ${
            settings.activeTheme === 'system'
              ? 'bg-surface-container-high/60 border-primary shadow-xs'
              : 'bg-surface-container-low hover:bg-surface-container border-transparent'
          }`}
        >
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-11 rounded-lg bg-gradient-to-r from-surface to-inverse-surface p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-outline text-[20px]">sync</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-medium text-on-surface">
                مطابقة نظام التشغيل
              </span>
              <span className="font-caption text-caption text-outline">
                التبديل التلقائي مع Windows / macOS
              </span>
            </div>
          </div>
          {settings.activeTheme === 'system' ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-variant" />
          )}
        </div>
      </div>

      {/* Accent Colors Selection */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <label className="font-label-sm text-label-sm font-bold text-on-surface">
          اللون البارز المعتمد (Accent Tint)
        </label>
        <div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30">
          <button
            type="button"
            onClick={() => onChange({ accentColor: 'blue' })}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
              settings.accentColor === 'blue'
                ? 'bg-surface-container-lowest shadow-xs'
                : 'hover:bg-surface-container'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px]">
              ✓
            </span>
            <span className="font-label-sm text-label-sm font-bold text-primary">أزرق روضتي</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ accentColor: 'green' })}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${
              settings.accentColor === 'green'
                ? 'bg-surface-container-lowest shadow-xs'
                : 'hover:bg-surface-container'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#10b981]" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">الواحة</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ accentColor: 'purple' })}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${
              settings.accentColor === 'purple'
                ? 'bg-surface-container-lowest shadow-xs'
                : 'hover:bg-surface-container'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#8b5cf6]" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">البنفسج</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ accentColor: 'navy' })}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${
              settings.accentColor === 'navy'
                ? 'bg-surface-container-lowest shadow-xs'
                : 'hover:bg-surface-container'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#1e293b]" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">كحلي</span>
          </button>
        </div>
      </div>
    </div>
  )
}
