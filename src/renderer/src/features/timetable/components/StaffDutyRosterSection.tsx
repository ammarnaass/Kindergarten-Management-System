import type { StaffDuty } from '../types'

interface StaffDutyRosterSectionProps {
  duties: StaffDuty[]
  selectedDay: number
  onSelectDay: (day: number) => void
  onAddDuty: () => void
  onEditDuty: (duty: StaffDuty) => void
  onDeleteDuty: (id: string) => void
}

const DAYS = [
  { id: 0, label: 'الأحد' },
  { id: 1, label: 'الاثنين' },
  { id: 2, label: 'الثلاثاء' },
  { id: 3, label: 'الأربعاء' },
  { id: 4, label: 'الخميس' }
]

const LOCATION_ICONS: Record<string, { icon: string; title: string; color: string }> = {
  main_gate: { icon: 'sensor_door', title: 'بوابة الاستقبال الصباحي', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  dining_hall: { icon: 'restaurant', title: 'قاعة الطعام والوجبة', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  playground: { icon: 'sports_soccer', title: 'ساحة الألعاب الخارجية', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  bus_zone: { icon: 'directions_bus', title: 'منطقة الحافلات والانصراف', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
  corridors: { icon: 'hallway', title: 'ممرات الفصول والمرافق', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' }
}

export function StaffDutyRosterSection({
  duties,
  selectedDay,
  onSelectDay,
  onAddDuty,
  onEditDuty,
  onDeleteDuty
}: StaffDutyRosterSectionProps) {
  return (
    <div className="space-y-4 select-none">
      {/* Day Selector & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {DAYS.map((day) => {
            const isActive = selectedDay === day.id
            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-label-md transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {day.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={onAddDuty}
          className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-bold text-label-md flex items-center justify-center gap-1.5 transition-all shadow-2xs shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>تكليف مناوبة جديد</span>
        </button>
      </div>

      {/* Duty Cards Grid */}
      {duties.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">assignment_late</span>
          <h4 className="font-bold text-title-md text-on-surface">لا توجد مناوبات مسجلة لهذا اليوم</h4>
          <p className="text-body-sm text-on-surface-variant mt-1">
            قم بتوزيع المعلمات والإداريات على بوابات الاستقبال وساحة اللعب لضمان سلامة الأطفال.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {duties.map((duty) => {
            const locMeta = LOCATION_ICONS[duty.dutyLocation] || {
              icon: 'security',
              title: duty.dutyLocation,
              color: 'bg-surface-container text-on-surface'
            }

            return (
              <div
                key={duty.id}
                className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${locMeta.color}`}>
                        <span className="material-symbols-outlined text-[20px]">{locMeta.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-label-lg text-on-surface truncate">{locMeta.title}</h4>
                        <span className="font-mono text-xs text-on-surface-variant block">
                          {duty.startTime} ← {duty.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditDuty(duty)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        title="تعديل"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من حذف هذا التكليف؟')) {
                            onDeleteDuty(duty.id)
                          }
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                        title="حذف"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Staff Info */}
                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                    <div>
                      <span className="text-[11px] text-on-surface-variant block font-medium">الموظفة المكلفة</span>
                      <strong className="text-label-md text-on-surface block font-bold">
                        {duty.staffName || 'غير محدد'}
                      </strong>
                    </div>
                  </div>

                  {duty.notes && (
                    <p className="text-body-sm text-on-surface-variant line-clamp-2 px-1">
                      {duty.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>جاهزية الإشراف</span>
                  </span>
                  <span className="font-semibold text-primary">مناوبة معتمدة</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
