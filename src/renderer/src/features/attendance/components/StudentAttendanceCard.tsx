export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unmarked'

export interface StudentAttendanceItem {
  id: string
  name: string
  photo?: string | null
  checkInTime?: string | null
  medicalAlert?: string | null
  status: AttendanceStatus
}

interface StudentAttendanceCardProps {
  student: StudentAttendanceItem
  onStatusChange: (id: string, status: AttendanceStatus) => void
}

export function StudentAttendanceCard({
  student,
  onStatusChange,
}: StudentAttendanceCardProps) {
  const isPresent = student.status === 'present'
  const isAbsent = student.status === 'absent'
  const isLate = student.status === 'late'
  const isExcused = student.status === 'excused'

  const getStatusSubtitle = () => {
    if (student.checkInTime) {
      return (
        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5 font-mono">
          <span className="material-symbols-outlined text-sm text-primary">schedule</span>
          <span>{student.checkInTime}</span>
        </span>
      )
    }
    if (isPresent) {
      return (
        <span className="font-caption text-caption text-emerald-700 font-semibold mt-0.5">
          حاضر اليوم
        </span>
      )
    }
    if (isLate) {
      return (
        <span className="font-caption text-caption text-amber-700 font-semibold mt-0.5">
          وصل متأخراً
        </span>
      )
    }
    if (isAbsent) {
      return (
        <span className="font-caption text-caption text-error font-semibold mt-0.5">
          غائب
        </span>
      )
    }
    if (isExcused) {
      return (
        <span className="font-caption text-caption text-cyan-700 font-semibold mt-0.5">
          غياب مبرر
        </span>
      )
    }
    return (
      <span className="font-caption text-caption text-on-surface-variant mt-0.5">
        بانتظار التسجيل
      </span>
    )
  }

  return (
    <div
      className={`student-card group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md flex flex-col justify-between min-h-[176px] select-none ${
        isPresent
          ? 'ring-1 ring-primary/40 bg-primary/5'
          : isAbsent
            ? 'ring-1 ring-error/40 bg-error/5'
            : isLate
              ? 'ring-1 ring-secondary/40 bg-secondary/5'
              : isExcused
                ? 'ring-1 ring-cyan-500/40 bg-cyan-500/5'
                : 'hover:bg-surface-container-lowest'
      }`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            {student.photo ? (
              <img
                className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                src={student.photo}
                alt={student.name}
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center font-bold text-primary text-lg shadow-xs">
                {student.name[0] || 'ط'}
              </div>
            )}
            {isPresent && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] shadow-xs">
                ✓
              </span>
            )}
            {isAbsent && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-error flex items-center justify-center text-on-error text-[10px] shadow-xs">
                ✕
              </span>
            )}
            {isLate && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[10px] shadow-xs">
                ⏱
              </span>
            )}
            {isExcused && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] shadow-xs">
                ℹ
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface truncate">
              {student.name}
            </h3>
            {getStatusSubtitle()}
          </div>
        </div>

        {/* Medical Alert Badge */}
        {student.medicalAlert && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption font-semibold shrink-0"
            title={`تنبيه صحي: ${student.medicalAlert}`}
          >
            <span className="material-symbols-outlined text-sm text-tertiary">emergency</span>
            <span className="truncate max-w-[120px]">{student.medicalAlert}</span>
          </div>
        )}
      </div>

      {/* Tactile Status Selector */}
      <div className="mt-4 pt-3 bg-surface-container-low/60 rounded-xl p-1.5 flex items-center gap-1">
        <button
          onClick={() => onStatusChange(student.id, isPresent ? 'unmarked' : 'present')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
            isPresent
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          type="button"
          title="تسجيل حاضر (مفتاح 1)"
        >
          حاضر
        </button>
        <button
          onClick={() => onStatusChange(student.id, isAbsent ? 'unmarked' : 'absent')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
            isAbsent
              ? 'bg-error text-on-error shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          type="button"
          title="تسجيل غائب (مفتاح 2)"
        >
          غائب
        </button>
        <button
          onClick={() => onStatusChange(student.id, isLate ? 'unmarked' : 'late')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
            isLate
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          type="button"
          title="تسجيل متأخر (مفتاح 3)"
        >
          متأخر
        </button>
      </div>
    </div>
  )
}
