import { AppearanceSettings } from '../types'
import { useDisplayZoom } from '@/app/providers/DisplayZoomProvider'

interface TypographyDensityCardProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
}

export function TypographyDensityCard({
  settings,
  onChange
}: TypographyDensityCardProps) {
  const { zoomLevel, setZoomLevel, resetZoom, availableZoomLevels } = useDisplayZoom()

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">text_fields</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            الخطوط وتكبير العرض (Display & Typography)
          </h2>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">aspect_ratio</span>
      </div>

      {/* Font Family Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="font-label-sm text-label-sm font-bold text-on-surface">
          نوع الخط العربي لواجهة العرض
        </label>
        <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-[12px]">
              ض
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                IBM Plex Sans Arabic (خط النظام الأساسي)
              </span>
              <span className="font-caption text-caption text-outline">
                محسن لشاشات سطح المكتب عالية الدقة وبطاقات الطلاب
              </span>
            </div>
          </div>
          <button
            type="button"
            className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
          >
            تغيير الخط
          </button>
        </div>
      </div>

      {/* Font Scale */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="font-label-sm text-label-sm font-bold text-on-surface">
            مقياس حجم الخط (Font Scale)
          </label>
          <span className="font-mono text-label-sm text-label-sm font-semibold text-primary">
            {settings.fontScale === 'small' ? '90%' : settings.fontScale === 'large' ? '110%' : '100%'} (14px الأساسي)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1 rounded-xl border border-surface-variant/30">
          <button
            type="button"
            onClick={() => onChange({ fontScale: 'small' })}
            className={`py-1.5 text-center rounded-lg font-label-sm text-label-sm transition-all ${
              settings.fontScale === 'small'
                ? 'bg-surface-container-lowest shadow-xs font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            صغير (90%)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fontScale: 'standard' })}
            className={`py-1.5 text-center rounded-lg font-label-sm text-label-sm transition-all ${
              settings.fontScale === 'standard'
                ? 'bg-surface-container-lowest shadow-xs font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            قياسي (100%)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fontScale: 'large' })}
            className={`py-1.5 text-center rounded-lg font-label-sm text-label-sm transition-all ${
              settings.fontScale === 'large'
                ? 'bg-surface-container-lowest shadow-xs font-bold text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            كبير (110%)
          </button>
        </div>
      </div>

      {/* Display Zoom & Resolution Scaling */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">aspect_ratio</span>
            تحجيم الشاشة (Display Zoom)
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-label-sm text-label-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {zoomLevel}%
            </span>
            {zoomLevel !== 100 && (
              <button
                type="button"
                onClick={resetZoom}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors underline"
                title="إعادة ضبط إلى 100%"
              >
                إعادة ضبط
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant/30">
          {availableZoomLevels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setZoomLevel(lvl)}
              className={`py-1.5 text-center rounded-lg font-mono text-xs transition-all ${
                zoomLevel === lvl
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {lvl}%
            </button>
          ))}
        </div>
        <p className="text-[11px] text-on-surface-variant flex items-center gap-1 flex-wrap">
          <span className="material-symbols-outlined text-[14px] text-outline">info</span>
          يتكيف فورياً مع مختلف الشاشات. اختصارات لوحة المفاتيح:
          <span className="font-mono font-bold mx-1">Ctrl +</span> و
          <span className="font-mono font-bold mx-1">Ctrl -</span> و
          <span className="font-mono font-bold mx-1">Ctrl 0</span>
        </p>
      </div>

      {/* Interface Density Mode */}
      <div className="flex flex-col gap-1.5">
        <label className="font-label-sm text-label-sm font-bold text-on-surface">
          كثافة واجهة الجداول والبطاقات
        </label>
        <div className="grid grid-cols-2 gap-space-sm">
          <div
            onClick={() => onChange({ uiDensity: 'comfortable' })}
            className={`p-space-sm rounded-lg cursor-pointer flex flex-col gap-1 border transition-all ${
              settings.uiDensity === 'comfortable'
                ? 'bg-surface-container border-primary shadow-xs'
                : 'bg-surface-container-low hover:bg-surface-container border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-on-surface">مريح / لمس</span>
              <span className="material-symbols-outlined text-primary text-[18px]">
                {settings.uiDensity === 'comfortable' ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant">
              ارتفاع الصف 52px، مسافات رحبة للبوابات
            </span>
          </div>

          <div
            onClick={() => onChange({ uiDensity: 'compact' })}
            className={`p-space-sm rounded-lg cursor-pointer flex flex-col gap-1 border transition-all ${
              settings.uiDensity === 'compact'
                ? 'bg-surface-container border-primary shadow-xs'
                : 'bg-surface-container-low hover:bg-surface-container border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-medium text-on-surface">مكثف (Audit)</span>
              <span className="material-symbols-outlined text-outline text-[18px]">
                {settings.uiDensity === 'compact' ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </div>
            <span className="font-caption text-caption text-outline">
              ارتفاع الصف 36px، للمحاسبة وسجلات القيد
            </span>
          </div>
        </div>
      </div>

      {/* Persistent Keys Footer Option */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-surface-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">keyboard</span>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-bold text-on-surface">
              شريط اختصارات لوحة المفاتيح
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              إظهار أزرار (F1-F12) في الشريط السفلي الثابت
            </span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={settings.showFooterKeys}
          onChange={(e) => onChange({ showFooterKeys: e.target.checked })}
          className="w-4 h-4 rounded text-primary focus:ring-primary-container"
        />
      </div>
    </div>
  )
}
