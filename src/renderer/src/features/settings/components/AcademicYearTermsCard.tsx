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
  const terms = [
    { id: 'الفصل الدراسي الأول', label: 'الفصل الدراسي الأول', season: 'فصل الخريف والتهيئة' },
    { id: 'الفصل الدراسي الثاني', label: 'الفصل الدراسي الثاني', season: 'فصل الشتاء والأنشطة' },
    { id: 'الفصل الدراسي الثالث', label: 'الفصل الدراسي الثالث', season: 'فصل الربيع والتخرج' }
  ]

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            السنة الدراسية والتقويم النشط
          </h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          نشطة محلياً
        </span>
      </div>

      {/* Current Year Configuration Box */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">السنة المعتمدة بالتقارير</span>
          <span className="px-2 py-0.5 rounded bg-surface-container font-mono font-bold text-label-sm text-primary">
            AY-{settings.activeAcademicYear || '2026-2027'}
          </span>
        </div>
        <input
          type="text"
          value={settings.activeAcademicYear}
          onChange={(e) => onChange({ activeAcademicYear: e.target.value })}
          placeholder="مثال: 2026-2027"
          className="font-headline-md text-headline-md font-bold text-on-surface bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
            <span>قفل التعديل على السنوات المؤرشفة</span>
          </div>
          <input
            type="checkbox"
            checked={settings.preventArchivedEdits}
            onChange={(e) => onChange({ preventArchivedEdits: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary-container"
          />
        </div>
      </div>

      {/* Academic Terms Selection */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-label-sm text-label-sm font-bold text-on-surface">
            الفصل الدراسي الحالي (اختر الفصل النشط)
          </span>
          <span className="font-caption text-caption text-outline">نظام الفصول المعتمد</span>
        </div>

        <div className="flex flex-col gap-2">
          {terms.map((term) => {
            const isActive = settings.activeTerm === term.id
            return (
              <div
                key={term.id}
                onClick={() => onChange({ activeTerm: term.id })}
                className={`p-space-sm rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                  isActive
                    ? 'bg-primary/5 border-primary shadow-xs'
                    : 'bg-surface-container-low border-surface-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    {isActive ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={`font-label-md text-label-md font-semibold ${
                        isActive ? 'text-primary font-bold' : 'text-on-surface'
                      }`}
                    >
                      {term.label}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {term.season}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary text-on-primary">
                    الفصل النشط حالياً
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-space-xs">
        <button
          type="button"
          onClick={onRollForward}
          title="حفظ وترحيل الإعدادات للعام القادم"
          className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">save</span>
          <span>حفظ وتثبيت التقويم النشط</span>
        </button>
      </div>
    </div>
  )
}
