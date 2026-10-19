import React from 'react'

interface ClassroomOverviewEmptyStateProps {
  onAddClassroom: () => void
}

export const ClassroomOverviewEmptyState: React.FC<ClassroomOverviewEmptyStateProps> = ({
  onAddClassroom
}) => {
  return (
    <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-3xl">meeting_room</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
        لا توجد فصول دراسية مضافة حتى الآن
      </h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm mx-auto">
        تم تطهير البيانات الوهمية بنجاح. ابدئي بإضافة فصول الروضة وتحديد سعتها الاستيعابية لتمكين المعلمات من تسجيل الحضور والأنشطة.
      </p>
      <button
        type="button"
        onClick={onAddClassroom}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-xs hover:bg-primary-container"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        <span>إضافة أول فصل الآن</span>
      </button>
    </div>
  )
}
