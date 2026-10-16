interface StudentSelectorStepProps {
  childName: string
  classroom: string
  guardianName: string
  guardianPhone: string
  dueBalance?: string
  onSelectChildModal: () => void
}

export function StudentSelectorStep({
  childName,
  classroom,
  guardianName,
  guardianPhone,
  dueBalance = '20,000 دج',
  onSelectChildModal
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
          <span>تغيير الطفل (F2)</span>
        </button>
      </div>

      {/* Active Selection Summary Box */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-xl shadow-xs">
            {childName[0] || 'س'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {childName}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-caption text-caption font-semibold">
                {classroom}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">family_restroom</span>
                {guardianName} (أب)
              </span>
              <span className="flex items-center gap-1 font-mono text-caption">
                <span className="material-symbols-outlined text-xs">call</span>
                {guardianPhone}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-highest/80 px-3 py-2 rounded-lg text-left w-full sm:w-auto">
          <span className="font-caption text-caption text-on-surface-variant block">
            الرصيد المستحق غير المسدد
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-error font-mono">
            {dueBalance}
          </span>
        </div>
      </div>
    </div>
  )
}
