import type { ClassroomItem } from '@/lib/api/types'

interface AttendanceHeaderBarProps {
  classrooms: ClassroomItem[]
  activeClassroomId: string
  onClassChange: (classroomId: string) => void
  onMarkAllPresent: () => void
  onCommitAttendance: () => void
  onPrintSheet: () => void
  counts: {
    present: number
    absent: number
    late: number
    unmarked: number
    total: number
  }
  teacherName?: string
  dateString?: string
  selectedDate: string
  onDateChange: (date: string) => void
  isSaving?: boolean
  isSaved?: boolean
  errorMessage?: string | null
}

const CLASS_ICONS = ['auto_awesome', 'flutter', 'local_florist', 'psychiatry', 'cruelty_free', 'pets', 'palette', 'rocket_launch']

export function AttendanceHeaderBar({
  classrooms,
  activeClassroomId,
  onClassChange,
  onMarkAllPresent,
  onCommitAttendance,
  onPrintSheet,
  counts,
  teacherName = 'معلمة الفصل',
  dateString,
  selectedDate,
  onDateChange,
  isSaving = false,
  isSaved = false,
  errorMessage = null,
}: AttendanceHeaderBarProps) {
  return (
    <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm mb-space-lg overflow-hidden select-none">
      {/* Subtle Ambient Accent */}
      <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
        {/* Dynamic Classroom Tabs from Database */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm">
          {classrooms.length === 0 ? (
            <div className="text-on-surface-variant font-label-md py-2">
              جاري تحميل الفصول الدراسية...
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl flex-wrap">
              {classrooms.map((cls, idx) => {
                const isActive = activeClassroomId === cls.id
                const icon = CLASS_ICONS[idx % CLASS_ICONS.length]
                return (
                  <button
                    key={cls.id}
                    onClick={() => onClassChange(cls.id)}
                    className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-transform active:scale-95 ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                    <span>{cls.name}</span>
                    {cls.room && (
                      <span
                        className={`px-1.5 py-0.2 rounded font-caption text-caption ${
                          isActive
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {cls.room}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Suite: Quick Actions */}
        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            onClick={onMarkAllPresent}
            disabled={counts.total === 0 || isSaving}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-lg text-label-lg transition-all active:scale-95 shadow-xs disabled:opacity-50 disabled:pointer-events-none"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-lg">done_all</span>
            <span>تحديد الجميع حاضر</span>
          </button>

          <button
            onClick={onPrintSheet}
            disabled={counts.total === 0}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-lg text-label-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            <span>طباعة الكشف</span>
          </button>

          <button
            onClick={onCommitAttendance}
            disabled={counts.total === 0 || isSaving}
            className={`flex items-center gap-2.5 px-space-lg py-2.5 rounded-xl font-headline-sm text-headline-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
              isSaved
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">
              {isSaving ? 'hourglass_top' : isSaved ? 'check_circle' : 'verified'}
            </span>
            <span>
              {isSaving ? 'جاري الاعتماد...' : isSaved ? 'تم اعتماد الحضور بنجاح' : 'اعتماد وحفظ الحضور'}
            </span>
            <kbd className="px-2 py-0.5 rounded bg-on-primary/20 font-caption text-caption text-on-primary font-mono">
              Ctrl+S
            </kbd>
          </button>
        </div>
      </div>

      {/* Active Metadata & Live Status Bar */}
      <div className="mt-space-md pt-space-md flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low/70 rounded-xl p-space-md">
        {/* Date Selector & Teacher Badge */}
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1 text-sm font-semibold font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {dateString && (
              <span className="font-headline-sm text-headline-sm font-semibold">{dateString}</span>
            )}
            <span className="text-on-surface-variant font-body-sm text-body-sm">• الحصة الصباحية</span>
          </div>
          <div className="h-4 w-px bg-outline-variant/60 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-on-surface-variant font-body-md text-body-md">
            <span className="material-symbols-outlined text-base">school</span>
            <span>المعلمة المعتمدة:</span>
            <span className="font-semibold text-on-surface">{teacherName}</span>
          </div>
        </div>

        {/* Realtime Counts Strip */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-label-md text-label-md text-on-surface">حاضر</span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary font-mono mr-1">
              {counts.present}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-error-container text-on-error-container shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="font-label-md text-label-md">غائب</span>
            <span className="font-headline-sm text-headline-sm font-bold font-mono mr-1">
              {counts.absent}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="font-label-md text-label-md">متأخر</span>
            <span className="font-headline-sm text-headline-sm font-bold font-mono mr-1">
              {counts.late}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-highest text-on-surface-variant shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-outline" />
            <span className="font-label-md text-label-md">غير مسجّل</span>
            <span className="font-headline-sm text-headline-sm font-bold font-mono mr-1">
              {counts.unmarked}
            </span>
          </div>

          <div className="pr-2 text-on-surface-variant font-caption text-caption flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">groups</span>
            <span>المجموع: {counts.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
