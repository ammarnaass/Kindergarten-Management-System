interface ChildProfileTopBarProps {
  childName: string
  onBack: () => void
}

export function ChildProfileTopBar({ childName, onBack }: ChildProfileTopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30 select-none">
      {/* Back to Children Roster Button */}
      <button
        onClick={onBack}
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-all shadow-2xs group"
      >
        <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform text-primary">
          arrow_forward
        </span>
        <span>العودة إلى سجل الأطفال</span>
      </button>

      {/* Breadcrumb Path */}
      <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-caption text-on-surface-variant font-medium">
        <span
          onClick={onBack}
          className="cursor-pointer hover:text-primary transition-colors hover:underline"
        >
          سجل الأطفال
        </span>
        <span className="text-outline">/</span>
        <span className="text-on-surface font-bold text-body-sm">{childName}</span>
      </nav>
    </div>
  )
}
