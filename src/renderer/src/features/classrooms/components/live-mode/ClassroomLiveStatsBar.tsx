import React from 'react'

interface ClassroomLiveStatsBarProps {
  stats: {
    total: number
    present: number
    absent: number
    late: number
    withAlerts: number
  }
  filterStatus: string
  onFilterChange: (status: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onMarkAllPresent: () => void
}

export const ClassroomLiveStatsBar: React.FC<ClassroomLiveStatsBarProps> = ({
  stats,
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onMarkAllPresent
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Realtime Badges Strip */}
      <div className="flex items-center flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-label-md text-label-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>حاضر:</span>
          <span className="font-mono font-bold text-headline-sm mr-1">{stats.present}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-label-md text-label-md">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>متأخر:</span>
          <span className="font-mono font-bold text-headline-sm mr-1">{stats.late}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md">
          <span className="w-2.5 h-2.5 rounded-full bg-error" />
          <span>غائب:</span>
          <span className="font-mono font-bold text-headline-sm mr-1">{stats.absent}</span>
        </div>

        {stats.withAlerts > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-error/10 text-error font-label-md text-label-md">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>تنبيهات صحية:</span>
            <span className="font-mono font-bold text-headline-sm mr-1">{stats.withAlerts}</span>
          </div>
        )}

        <div className="text-on-surface-variant font-caption text-caption flex items-center gap-1 mr-2">
          <span className="material-symbols-outlined text-sm">groups</span>
          <span>إجمالي القيد: {stats.total} طفلاً</span>
        </div>
      </div>

      {/* Filter Tabs & Search & Mark All */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Quick Filter Tabs */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl text-caption font-semibold">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-surface-container-lowest text-on-surface shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            الكل ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('present')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'present'
                ? 'bg-emerald-500 text-white shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            حاضر ({stats.present})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('absent')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'absent'
                ? 'bg-error text-white shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            غائب ({stats.absent})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('late')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'late'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            متأخر ({stats.late})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex items-center w-48">
          <span className="material-symbols-outlined absolute right-2.5 text-outline text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث عن طفل..."
            className="w-full h-9 pr-8 pl-2 rounded-xl bg-surface-container-low text-on-surface text-body-sm placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-colors"
          />
        </div>

        {/* Mark All Present */}
        <button
          type="button"
          onClick={onMarkAllPresent}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-label-md font-bold transition-all active:scale-95 shadow-2xs"
          title="تحضير جميع الأطفال دفعة واحدة"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>تحديد الجميع حاضر</span>
        </button>
      </div>
    </div>
  )
}
