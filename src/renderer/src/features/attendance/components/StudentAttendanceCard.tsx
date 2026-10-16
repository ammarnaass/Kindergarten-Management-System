export type AttendanceStatus = 'present' | 'absent' | 'late' | 'unmarked'

export interface StudentAttendanceItem {
  id: string
  name: string
  photo?: string
  checkInTime?: string
  medicalAlert?: string
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

  return (
    <div
      className={`student-card group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md flex flex-col justify-between min-h-[176px] select-none ${
        isPresent ? 'ring-1 ring-primary/40' : isAbsent ? 'ring-1 ring-error/40' : isLate ? 'ring-1 ring-secondary/40' : ''
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
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center font-bold text-primary text-lg shadow-xs">
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
          </div>

          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              {student.name}
            </h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{student.checkInTime || '08:15 ص'}</span>
            </span>
          </div>
        </div>

        {/* Medical Alert Badge */}
        {student.medicalAlert && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption font-semibold"
            title="تنبيه صحي نشط"
          >
            <span className="material-symbols-outlined text-sm text-tertiary">emergency</span>
            <span>{student.medicalAlert}</span>
          </div>
        )}
      </div>

      {/* Tactile Tri-state Selector */}
      <div className="mt-4 pt-3 bg-surface-container-low/50 rounded-xl p-1.5 flex items-center gap-1">
        <button
          onClick={() => onStatusChange(student.id, 'present')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
            isPresent
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          type="button"
        >
          حاضر
        </button>
        <button
          onClick={() => onStatusChange(student.id, 'absent')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
            isAbsent
              ? 'bg-error text-on-error shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          type="button"
        >
          غائب
        </button>
        <button
          onClick={() => onStatusChange(student.id, 'late')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
            isLate
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          type="button"
        >
          متأخر
        </button>
      </div>
    </div>
  )
}
