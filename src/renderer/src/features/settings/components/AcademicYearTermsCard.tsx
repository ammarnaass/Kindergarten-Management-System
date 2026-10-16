import { AppearanceSettings } from '../types'

interface AcademicYearTermsCardProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
  onRollForward: () => void
}

export function AcademicYearTermsCard({
  settings,
  onChange,
  onRollForward
}: AcademicYearTermsCardProps) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            السنة الدراسية الحالية والتقويم النشط
          </h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          نشطة محلياً
        </span>
      </div>

      {/* Current Year Showcase Box */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">السنة المعتمدة بالتقارير</span>
          <span className="px-2 py-0.5 rounded bg-surface-container font-mono font-bold text-label-sm text-primary">
            AY-1445-1446-SA
          </span>
        </div>
        <div className="font-headline-md text-headline-md font-bold text-on-surface">
          {settings.activeAcademicYear}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
            <span>قفل التعديل لمنع تداخل السجلات</span>
          </div>
          <input
            type="checkbox"
            checked={settings.preventArchivedEdits}
            onChange={(e) => onChange({ preventArchivedEdits: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary-container"
          />
        </div>
      </div>

      {/* Academic Terms Breakdown */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-label-sm text-label-sm font-bold text-on-surface">
            الفصول الدراسية وتتبع الأسابيع
          </span>
          <span className="font-caption text-caption text-outline">نظام الثلاثة فصول</span>
        </div>

        {/* Term 1 (Finished) */}
        <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-variant/20">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                الفصل الدراسي الأول
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-variant text-on-surface-variant">
                منتهي ومؤرشف
              </span>
            </div>
            <span className="font-caption text-caption text-outline">
              13 أسبوعاً • 20 أوت - 16 نوفمبر 2024
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[20px]">task_alt</span>
        </div>

        {/* Term 2 (Active) */}
        <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-2 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                الفصل الدراسي الثاني
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                نشط حالياً (الأسبوع 8)
              </span>
            </div>
            <span className="font-mono text-label-sm text-label-sm font-bold text-primary">62%</span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: '62%' }} />
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-caption text-caption">
            <span>البداية: 26 نوفمبر 2024</span>
            <span>الامتحانات: 18 فبراير 2025</span>
          </div>
        </div>

        {/* Term 3 (Upcoming) */}
        <div className="p-space-sm rounded-lg bg-surface-container-low opacity-80 flex items-center justify-between border border-surface-variant/20">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md font-medium text-on-surface">
                الفصل الدراسي الثالث
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">
                قادم
              </span>
            </div>
            <span className="font-caption text-caption text-outline">
              13 أسبوعاً • 02 مارس - 29 مايو 2025
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[20px]">pending</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-space-xs">
        <button
          type="button"
          className="flex-1 py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">edit_calendar</span>
          <span>إدارة التقويم والإجازات</span>
        </button>
        <button
          type="button"
          onClick={onRollForward}
          title="ترحيل الطلاب للسنة القادمة"
          className="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">move_up</span>
          <span>ترحيل</span>
        </button>
      </div>
    </div>
  )
}
