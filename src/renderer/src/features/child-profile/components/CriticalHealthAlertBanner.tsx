interface CriticalHealthAlertBannerProps {
  allergies?: string | null
  medicalNotes?: string | null
  onProtocolClick?: () => void
}

export function CriticalHealthAlertBanner({
  allergies,
  medicalNotes,
  onProtocolClick,
}: CriticalHealthAlertBannerProps) {
  if (!allergies && !medicalNotes) return null

  return (
    <section className="bg-error-container text-on-error-container rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md select-none">
      <div className="flex items-start gap-space-md">
        <div className="w-10 h-10 rounded-lg bg-error text-on-error flex items-center justify-center shrink-0 shadow-xs animate-pulse">
          <span className="material-symbols-outlined text-2xl">emergency</span>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-space-sm flex-wrap">
            <h2 className="font-headline-sm text-headline-sm text-error font-bold">
              تنبيه صحي معتمد: {allergies || 'ملاحظة صحية خاصة'}
            </h2>
            <span className="font-caption text-caption px-2 py-0.5 rounded bg-error text-on-error font-bold tracking-wider">
              تنبيه طبي
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-error-container leading-relaxed">
            {medicalNotes || `يتطلب متابعة دقيقة من المعلمة وإدارة الروضة عند تقديم الوجبات والأنشطة — مسجل في الملف الصحي الرسمي للطفل.`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
        {onProtocolClick && (
          <button
            onClick={onProtocolClick}
            className="px-3 py-1.5 rounded-lg bg-error text-on-error font-label-sm text-label-sm font-semibold hover:bg-on-error-container transition-colors shadow-xs flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">medical_services</span>
            <span>بروتوكول الطوارئ</span>
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="p-1.5 rounded-lg bg-surface-container-lowest/80 text-error hover:bg-surface-container-lowest transition-colors"
          title="طباعة التنبيه الصحي"
          type="button"
        >
          <span className="material-symbols-outlined text-base">print</span>
        </button>
      </div>
    </section>
  )
}
