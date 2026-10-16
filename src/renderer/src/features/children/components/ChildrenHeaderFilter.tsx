interface ClassroomOption {
  id: string
  label: string
}

interface ChildrenHeaderFilterProps {
  totalCount: number
  search: string
  onSearchChange: (value: string) => void
  selectedClassroom: string
  onClassroomChange: (id: string) => void
  classrooms: ClassroomOption[]
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  onNewChild: () => void
}

export function ChildrenHeaderFilter({
  totalCount,
  search,
  onSearchChange,
  selectedClassroom,
  onClassroomChange,
  classrooms,
  viewMode,
  onViewModeChange,
  onNewChild
}: ChildrenHeaderFilterProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">escalator_warning</span>
          </div>
          <div>
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                سجل الأطفال والملفات
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-caption text-caption font-bold">
                {totalCount} طفل
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              قائمة الأطفال المسجلين في العام الدراسي 2026/2027 مع الحالة الصحية والفصلية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-xs self-start md:self-center">
          {/* View Mode Switcher */}
          <div className="bg-surface-container p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="عرض بطاقات"
              type="button"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="عرض جدول"
              type="button"
            >
              <span className="material-symbols-outlined text-base">view_list</span>
            </button>
          </div>

          <button
            onClick={onNewChild}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>طفل جديد</span>
            <kbd className="font-mono text-caption px-1.5 py-0.5 rounded bg-primary-container/40 text-on-primary">
              Ctrl+N
            </kbd>
          </button>
        </div>
      </div>

      {/* Search Bar and Classroom Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md pt-2 border-t border-outline-variant/30">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم الكامل أو تاريخ الميلاد أو الفصل..."
            className="w-full h-10 pr-10 pl-10 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/50 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-2.5 text-on-surface-variant hover:text-on-surface"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {classrooms.map((c) => (
            <button
              key={c.id}
              onClick={() => onClassroomChange(c.id)}
              className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm whitespace-nowrap transition-colors ${
                selectedClassroom === c.id
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              type="button"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
