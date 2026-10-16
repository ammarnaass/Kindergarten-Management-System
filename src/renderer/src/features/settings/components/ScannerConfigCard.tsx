import { ScannerSettings } from '../types'

interface ScannerConfigCardProps {
  settings: ScannerSettings
  onChange: (fields: Partial<ScannerSettings>) => void
  onRescanPorts?: () => void
}

export function ScannerConfigCard({
  settings,
  onChange,
  onRescanPorts
}: ScannerConfigCardProps) {
  return (
    <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-variant">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              إعدادات بوابة الاستلام الآمن وقارئ الباركود والـ RFID
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              تكوين القارئ السلكي/اللاسلكي لمسح بطاقات أولياء الأمور وترددات بطاقات NFC
            </p>
          </div>
          <span className="material-symbols-outlined text-outline text-[24px]">qr_code_2</span>
        </div>

        <div className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                وضع تشغيل جهاز القراءة (Reader Input Mode)
              </label>
              {onRescanPorts && (
                <button
                  type="button"
                  onClick={onRescanPorts}
                  className="text-primary font-label-sm text-label-sm font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">autorenew</span>
                  <span>إعادة فحص المنافذ</span>
                </button>
              )}
            </div>

            <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-variant/30">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">keyboard</span>
                <div>
                  <div className="font-label-md text-label-md font-bold text-on-surface">
                    {settings.readerMode}
                  </div>
                  <div className="font-caption text-caption text-outline">
                    منفذان نشطان (USB HID) • تردد {settings.rfidFrequency}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold shadow-xs">
                جاهز ونشط
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                زمن إغلاق الشاشة بعد المسح (Auto-reset delay)
              </label>
              <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2 border border-surface-variant/30">
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={settings.autoResetDelay}
                  onChange={(e) => onChange({ autoResetDelay: Number(e.target.value) || 5 })}
                  className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none"
                />
                <span className="font-label-sm text-label-sm text-outline">ثوانٍ</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                رمز الأمان الاستثنائي (F4 Master PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.masterPin}
                  onChange={(e) => onChange({ masterPin: e.target.value })}
                  className="w-full pr-10 pl-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-transparent focus:border-primary/20"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  key
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.buzzerChime}
                onChange={(e) => onChange({ buzzerChime: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                إصدار صوت تنبيه (Buzzer Chime) عند قراءة بطاقة غير مصرح لها أو منتهية الصلاحية
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showMatchedPhotos}
                onChange={(e) => onChange({ showMatchedPhotos: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                إظهار صورة ولي الأمر المخول وصورة الطفل المتطابقة فوراً بملء الشاشة
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.supervisorFingerprint}
                onChange={(e) => onChange({ supervisorFingerprint: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
              />
              <span className="font-body-sm text-body-sm text-on-surface">
                طلب بصمة يد المشرفة للموافقة في حال اختلاف الشخص المستلم عن المصرح لهم
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <span className="font-caption text-caption text-on-surface-variant">
          متوافق مع معايير الأمان المحلية لوزارة التعليم 1446هـ
        </span>
        <button
          type="button"
          onClick={onRescanPorts}
          className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md font-semibold transition-colors"
        >
          فحص سرعة استجابة المنفذ
        </button>
      </div>
    </div>
  )
}
