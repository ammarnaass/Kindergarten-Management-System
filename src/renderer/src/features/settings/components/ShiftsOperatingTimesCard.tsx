import { AppearanceSettings } from '../types'

interface ShiftsOperatingTimesCardProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
}

export function ShiftsOperatingTimesCard({
  settings,
  onChange
}: ShiftsOperatingTimesCardProps) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">schedule</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            فترات الدوام ومواعيد البوابة
          </h2>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
      </div>

      {/* Shift 1: Morning */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              الفترة الصباحية الأساسية
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-primary">
            إلزامية لكافة المراحل
          </span>
        </div>
        <div className="grid grid-cols-2 gap-space-sm font-label-sm text-label-sm">
          <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col border border-surface-variant/20">
            <span className="text-outline text-caption">فتح البوابة والاستقبال</span>
            <span className="font-bold text-on-surface font-mono">07:00 ص</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col border border-surface-variant/20">
            <span className="text-outline text-caption">طابور الصباح والتمارين</span>
            <span className="font-bold text-on-surface font-mono">07:30 ص</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col border border-surface-variant/20">
            <span className="text-outline text-caption">انتهاء الحصص التعليمية</span>
            <span className="font-bold text-on-surface font-mono">12:30 م</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-lg flex flex-col border border-surface-variant/20">
            <span className="text-outline text-caption">الحد الأقصى للاستلام</span>
            <span className="font-bold text-primary font-mono">01:30 م</span>
          </div>
        </div>
      </div>

      {/* Shift 2: Aftercare */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">nightlife</span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              رعاية ما بعد الدوام (الحضانة المسائية)
            </span>
          </div>
          <span className="font-mono text-label-sm text-on-surface-variant font-bold">
            01:30 م - 04:30 م
          </span>
        </div>
        <span className="font-caption text-caption text-outline">
          تشمل وجبة خفيفة ومسار أنشطة حركية للأطفال المشتركين
        </span>
      </div>

      {/* Automation Switches */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-bold text-on-surface">
              تحديد حالة التأخر التلقائي
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              تسجيل متأخر في سجل الحضور بعد {settings.autoTardinessThreshold}
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.autoTardinessEnabled}
            onChange={(e) => onChange({ autoTardinessEnabled: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary-container"
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-bold text-on-surface">
              تنبيه بوابة الاستلام الآمن
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              صوت تحذيري عند مغادرة طفل بدون تمرير بطاقة ولي الأمر
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.gateSecurityAlert}
            onChange={(e) => onChange({ gateSecurityAlert: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary-container"
          />
        </div>
      </div>
    </div>
  )
}
