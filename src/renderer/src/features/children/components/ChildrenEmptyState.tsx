interface ChildrenEmptyStateProps {
  isFiltered: boolean
  onNewChild: () => void
  onClearFilter?: () => void
}

export function ChildrenEmptyState({
  isFiltered,
  onNewChild,
  onClearFilter
}: ChildrenEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/60 shadow-xs text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center mb-space-md shadow-xs ring-4 ring-primary-fixed/20">
        <span className="material-symbols-outlined text-3xl">
          {isFiltered ? 'person_search' : 'escalator_warning'}
        </span>
      </div>

      <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
        {isFiltered ? 'لم يتم العثور على أطفال يطابقون معايير البحث' : 'سجل الأطفال فارغ حالياً'}
      </h3>

      <p className="font-body-md text-body-md text-on-surface-variant max-w-md leading-relaxed mb-space-lg">
        {isFiltered
          ? 'جرب البحث بكلمات أخرى أو اختر "جميع الفصول" لإظهار القائمة الكاملة للأطفال.'
          : 'التطبيق جاهز للعمل الفعلي دون إنترنت. قم بتسجيل الطفل الأول للبدء في إدارة الفصول وتتبع الحضور والرسوم المالية.'}
      </p>

      <div className="flex items-center gap-space-sm">
        {isFiltered && onClearFilter && (
          <button
            onClick={onClearFilter}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
            type="button"
          >
            إلغاء التصفية
          </button>
        )}

        <button
          onClick={onNewChild}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-all shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>تسجيل طفل جديد</span>
          <kbd className="font-mono text-caption px-1.5 py-0.5 rounded bg-primary-container/40 text-on-primary">
            Ctrl+N
          </kbd>
        </button>
      </div>
    </div>
  )
}
