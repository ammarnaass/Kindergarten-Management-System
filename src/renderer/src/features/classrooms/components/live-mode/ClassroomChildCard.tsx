import React from 'react'
import type { ClassroomStudent, AttendanceStatus } from '../../types'

interface ClassroomChildCardProps {
  student: ClassroomStudent
  onMarkAttendance: (childId: string, status: AttendanceStatus) => void
  onOpenQuickAction: (student: ClassroomStudent) => void
}

export const ClassroomChildCard: React.FC<ClassroomChildCardProps> = ({
  student,
  onMarkAttendance,
  onOpenQuickAction
}) => {
  const isPresent = student.attendanceStatus === 'present'
  const isAbsent = student.attendanceStatus === 'absent' || student.attendanceStatus === 'excused'
  const isLate = student.attendanceStatus === 'late'

  const hasAllergies = !!student.allergies?.trim()
  const hasMedical = !!student.medicalNotes?.trim()

  return (
    <div
      className={`relative rounded-2xl p-4 shadow-2xs border transition-all flex flex-col justify-between min-h-[190px] ${
        isPresent
          ? 'bg-surface-container-lowest border-emerald-500/30'
          : isAbsent
          ? 'bg-error-container/20 border-error/30'
          : isLate
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-surface-container-lowest border-outline-variant/30'
      }`}
    >
      <div>
        {/* Child Header Info */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3">
            {/* Avatar with Status Dot */}
            <div className="relative">
              {student.photoPath ? (
                <img
                  src={student.photoPath}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-outline-variant/30 shadow-2xs"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg ring-2 ring-primary/20 shadow-2xs">
                  {student.firstName[0]}
                </div>
              )}
              {/* Dot */}
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-xs ${
                  isPresent
                    ? 'bg-emerald-500'
                    : isAbsent
                    ? 'bg-error'
                    : isLate
                    ? 'bg-amber-500'
                    : 'bg-outline'
                }`}
              >
                {isPresent ? '✓' : isAbsent ? '✕' : isLate ? '⏳' : '?'}
              </span>
            </div>

            {/* Name & Time */}
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface line-clamp-1">
                {student.firstName} {student.lastName}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                {student.arrivalTime ? (
                  <span className="font-caption text-caption text-on-surface-variant flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                    <span>{student.arrivalTime}</span>
                  </span>
                ) : (
                  <span className="font-caption text-caption text-outline">لم يسجل وقت</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            type="button"
            onClick={() => onOpenQuickAction(student)}
            className="p-1.5 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors"
            title="تسجيل نشاط يومي (وجبة / نوم / حمام / نجمة سلوك)"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
          </button>
        </div>

        {/* Health & Allergy Alerts */}
        {(hasAllergies || hasMedical) && (
          <div className="mt-2.5 flex items-center flex-wrap gap-1">
            {hasAllergies && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-error text-white font-caption text-caption font-bold shadow-2xs"
                title={student.allergies || undefined}
              >
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span className="line-clamp-1">حساسية: {student.allergies}</span>
              </span>
            )}
            {hasMedical && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200 font-caption text-caption font-semibold"
                title={student.medicalNotes || undefined}
              >
                <span className="material-symbols-outlined text-[13px]">medical_services</span>
                <span className="line-clamp-1">{student.medicalNotes}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tactile 3-State Touch Keypad */}
      <div className="mt-3.5 pt-2.5 border-t border-surface-container-high/60">
        <div className="grid grid-cols-3 gap-1.5 bg-surface-container-low p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onMarkAttendance(student.id, 'present')}
            className={`py-2 rounded-lg font-label-md text-label-md font-bold text-center transition-all active:scale-95 ${
              isPresent
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
            }`}
          >
            حاضر
          </button>
          <button
            type="button"
            onClick={() => onMarkAttendance(student.id, 'late')}
            className={`py-2 rounded-lg font-label-md text-label-md font-bold text-center transition-all active:scale-95 ${
              isLate
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
            }`}
          >
            متأخر
          </button>
          <button
            type="button"
            onClick={() => onMarkAttendance(student.id, 'absent')}
            className={`py-2 rounded-lg font-label-md text-label-md font-bold text-center transition-all active:scale-95 ${
              isAbsent
                ? 'bg-error text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
            }`}
          >
            غائب
          </button>
        </div>
      </div>
    </div>
  )
}
