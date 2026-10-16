interface BackupRulesCardProps {
  autoClose: boolean
  periodic: boolean
  encrypt: boolean
  retentionCount: number
  onAutoCloseChange: (val: boolean) => void
  onPeriodicChange: (val: boolean) => void
  onEncryptChange: (val: boolean) => void
  onRetentionCountChange: (val: number) => void
}

export function BackupRulesCard({
  autoClose,
  periodic,
  encrypt,
  retentionCount,
  onAutoCloseChange,
  onPeriodicChange,
  onEncryptChange,
  onRetentionCountChange
}: BackupRulesCardProps) {
  return (
    <div className="pt-space-sm space-y-space-sm">
      <span className="font-label-md text-label-md font-bold text-on-surface block">
        قواعد النسخ الآلي والمجدول:
      </span>

      <label className="flex items-start gap-space-sm p-space-sm rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
        <input
          checked={autoClose}
          onChange={(e) => onAutoCloseChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
          type="checkbox"
        />
        <div>
          <span className="font-label-lg text-label-lg font-semibold text-on-surface block">
            أخذ نسخة احتياطية تلقائياً عند إغلاق التطبيق
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            يقوم النظام بحفظ التغييرات اليومية بصمت قبل إغلاق نافذة سطح المكتب مع تحديث سجل الأرشيف.
          </span>
        </div>
      </label>

      <label className="flex items-start gap-space-sm p-space-sm rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
        <input
          checked={periodic}
          onChange={(e) => onPeriodicChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
          type="checkbox"
        />
        <div>
          <span className="font-label-lg text-label-lg font-semibold text-on-surface block">
            نسخ دوري كل 4 ساعات أثناء ساعات العمل
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            مفيد في فترات تسجيل الطلاب وأيام تحصيل الأقساط لحماية العمليات المالية المباشرة.
          </span>
        </div>
      </label>

      <label className="flex items-start gap-space-sm p-space-sm rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
        <input
          checked={encrypt}
          onChange={(e) => onEncryptChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
          type="checkbox"
        />
        <div>
          <span className="font-label-lg text-label-lg font-semibold text-on-surface flex items-center gap-1.5">
            <span>تشفير النسخ الاحتياطية بمفتاح محلي (AES-256)</span>
            <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold px-1.5 py-0.2 rounded font-mono">
              موصى به
            </span>
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            حماية بيانات الأطفال وعناوين أولياء الأمور من الفتح غير المصرح به عند نسخ الملفات خارج النظام.
          </span>
        </div>
      </label>

      {/* Retention Policy Setting */}
      <div className="pt-space-sm flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low/60 border border-outline-variant/30">
        <div>
          <span className="font-label-md text-label-md font-bold text-on-surface block">
            سياسة استبقاء النسخ السابقة:
          </span>
          <span className="font-caption text-caption text-on-surface-variant">
            حذف النسخ القديمة تلقائياً لتوفير مساحة القرص عند تجاوز الحد.
          </span>
        </div>
        <select
          value={retentionCount}
          onChange={(e) => onRetentionCountChange(Number(e.target.value))}
          className="h-8 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold border border-outline-variant/30 focus:outline-none"
        >
          <option value={15}>الاحتفاظ بآخر 15 نسخة</option>
          <option value={30}>الاحتفاظ بآخر 30 نسخة (الافتراضي)</option>
          <option value={60}>الاحتفاظ بآخر 60 نسخة</option>
          <option value={90}>الاحتفاظ بآخر 90 نسخة</option>
        </select>
      </div>
    </div>
  )
}
