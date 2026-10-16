import { DatabaseSettings } from '../types'

interface UsbAutoBackupCardProps {
  settings: DatabaseSettings
  onChange: (fields: Partial<DatabaseSettings>) => void
  onBackupNow: () => void
}

export function UsbAutoBackupCard({
  settings,
  onChange,
  onBackupNow
}: UsbAutoBackupCardProps) {
  return (
    <div className="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">backup</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                النسخ الاحتياطي التلقائي للأقراص الخارجية
              </h3>
              <span className="font-caption text-caption text-outline">
                حماية بيانات الأطفال من عطل الأجهزة مع دعم فلاشة USB التلقائي
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-bold shadow-xs">
            مجدول
          </span>
        </div>

        <div className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              مسار وسيط الحفظ الاحتياطي الخارجي
            </label>
            <div className="flex items-center gap-2">
              <input
                dir="ltr"
                type="text"
                value={settings.externalBackupPath}
                onChange={(e) => onChange({ externalBackupPath: e.target.value })}
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono text-body-sm focus:outline-none border border-surface-variant/30"
              />
              <button
                type="button"
                className="px-3 py-2 bg-surface-container hover:bg-surface-variant rounded-xl text-on-surface font-label-sm text-label-sm font-semibold transition-colors"
              >
                تغيير المسار
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                تكرار النسخ اليومي
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => onChange({ backupFrequency: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-variant/30"
              >
                <option>نسخة عند نهاية الدوام (16:30)</option>
                <option>نسخة كل 4 ساعات تلقائياً</option>
                <option>نسخة يدوية فقط عند الطلب</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                الاحتفاظ بالنسخ السابقة
              </label>
              <select
                value={settings.backupRetention}
                onChange={(e) => onChange({ backupRetention: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-variant/30"
              >
                <option>آخر 30 نسخة يومية (يوصى به)</option>
                <option>آخر 60 نسخة يومية</option>
                <option>الاحتفاظ بكافة النسخ دون حذف</option>
              </select>
            </div>
          </div>

          <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-variant/30">
            <div className="flex items-center gap-space-xs text-on-surface">
              <span className="material-symbols-outlined text-primary text-[20px]">usb</span>
              <span className="font-label-md text-label-md font-semibold">
                المزامنة الفورية عند إدخال فلاش USB مرخص
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSyncUsb}
              onChange={(e) => onChange({ autoSyncUsb: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container"
            />
          </div>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <button
          type="button"
          onClick={onBackupNow}
          className="flex items-center gap-2 px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">save_alt</span>
          <span>إنشاء نسخة احتياطية فورية الآن</span>
        </button>
        <span className="font-caption text-caption text-outline">آخر نسخة: اليوم 13:45</span>
      </div>
    </div>
  )
}
