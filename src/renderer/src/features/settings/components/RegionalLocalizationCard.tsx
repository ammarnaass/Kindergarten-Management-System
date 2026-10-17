import { AppearanceSettings } from '../types'

interface RegionalLocalizationCardProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
}

export function RegionalLocalizationCard({
  settings,
  onChange
}: RegionalLocalizationCardProps) {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const currencies = [
    { id: 'دج (دينار جزائري)', label: 'دينار جزائري (دج)', symbol: 'DZD' },
    { id: 'ر.س (ريال سعودي)', label: 'ريال سعودي (ر.س)', symbol: 'SAR' },
    { id: 'د.إ (درهم إماراتي)', label: 'درهم إماراتي (د.إ)', symbol: 'AED' },
    { id: '$ (دولار أمريكي)', label: 'دولار أمريكي ($)', symbol: 'USD' },
    { id: '€ (يورو)', label: 'يورو (€)', symbol: 'EUR' }
  ]

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">language</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            اللغة والخيارات الإقليمية
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-[11px] font-bold">
          {settings.uiLanguage.toUpperCase()}-LOCAL
        </span>
      </div>

      {/* Language Selectors */}
      <div className="flex flex-col gap-space-xs">
        <label className="font-label-sm text-label-sm font-bold text-on-surface">
          لغة واجهة الاستخدام الأساسية
        </label>
        <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between border border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-5 rounded bg-surface-container-high flex items-center justify-center font-bold text-[10px] text-primary">
              AR
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                العربية (Arabic - RTL)
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                واجهة متكاملة من اليمين لليسار مع مصطلحات تربوية معتمدة
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
        </div>
      </div>

      {/* Date & Calendar Scheme */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <label className="font-label-sm text-label-sm font-bold text-on-surface">
          نظام التقويم والتاريخ المعتمد
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container cursor-pointer border border-surface-variant/30">
            <input
              type="radio"
              name="calendar_type_regional"
              checked={settings.calendarType === 'gregorian'}
              onChange={() => onChange({ calendarType: 'gregorian' })}
              className="mt-1 text-primary focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                التقويم الميلادي الأساسي (الأشهر الميلادية الرسمية)
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                مثال: {new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer border border-surface-variant/20">
            <input
              type="radio"
              name="calendar_type_regional"
              checked={settings.calendarType === 'hijri'}
              onChange={() => onChange({ calendarType: 'hijri' })}
              className="mt-1 text-primary focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-medium text-on-surface">
                التقويم الهجري (تقويم أم القرى)
              </span>
              <span className="font-caption text-caption text-outline">
                عرض التواريخ الهجرية في السجلات والتقارير
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Currency & Time Format */}
      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm font-bold text-on-surface">العملة الافتراضية</label>
          <select
            value={settings.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            className="p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-variant/30"
          >
            {currencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm font-bold text-on-surface">صيغة التوقيت</label>
          <select
            value={settings.timeFormat}
            onChange={(e) => onChange({ timeFormat: e.target.value as any })}
            className="p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-variant/30"
          >
            <option value="12h">نظام 12 ساعة (08:30 ص / 01:30 م)</option>
            <option value="24h">نظام 24 ساعة (08:30 / 13:30)</option>
          </select>
        </div>
      </div>

      {/* Local Clock Sync Info */}
      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm text-on-surface-variant border border-surface-variant/30">
        <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">
            المنطقة الزمنية المحلية: {localTimeZone}
          </span>
          <span className="font-caption text-caption">
            مزامنة مباشرة مع ساعة نظام التشغيل وساعة اللوحة الأم (Hardware RTC)
          </span>
        </div>
      </div>
    </div>
  )
}
