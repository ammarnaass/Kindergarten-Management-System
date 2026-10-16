import { useNavigate } from 'react-router-dom'
import { GrowthMetricsBento } from './GrowthMetricsBento'
import { AuditTimelineCard } from './AuditTimelineCard'

interface GrowthAndAuditSectionProps {
  childId?: string
}

export function GrowthAndAuditSection({ childId }: GrowthAndAuditSectionProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-space-lg select-none">
      {/* Growth & Health Quick Metrics Bento */}
      <GrowthMetricsBento />

      {/* Attendance & Financial Status Split Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {/* Attendance Widget */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface">الحضور الشهري</span>
            <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
          </div>
          <div className="flex items-center gap-space-md">
            {/* Attendance Donut SVG */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="96, 100"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-on-surface">96%</span>
            </div>
            <div className="space-y-0.5">
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                22 / 23 يوم
              </div>
              <p className="font-caption text-caption text-on-surface-variant">غياب يومين فقط (عذر صحي موثق)</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/attendance')}
            className="font-caption text-caption text-primary hover:underline font-semibold flex items-center gap-0.5 justify-end"
            type="button"
          >
            سجل الشهر المفصل ←
          </button>
        </div>

        {/* Financial Widget */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface">الملف المالي</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-caption text-caption font-bold">
              منتظم ومسوى
            </span>
          </div>
          <div>
            <span className="font-caption text-caption text-on-surface-variant">الرصيد المستحق الحالي</span>
            <div className="font-display-md text-display-md text-emerald-700 font-bold">
              0 <span className="font-body-sm text-body-sm font-normal">دج</span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant truncate">
              آخر إيصال: <span className="font-mono font-semibold">REC-2026-00842</span>
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-caption text-caption text-outline">تم دفع شهر أكتوبر كاملاً</span>
            <button
              onClick={() => navigate('/finance')}
              className="text-primary hover:text-primary-container font-caption text-caption font-bold"
              type="button"
            >
              الفواتير
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Snapshot */}
      <AuditTimelineCard />
    </div>
  )
}
