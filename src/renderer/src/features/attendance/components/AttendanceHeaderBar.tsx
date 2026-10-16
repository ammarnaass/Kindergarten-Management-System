interface AttendanceHeaderBarProps {
  activeClass: string
  onClassChange: (className: string) => void
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
  isSaved?: boolean
}

const CLASS_TABS = [
  { id: 'فصل النجوم', label: 'فصل النجوم', icon: 'auto_awesome', count: 18 },
  { id: 'فصل الفراشات', label: 'فصل الفراشات', icon: 'flutter', count: 14 },
  { id: 'فصل الزهور', label: 'فصل الزهور', icon: 'local_florist', count: 13 },
  { id: 'فصل البراعم', label: 'فصل البراعم', icon: 'psychiatry', count: 11 },
]

export function AttendanceHeaderBar({
  activeClass,
  onClassChange,
  onMarkAllPresent,
  onCommitAttendance,
  onPrintSheet,
  counts,
  teacherName = 'أ. مريم بن يحيى',
  dateString = 'الثلاثاء، 16 أكتوبر 2026',
  isSaved = false,
}: AttendanceHeaderBarProps) {
  return (
    <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm mb-space-lg overflow-hidden select-none">
      {/* Subtle Ambient Accent */}
      <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
        {/* Classroom Tabs (Touch friendly) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm">
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl flex-wrap">
            {CLASS_TABS.map((tab) => {
              const isActive = activeClass === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onClassChange(tab.id)}
                  className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-caption text-caption ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Suite: Quick Actions */}
        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            onClick={onMarkAllPresent}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-lg text-label-lg transition-all active:scale-95 shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-lg">done_all</span>
            <span>تحديد الجميع حاضر</span>
          </button>

          <button
            onClick={onPrintSheet}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-lg text-label-lg transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            <span>طباعة الكشف</span>
          </button>

          <button
            onClick={onCommitAttendance}
            className={`flex items-center gap-2.5 px-space-lg py-2.5 rounded-xl font-headline-sm text-headline-sm shadow-md transition-all active:scale-95 ${
              isSaved
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">
              {isSaved ? 'check_circle' : 'verified'}
            </span>
            <span>{isSaved ? 'تم اعتماد الحضور' : 'اعتماد وحفظ الحضور'}</span>
            <kbd className="px-2 py-0.5 rounded bg-on-primary/20 font-caption text-caption text-on-primary font-mono">
              Ctrl+S
            </kbd>
          </button>
        </div>
      </div>

      {/* Active Metadata & Live Status Bar */}
      <div className="mt-space-md pt-space-md flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low/70 rounded-xl p-space-md">
        {/* Date & Teacher Badge */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
            <span className="font-headline-sm text-headline-sm font-semibold">{dateString}</span>
            <span className="text-on-surface-variant font-body-sm text-body-sm">• الحصة الصباحية</span>
          </div>
          <div className="h-4 w-px bg-outline-variant/60" />
          <div className="flex items-center gap-1.5 text-on-surface-variant font-body-md text-body-md">
            <span className="material-symbols-outlined text-base">school</span>
            <span>المعلمة المعتمدة:</span>
            <span className="font-semibold text-on-surface">{teacherName}</span>
          </div>
        </div>

        {/* Realtime Counts Strip */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
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
