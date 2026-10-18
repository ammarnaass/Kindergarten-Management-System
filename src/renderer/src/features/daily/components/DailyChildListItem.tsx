import React from 'react'
import type { DailyClassroomChild } from '../types'

interface DailyChildListItemProps {
  child: DailyClassroomChild
  isSelected: boolean
  onSelect: (id: string) => void
}

export const DailyChildListItem: React.FC<DailyChildListItemProps> = ({
  child,
  isSelected,
  onSelect
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(child.id)}
      className={`flex items-center justify-between p-2.5 rounded-xl text-right transition-all border ${
        isSelected
          ? 'bg-primary-fixed/40 border-primary shadow-xs'
          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-2xs">
            {child.firstName[0]}
          </div>
          {child.allergies && (
            <span
              className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold"
              title={`حساسية: ${child.allergies}`}
            >
              !
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-xs text-on-surface truncate">
            {child.firstName} {child.lastName}
          </span>
          <div className="flex items-center gap-1.5 text-2xs text-on-surface-variant">
            {child.allergies ? (
              <span className="text-rose-600 font-semibold truncate">
                {child.allergies}
              </span>
            ) : (
              <span>حالة صحية طبيعية</span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1">
        {child.reportStatus === 'completed' ? (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-2xs">
            مكتمل
          </span>
        ) : child.reportStatus === 'absent' ? (
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-outline font-bold text-2xs">
            غائب
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-2xs">
            بانتظار
          </span>
        )}
      </div>
    </button>
  )
}
