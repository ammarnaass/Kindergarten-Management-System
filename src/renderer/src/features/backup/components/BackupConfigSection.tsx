import { useState } from 'react'
import { StorageTelemetryGauge } from './StorageTelemetryGauge'
import { BackupRulesCard } from './BackupRulesCard'

interface BackupConfigSectionProps {
  backupPath?: string
  backupCount?: number
  onSaveConfig?: () => void
}

export function BackupConfigSection({
  backupPath = 'D:\\Rawdati_Backups\\',
  backupCount = 18,
  onSaveConfig
}: BackupConfigSectionProps) {
  const [path] = useState(backupPath)
  const [autoClose, setAutoClose] = useState(true)
  const [periodic, setPeriodic] = useState(true)
  const [retentionCount, setRetentionCount] = useState(30)
  const [encrypt, setEncrypt] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
    onSaveConfig?.()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-lg select-none">
      {/* Right Panel (8 cols): Backup Configuration Form */}
      <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs">
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg px-space-lg pt-space-lg rounded-t-xl">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl">folder_managed</span>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              إعدادات موقع التخزين والجدولة التلقائية
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-mono">
            preferences.json
          </span>
        </div>

        <div className="space-y-space-md">
          {/* Storage Directory Path Selector */}
          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1.5">
              مسار حفظ ملفات النسخ الاحتياطي على القرص المحلي:
            </label>
            <div className="flex items-center gap-space-xs">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-primary text-base">
                  folder
                </span>
                <input
                  className="w-full h-10 pr-9 pl-3 rounded-lg bg-surface-container-low text-on-surface font-mono text-body-sm font-semibold focus:outline-none"
                  readOnly
                  type="text"
                  value={path}
                />
              </div>
              <button
                className="h-10 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5"
                type="button"
                onClick={() => alert('يمكنك تحديد مسار المجلد عبر واجهة النظام')}
              >
                <span className="material-symbols-outlined text-base">drive_file_move</span>
                <span>تغيير المجلد...</span>
              </button>
            </div>
            <span className="block font-caption text-caption text-on-surface-variant mt-1">
              يُفضل استخدام قرص مختلف عن قرص نظام التشغيل C: لتفادي فقدان البيانات عند صيانة النظام.
            </span>
          </div>

          {/* Automated Rules & Retention */}
          <BackupRulesCard
            autoClose={autoClose}
            periodic={periodic}
            encrypt={encrypt}
            retentionCount={retentionCount}
            onAutoCloseChange={setAutoClose}
            onPeriodicChange={setPeriodic}
            onEncryptChange={setEncrypt}
            onRetentionCountChange={setRetentionCount}
          />

          {/* Save Action Bar */}
          <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/30">
            {savedSuccess ? (
              <span className="font-label-md text-label-md font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>تم حفظ تفضيلات النسخ الاحتياطي بنجاح!</span>
              </span>
            ) : (
              <span className="font-caption text-caption text-on-surface-variant">
                يتم تطبيق هذه الإعدادات فوراً على كافة عمليات النسخ المحلية.
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-space-lg py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold transition-colors flex items-center gap-2 shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Left Panel (4 cols): Disk Telemetry & Health Gauge */}
      <div className="lg:col-span-4">
        <StorageTelemetryGauge backupCount={backupCount} />
      </div>
    </div>
  )
}
