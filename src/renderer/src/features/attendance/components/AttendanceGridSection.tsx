import React from 'react'
import { StudentAttendanceCard } from './StudentAttendanceCard'
import type { StudentAttendanceItem, ClassroomItem, AttendanceStatus } from '../types'

interface AttendanceGridSectionProps {
  isLoading: boolean
  classrooms: ClassroomItem[]
  activeClassroom?: ClassroomItem
  students: StudentAttendanceItem[]
  onStatusChange: (id: string, status: AttendanceStatus) => void
  onNavigateSettings: () => void
  onNavigateChildren: () => void
}

export const AttendanceGridSection: React.FC<AttendanceGridSectionProps> = ({
  isLoading,
  classrooms,
  activeClassroom,
  students,
  onStatusChange,
  onNavigateSettings,
  onNavigateChildren,
}) => {
  if (isLoading) {
    return (
      <div className="p-16 text-center bg-surface-container-low rounded-2xl">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">
          sync
        </span>
        <p className="text-on-surface font-semibold text-base">جاري تحميل سجل الأطفال وقائمة الحضور...</p>
      </div>
    )
  }

  if (classrooms.length === 0) {
    return (
      <div className="p-16 text-center bg-surface-container-low rounded-2xl">
        <span className="material-symbols-outlined text-5xl text-outline mb-3">meeting_room</span>
        <h2 className="text-on-surface font-headline-sm font-bold text-lg mb-1">
          لا توجد فصول دراسية مضافة
        </h2>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-4">
          لبدء تسجيل حضور الأطفال، يرجى إضافة الفصول الدراسية أولاً من شاشة الإعدادات.
        </p>
        <button
          onClick={onNavigateSettings}
          className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:opacity-90 transition-opacity"
          type="button"
        >
          الذهاب للإعدادات
        </button>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="p-16 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
        <span className="material-symbols-outlined text-5xl text-outline mb-3">sentiment_dissatisfied</span>
        <h2 className="text-on-surface font-headline-sm font-bold text-lg mb-1">
          لا يوجد أطفال مسجلون في {activeClassroom?.name ?? 'هذا الفصل'}
        </h2>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-4">
          لم يتم تعيين أي أطفال نشطين لهذا الفصل بعد. يمكنك إضافة أطفال وتعيينهم لهذا الفصل بسهولة.
        </p>
        <button
          onClick={onNavigateChildren}
          className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:opacity-90 transition-opacity"
          type="button"
        >
          إضافة أطفال للفصل
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-space-md">
      {students.map((student) => (
        <StudentAttendanceCard
          key={student.id}
          student={student}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
