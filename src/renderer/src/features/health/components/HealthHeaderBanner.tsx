import React from 'react'

interface HealthHeaderBannerProps {
  todayStr: string
  onOpenClinicModal: () => void
  onOpenIncidentModal: () => void
  onOpenMedicationModal: () => void
  onPrint: () => void
}

export const HealthHeaderBanner: React.FC<HealthHeaderBannerProps> = ({
  todayStr,
  onOpenClinicModal,
  onOpenIncidentModal,
  onOpenMedicationModal,
  onPrint
}) => {
  return (
    <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-outline-variant/60">
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-xs">
            <span className="material-symbols-outlined text-[28px]">medical_services</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                الصحة والسلامة المدرسية والعيادة
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-bold">
                سجلات صحية مشفرة محلياً 100%
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
              <span className="flex items-center gap-1 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                <span>{todayStr}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">stethoscope</span>
                <span>المناوبة الصحية: <strong>ممرضة الروضة المعتمدة</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons with Shortcut Badges */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenClinicModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>تسجيل مراجعة عيادة</span>
            <kbd className="px-1.5 py-0.5 rounded bg-on-primary/20 text-on-primary font-caption text-caption font-mono">
              F2
            </kbd>
          </button>

          <button
            type="button"
            onClick={onOpenIncidentModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">emergency</span>
            <span>تسجيل حادث / واقعة</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-caption text-caption font-mono">
              F6
            </kbd>
          </button>

          <button
            type="button"
            onClick={onOpenMedicationModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">medication</span>
            <span>جدول الأدوية</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-caption text-caption font-mono">
              F3
            </kbd>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold shadow-2xs transition-all"
            title="طباعة التقرير الشامل"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>طباعة</span>
            <kbd className="px-1 py-0.5 rounded bg-surface-container-lowest text-2xs font-mono">
              Ctrl+P
            </kbd>
          </button>
        </div>
      </div>
    </section>
  )
}
