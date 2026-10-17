import type { TimetablePeriod } from '../types'

interface TimetableTimelineViewProps {
  periods: TimetablePeriod[]
  activePeriodId: string | null
  onEdit: (period: TimetablePeriod) => void
  onDelete: (id: string) => void
}

function calculateDurationMinutes(start: string, end: string): number {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max(0, eh * 60 + em - (sh * 60 + sm))
}

const CATEGORY_LABELS: Record<string, string> = {
  arrival: 'استقبال وتجمع',
  assembly: 'طابور ونشيد',
  circle: 'حلقة تعلم',
  meal: 'وجبة صحية',
  play: 'أركان ولعب موجه',
  outdoor: 'لعب خارجي',
  nap: 'قيلولة وراحة',
  closing: 'لقاء ختامي',
  pickup: 'انصراف واستلام',
  custom: 'نشاط مخصص'
}

export function TimetableTimelineView({
  periods,
  activePeriodId,
  onEdit,
  onDelete
}: TimetableTimelineViewProps) {
  if (periods.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
        <h4 className="font-bold text-title-md text-on-surface">لا توجد فترات مسجلة في هذا الجدول</h4>
        <p className="text-body-sm text-on-surface-variant mt-1">انقر على زر "فترة جديدة" لإضافة أول فترة في اليوم الدراسي.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 select-none">
      {periods.map((period, idx) => {
        const isActive = activePeriodId === period.id
        const duration = calculateDurationMinutes(period.startTime, period.endTime)
        const categoryLabel = CATEGORY_LABELS[period.category] || period.category

        return (
          <div
            key={period.id}
            className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-xs ${
              isActive
                ? 'bg-surface-container-lowest border-primary shadow-sm ring-2 ring-primary/20'
                : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/80'
            }`}
          >
            {/* Left Colored Accent Bar */}
            <div
              className="absolute right-0 top-3 bottom-3 w-1.5 rounded-l-full"
              style={{ backgroundColor: period.color }}
            />

            {/* Left Info: Period Number, Icon, Title, and Notes */}
            <div className="flex items-start gap-4 pr-3 min-w-0 flex-1">
              {/* Period Number Badge */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-on-surface-variant/80 uppercase">فترة</span>
                <span className="text-xl font-extrabold text-on-surface font-mono">{period.periodNumber}</span>
              </div>

              {/* Icon Container */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: period.color }}
              >
                <span className="material-symbols-outlined text-[24px]">{period.icon}</span>
              </div>

              {/* Title & Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-title-md text-on-surface truncate">{period.title}</h3>

                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
                    {categoryLabel}
                  </span>

                  {isActive && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500 text-white animate-pulse">
                      الفترة الحالية الآن
                    </span>
                  )}
                </div>

                {period.notes && (
                  <p className="text-body-sm text-on-surface-variant line-clamp-1">{period.notes}</p>
                )}

                {period.supervisorStaffName && (
                  <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mt-1.5">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>المشرفة: {period.supervisorStaffName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Info: Time Range & Duration & Actions */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
              {/* Timing Badge */}
              <div className="text-left md:text-right">
                <div className="flex items-center gap-1.5 font-mono text-base font-bold text-on-surface">
                  <span>{period.startTime}</span>
                  <span className="text-outline">←</span>
                  <span>{period.endTime}</span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">
                  المدة: {duration} دقيقة
                </span>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(period)}
                  className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                  title="تعديل الفترة"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من حذف فترة "${period.title}"؟`)) {
                      onDelete(period.id)
                    }
                  }}
                  className="p-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                  title="حذف الفترة"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
