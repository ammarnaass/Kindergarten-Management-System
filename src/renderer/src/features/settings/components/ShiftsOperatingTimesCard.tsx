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

      {/* Threshold Setting */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              توقيت احتساب التأخر الصباحي
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-primary">
            تلقائي
          </span>
        </div>
        <p className="font-caption text-caption text-on-surface-variant">
          يتم تسجيل الطفل كـ (متأخر) تلقائياً في سجل الحضور اليومي إذا تجاوز وقت الحضور هذا الحد:
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={settings.autoTardinessThreshold}
            onChange={(e) => onChange({ autoTardinessThreshold: e.target.value })}
            placeholder="مثال: 08:15 ص"
            className="px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-variant/30 font-mono text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="font-caption text-caption text-outline">
            تنسيق الوقت المعتمد لبوابة الاستقبال
          </span>
        </div>
      </div>

      {/* Automation Switches */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-bold text-on-surface">
              تحديد حالة التأخر التلقائي
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              تسجيل متأخر في سجل الحضور فوراً بعد حلول الوقت المحدد
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
              تنبيه صوتي وبصري عند محاولة تسليم طفل بدون تمرير بطاقة مصرح بها
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
