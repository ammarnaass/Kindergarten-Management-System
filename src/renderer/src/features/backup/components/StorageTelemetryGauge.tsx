interface StorageTelemetryGaugeProps {
  backupCount?: number
}

export function StorageTelemetryGauge({ backupCount = 18 }: StorageTelemetryGaugeProps) {
  return (
    <div className="flex flex-col gap-space-md select-none">
      {/* Drive Storage Gauge */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">hard_drive</span>
              <span>حالة القرص المحلي (D:)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-caption text-caption font-semibold">
              مساحة ممتازة
            </span>
          </div>
          <div className="my-space-md">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                142.5 GB
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                متبقي من إجمالي 256 GB
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: '44%' }}
                title="المستخدم الكلي 44%"
              />
            </div>
            <div className="flex justify-between font-caption text-caption text-outline mt-1.5">
              <span>مجلد روضتي: 384 MB (0.1%)</span>
              <span>متاح: 56%</span>
            </div>
          </div>
        </div>

        <div className="p-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm space-y-1 text-on-surface-variant">
          <div className="flex justify-between">
            <span>عدد النسخ المحفوظة حالياً:</span>
            <span className="font-mono font-bold text-on-surface">{backupCount} نسخة</span>
          </div>
          <div className="flex justify-between">
            <span>معدل نمو البيانات الشهري:</span>
            <span className="font-mono font-bold text-emerald-700">~ 18 MB / شهر</span>
          </div>
        </div>
      </div>

      {/* Quick Snapshot Security Card */}
      <div className="bg-surface-container-low rounded-xl p-space-md shadow-xs">
        <div className="flex items-center gap-space-sm mb-2">
          <span className="material-symbols-outlined text-secondary text-base">lightbulb</span>
          <span className="font-label-md text-label-md font-bold text-on-surface">
            نصيحة الأمان الأسبوعية
          </span>
        </div>
        <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
          يوصى بتصدير نسخة أسبوعية واحدة كل يوم خميس إلى محرك أقراص محمول (Flash Memory) وحفظه خارج مبنى الروضة لحماية سجلات الرسوم وقوائم الاتصال في حالات الطوارئ القصوى.
        </p>
      </div>
    </div>
  )
}
