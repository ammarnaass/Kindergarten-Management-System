import { DatabaseSettings } from '../types'

interface UsbAutoBackupCardProps {
  settings: DatabaseSettings
  onChange: (fields: Partial<DatabaseSettings>) => void
  onBackupNow: () => void
  onChooseBackupPath?: () => void
}

export function UsbAutoBackupCard({
  settings,
  onChange,
  onBackupNow,
  onChooseBackupPath
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
                placeholder="اضغط لاختيار مجلد أو فلاشة USB..."
                value={settings.externalBackupPath}
                onChange={(e) => onChange({ externalBackupPath: e.target.value })}
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono text-body-sm focus:outline-none border border-surface-variant/30"
              />
              {onChooseBackupPath && (
                <button
                  type="button"
                  onClick={onChooseBackupPath}
                  className="px-3 py-2 bg-surface-container hover:bg-surface-variant rounded-xl text-primary font-label-sm text-label-sm font-bold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  <span>تغيير المسار</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                جدولة النسخ الدوري
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => onChange({ backupFrequency: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-variant/30"
              >
                <option value="نسخة عند نهاية الدوام (16:30)">نسخة عند نهاية الدوام (16:30)</option>
                <option value="نسخة صباحية ومسائية (08:00 و 14:00)">نسخة صباحية ومسائية (08:00 و 14:00)</option>
                <option value="نسخة كل ساعة خلال ساعات العمل">نسخة كل ساعة خلال ساعات العمل</option>
                <option value="يدوي فقط">يدوي فقط عند الطلب</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                سياسة الاحتفاظ بالنسخ
              </label>
              <select
                value={settings.backupRetention}
                onChange={(e) => onChange({ backupRetention: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-variant/30"
              >
                <option value="آخر 30 نسخة يومية (يوصى به)">آخر 30 نسخة يومية (يوصى به)</option>
                <option value="آخر 60 نسخة يومية">آخر 60 نسخة يومية</option>
                <option value="الاحتفاظ بجميع النسخ دون حذف">الاحتفاظ بجميع النسخ دون حذف</option>
              </select>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSyncUsb}
                onChange={(e) => onChange({ autoSyncUsb: e.target.checked })}
                className="w-4 h-4 rounded text-secondary focus:ring-secondary-container bg-surface-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                النسخ التلقائي فور إدخال وحدة تخزين USB مصرحة (Auto Sync on Plug)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <button
          type="button"
          onClick={onBackupNow}
          className="flex items-center gap-1.5 px-space-md py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-secondary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          <span>إنشاء نسخة احتياطية الآن</span>
        </button>
        <span className="font-caption text-caption text-outline">
          {settings.externalBackupPath ? 'مسار مخصص جاهز' : 'المسار الافتراضي للنسخ'}
        </span>
      </div>
    </div>
  )
}
