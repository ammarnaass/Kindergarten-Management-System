import React from 'react'
import { ClassroomChildCard } from './ClassroomChildCard'
import type { ClassroomStudent, AttendanceStatus } from '../../types'

interface ClassroomChildrenGridProps {
  students: ClassroomStudent[]
  isLoading: boolean
  onMarkAttendance: (childId: string, status: AttendanceStatus) => void
  onOpenQuickAction: (student: ClassroomStudent) => void
}

export const ClassroomChildrenGrid: React.FC<ClassroomChildrenGridProps> = ({
  students,
  isLoading,
  onMarkAttendance,
  onOpenQuickAction
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-surface-container-low animate-pulse border border-outline-variant/20"
          />
        ))}
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center my-4">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-outline mb-3">
          <span className="material-symbols-outlined text-3xl">sentiment_neutral</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          لا يوجد أطفال يطابقون خيارات البحث أو التصفية
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-sm">
          تأكدي من صحة اسم الطفل المبحوث عنه أو اختاري تبويب "الكل" لعرض جميع طلاب هذا الفصل.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-3">
      {students.map((student) => (
        <ClassroomChildCard
          key={student.id}
          student={student}
          onMarkAttendance={onMarkAttendance}
          onOpenQuickAction={onOpenQuickAction}
        />
      ))}
    </div>
  )
}
