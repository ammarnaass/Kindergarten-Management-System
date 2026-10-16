import { AppearanceSettings } from '../types'

interface RegionalLocalizationCardProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
}

export function RegionalLocalizationCard({
  settings,
  onChange
}: RegionalLocalizationCardProps) {
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
          AR-SA
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
              🇸🇦
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                العربية (Arabic - RTL)
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                واجهة متكاملة من اليمين لليسار مع مفردات تربوية معتمدة
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low mt-1 border border-surface-variant/30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-medium text-on-surface">
              لغات ثانوية للشهادات والتقارير المطبوعة
            </span>
            <span className="font-caption text-caption text-outline">
              الإنجليزية (English) والفرنسية (Français)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface">
              EN
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface">
              FR
            </span>
          </div>
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
              checked={settings.calendarType === 'hijri'}
              onChange={() => onChange({ calendarType: 'hijri' })}
              className="mt-1 text-primary focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                التقويم الهجري أولاً (أم القرى) مع المقابل الميلادي
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                مثال: 14 شعبان 1446هـ (13 فبراير 2025م)
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer border border-surface-variant/20">
            <input
              type="radio"
              name="calendar_type_regional"
              checked={settings.calendarType === 'gregorian'}
              onChange={() => onChange({ calendarType: 'gregorian' })}
              className="mt-1 text-primary focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-medium text-on-surface">
                التقويم الميلادي أولاً مع المقابل الهجري
              </span>
              <span className="font-caption text-caption text-outline">
                مثال: 13 فبراير 2025م (14 شعبان 1446هـ)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Currency & Time Format */}
      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm font-bold text-on-surface">العملة الافتراضية</label>
          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-variant/30">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {settings.currency}
            </span>
            <span className="font-mono text-caption text-primary font-bold">SAR</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm font-bold text-on-surface">صيغة التوقيت</label>
          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-variant/30">
            <span className="font-label-md text-label-md font-bold text-on-surface">نظام 12 ساعة</span>
            <span className="font-mono text-caption text-outline">08:30 ص</span>
          </div>
        </div>
      </div>

      {/* Local Clock Sync Info */}
      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm text-on-surface-variant border border-surface-variant/30">
        <span className="material-symbols-outlined text-primary text-[20px]">update</span>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">
            توقيت مكة المكرمة (GMT+3)
          </span>
          <span className="font-caption text-caption">
            مزامنة تامة وغير منقطعة مع ساعة اللوحة الأم (Hardware RTC)
          </span>
        </div>
      </div>
    </div>
  )
}
