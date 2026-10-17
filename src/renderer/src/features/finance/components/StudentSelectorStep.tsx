interface StudentSelectorStepProps {
  childName?: string
  classroom?: string
  guardianName?: string
  guardianPhone?: string
  dueBalance?: string
  onSelectChildModal: () => void
}

export function StudentSelectorStep({
  childName,
  classroom,
  guardianName,
  guardianPhone,
  dueBalance = '0 دج',
  onSelectChildModal,
}: StudentSelectorStepProps) {
  return (
    <div className="flex flex-col gap-space-xs select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-caption flex items-center justify-center font-bold">
            1
          </span>
          <span className="font-label-lg text-label-lg font-bold text-on-surface">
            اختيار الطفل وولي الأمر
          </span>
        </div>
        <button
          onClick={onSelectChildModal}
          className="text-primary hover:text-primary-container font-caption text-caption font-semibold flex items-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">person_search</span>
          <span>{childName ? 'تغيير الطفل (F2)' : 'اختيار الطفل (F2)'}</span>
        </button>
      </div>

      {!childName ? (
        <div
          onClick={onSelectChildModal}
          className="bg-surface-container-low hover:bg-surface-container rounded-xl p-space-lg flex items-center justify-between cursor-pointer border-2 border-dashed border-outline-variant/60 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">person_search</span>
            </div>
            <div>
              <span className="font-headline-sm font-bold text-on-surface block">
                اضغط هنا لاختيار الطفل المعني بالسداد
              </span>
              <span className="text-on-surface-variant font-caption block mt-0.5">
                يمكنك الضغط على F2 للبحث الفوري بالاسم أو اللقب
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelectChildModal()
            }}
            className="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-label-md font-semibold text-sm shadow-xs hover:opacity-90"
            type="button"
          >
            اختيار الطفل (F2)
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-xl shadow-xs">
              {childName[0] || 'ط'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {childName}
                </span>
                {classroom && (
                  <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-caption text-caption font-semibold">
                    {classroom}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-on-surface-variant font-body-sm text-body-sm flex-wrap">
                {guardianName && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">family_restroom</span>
                    <span>{guardianName}</span>
                  </span>
                )}
                {guardianPhone && (
                  <span className="flex items-center gap-1 font-mono text-caption">
                    <span className="material-symbols-outlined text-xs">call</span>
                    <span>{guardianPhone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-highest/80 px-3 py-2 rounded-lg text-left w-full sm:w-auto">
            <span className="font-caption text-caption text-on-surface-variant block">
              إجمالي الرصيد المعلق
            </span>
            <span className="font-headline-sm text-headline-sm font-bold text-error font-mono">
              {dueBalance}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
