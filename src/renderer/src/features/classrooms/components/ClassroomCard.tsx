import React from 'react'
import type { ClassroomItem } from '../types'

interface ClassroomCardProps {
  classroom: ClassroomItem
  onEnterLiveMode: (classroomId: string) => void
  onEdit: (classroom: ClassroomItem) => void
  onDelete: (classroom: ClassroomItem) => void
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onEnterLiveMode,
  onEdit,
  onDelete
}) => {
  const percent = classroom.progressPercent || 0
  const isHighAttendance = percent >= 85

  return (
    <div className="group bg-surface-container-lowest rounded-2xl p-5 shadow-2xs hover:shadow-md border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-caption text-caption text-primary font-bold px-2 py-0.5 rounded-md bg-primary/10">
                {classroom.room ? `قاعة ${classroom.room}` : 'قاعة تعليمية'}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1.5 group-hover:text-primary transition-colors">
              {classroom.name}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`font-mono text-body-sm font-bold px-2.5 py-1 rounded-lg ${
                isHighAttendance
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {percent}% حضور
            </span>
          </div>
        </div>

        {/* Teacher */}
        <div className="mt-3 text-[13px] text-on-surface-variant flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
          <span className="material-symbols-outlined text-[16px] text-primary">school</span>
          <span className="font-medium">المعلمة:</span>
          <span className="font-semibold text-on-surface">
            {classroom.teacher?.name || 'لم تعين معلمة بعد'}
          </span>
        </div>

        {/* Real-time stats row */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
          <div className="bg-surface-container-low/70 rounded-lg p-2">
            <div className="font-caption text-caption text-on-surface-variant">حاضر</div>
            <div className="font-mono font-bold text-headline-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
              {classroom.presentCount}
            </div>
          </div>
          <div className="bg-surface-container-low/70 rounded-lg p-2">
            <div className="font-caption text-caption text-on-surface-variant">متأخر</div>
            <div className="font-mono font-bold text-headline-sm text-amber-600 dark:text-amber-400 mt-0.5">
              {classroom.lateCount}
            </div>
          </div>
          <div className="bg-surface-container-low/70 rounded-lg p-2">
            <div className="font-caption text-caption text-on-surface-variant">غائب</div>
            <div className="font-mono font-bold text-headline-sm text-error mt-0.5">
              {classroom.absentCount}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-caption text-caption text-on-surface-variant mb-1">
            <span>نسبة الحضور</span>
            <span className="font-mono">{classroom.totalChildren} طفل مقيد</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighAttendance ? 'bg-primary' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-surface-container-high flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onEnterLiveMode(classroom.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-semibold transition-all active:scale-95 shadow-2xs"
        >
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          <span>وضع الفصل المباشر</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(classroom)}
            title="تعديل بيانات الفصل"
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(classroom)}
            title="حذف الفصل"
            className="p-2 rounded-xl text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
