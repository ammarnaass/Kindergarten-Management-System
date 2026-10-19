import React from 'react'

interface ClassroomLiveEmptyStateProps {
  onAddClassroom: () => void
  onExitLiveMode: () => void
}

export const ClassroomLiveEmptyState: React.FC<ClassroomLiveEmptyStateProps> = ({
  onAddClassroom,
  onExitLiveMode
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-4xl">meeting_room</span>
      </div>
      <h2 className="text-xl font-bold text-on-surface mb-2">لا توجد فصول دراسية حالياً</h2>
      <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
        تم تفريغ الفصول التجريبية بنجاح. يرجى إضافة فصل دراسي حقيقي لبدء رصد الحضور والأنشطة في وضع الفصل المباشر.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onAddClassroom}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>إضافة فصل جديد الآن</span>
        </button>
        <button
          onClick={onExitLiveMode}
          className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
          type="button"
        >
          العودة لإدارة الفصول
        </button>
      </div>
    </div>
  )
}
