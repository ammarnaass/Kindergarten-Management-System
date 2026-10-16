import { BranchSettings } from '../types'

interface BranchLogoCardProps {
  settings: BranchSettings
  onChange: (fields: Partial<BranchSettings>) => void
}

export function BranchLogoCard({ settings, onChange }: BranchLogoCardProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-space-md">
      {/* Visual Identity & Logo */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col items-center text-center border border-surface-variant/40">
        <span className="self-start font-label-md text-label-md font-bold text-on-surface mb-2">
          الهوية البصرية والشعار المعتمد
        </span>
        <div className="relative group my-space-md w-36 h-36 rounded-2xl bg-surface-container-low p-2 flex items-center justify-center overflow-hidden shadow-inner border border-surface-variant/30">
          <img
            src={settings.logoUrl}
            alt="شعار الروضة المعتمد"
            className="w-full h-full object-contain rounded-xl"
          />
          <div className="absolute inset-0 bg-inverse-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-surface text-[24px]">
              photo_camera
            </span>
            <span className="text-surface font-label-sm text-label-sm font-semibold">
              تغيير الشعار
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-on-surface-variant mb-space-md">
          <span className="font-label-md text-label-md font-bold text-on-surface">
            شعار_الروضة_الرسمي_2026.png
          </span>
          <span className="font-caption text-caption text-outline">
            PNG شفاف • 512x512 بكسل (180 KB)
          </span>
        </div>

        <div className="flex gap-2 w-full">
          <button
            type="button"
            className="flex-1 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>رفع صورة جديدة</span>
          </button>
          <button
            type="button"
            title="حذف الشعار"
            className="p-2 rounded-xl bg-surface-container text-error hover:bg-error-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>

        <div className="w-full mt-space-md pt-space-md border-t border-surface-variant flex flex-col gap-2.5 text-right">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.printLogoOnReceipts}
              onChange={(e) => onChange({ printLogoOnReceipts: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface">
              طباعة الشعار على إيصالات سداد الرسوم (A4 / حراري)
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.printLogoOnCards}
              onChange={(e) => onChange({ printLogoOnCards: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface">
              تضمين الشعار في بطاقات استلام الأطفال الذكية (RFID/QR)
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.printLogoOnDailyReport}
              onChange={(e) => onChange({ printLogoOnDailyReport: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface">
              اعتماد الشعار في التقرير اليومي الصادر لأولياء الأمور
            </span>
          </label>
        </div>
      </div>

      {/* Quick Branch Stats Snapshot Card */}
      <div className="bg-surface-container-low rounded-2xl p-space-md flex items-center justify-between shadow-xs border border-surface-variant/40">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              ترخيص وزارة التعليم
            </div>
            <div className="font-caption text-caption text-on-surface-variant">
              سارٍ حتى: 1448/04/15هـ
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold shadow-xs">
          نشط معتمد
        </span>
      </div>
    </div>
  )
}
