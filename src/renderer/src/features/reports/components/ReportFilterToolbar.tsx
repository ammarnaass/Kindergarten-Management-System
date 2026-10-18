import React from 'react'
import type { ReportType, ClassroomItem, ChildItem } from '../types'

interface ReportFilterToolbarProps {
  activeReport: ReportType
  selectedClassroomId: string
  onClassroomChange: (id: string) => void
  period: string
  onPeriodChange: (p: string) => void
  childrenList: ChildItem[]
  classrooms: ClassroomItem[]
}

export const ReportFilterToolbar: React.FC<ReportFilterToolbarProps> = ({
  activeReport,
  selectedClassroomId,
  onClassroomChange,
  period,
  onPeriodChange,
  childrenList,
  classrooms
}) => {
  return (
    <div className="bg-surface-container-lowest px-5 py-3 rounded-xl border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div className="flex flex-wrap items-center gap-4">
        {(activeReport === 'roster' ||
          activeReport === 'cards' ||
          activeReport === 'attendance' ||
          activeReport === 'registration' ||
          activeReport === 'receipt') && (
          <div className="flex items-center gap-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
              الفصل الدراسي:
            </span>
            <select
              value={selectedClassroomId}
              onChange={(e) => onClassroomChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none"
            >
              <option value="ALL">جميع الفصول ({childrenList.length} أطفال)</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {(activeReport === 'attendance' || activeReport === 'finance') && (
          <div className="flex items-center gap-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
              فترة التقرير:
            </span>
            <input
              type="month"
              value={period}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none"
            >
            </input>
          </div>
        )}
      </div>

      <div className="text-caption font-caption text-on-surface-variant flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
        <span>جاهز للعرض والطباعة بدون إنترنت</span>
      </div>
    </div>
  )
}
