import { useNavigate } from 'react-router-dom'

interface ExecutiveBannerProps {
  teacherName?: string
  dateString?: string
  onNewChild?: () => void
}

export function ExecutiveBanner({
  teacherName = 'أ. نادية',
  dateString = 'الثلاثاء 16 أكتوبر 2026',
  onNewChild
}: ExecutiveBannerProps) {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      {/* Subtle architectural background glow */}
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
        {/* Title & Live Temporal Meta */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-caption text-caption font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              محطة الإدارة المحلية المباشرة
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-outline">dns</span>
              قاعدة SQLite محلية مشفرة (active.db)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <h1 className="font-display-md text-display-md text-on-surface font-bold tracking-tight">
              صباح الخير، {teacherName} 👋
            </h1>
            <span className="font-body-md text-body-md text-on-surface-variant">
              يوم دراسي مفعم بالنشاط والحيوية
            </span>
          </div>

          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm mt-0.5">
            <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
            <span className="font-semibold text-on-surface">{dateString}</span>
            <span className="text-outline-variant">|</span>
            <span>الفصل الدراسي الأول • العام 2026 / 2027</span>
            <span className="text-outline-variant">|</span>
            <span className="inline-flex items-center gap-1 text-primary font-mono text-caption bg-surface-container-low px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-xs">speed</span> 0.04ms زمن استجابة الاستعلام
            </span>
          </div>
        </div>

        {/* Quick Operational Action Ribbon */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            onClick={() => navigate('/finance')}
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-xs hover:bg-primary-container active:scale-[0.98] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-base">point_of_sale</span>
            <span>تسجيل دفعة</span>
            <kbd className="px-1.5 py-0.5 rounded bg-on-primary/20 text-on-primary font-mono text-caption">
              Ctrl+D
            </kbd>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-[0.98] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-primary">checklist</span>
            <span>حضور الفصول</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono text-caption">
              Ctrl+A
            </kbd>
          </button>

          <button
            onClick={() => (onNewChild ? onNewChild() : navigate('/children'))}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-[0.98] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-primary">person_add</span>
            <span>تسجيل طفل</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono text-caption">
              Ctrl+N
            </kbd>
          </button>

          <button
            onClick={() => window.print()}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:bg-surface-container hover:text-on-surface active:scale-[0.98] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>تقرير اليوم</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-caption">
              Ctrl+P
            </kbd>
          </button>
        </div>
      </div>
    </div>
  )
}
