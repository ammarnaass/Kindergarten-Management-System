import React from 'react'
import type { DailyClassroomChild, DailyFilterStatus } from '../types'
import { DailyChildListItem } from './DailyChildListItem'

interface DailyChildrenRosterProps {
  childrenList: DailyClassroomChild[]
  isLoading: boolean
  selectedChildId: string | null
  onSelectChild: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  filterStatus: DailyFilterStatus
  onFilterChange: (status: DailyFilterStatus) => void
}

export const DailyChildrenRoster: React.FC<DailyChildrenRosterProps> = ({
  childrenList,
  isLoading,
  selectedChildId,
  onSelectChild,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange
}) => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-3 bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-on-surface text-sm">
          <span>أطفال الفصل</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs">
            {childrenList.length}
          </span>
        </div>
        <span className="text-2xs text-on-surface-variant">اختر طفلاً للتحرير</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute right-2.5 top-2 text-base text-outline">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث باسم الطفل..."
          className="w-full h-8 pr-8 pl-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Filter Status Chips */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {(
          [
            { id: 'all', label: 'الكل' },
            { id: 'pending', label: 'بانتظار' },
            { id: 'completed', label: 'مكتمل' },
            { id: 'absent', label: 'غائب' },
            { id: 'allergy', label: 'حساسية' }
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all whitespace-nowrap ${
              filterStatus === f.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Children List */}
      <div className="flex flex-col gap-1.5 max-h-[calc(100vh-380px)] overflow-y-auto pr-0.5 scrollbar-thin">
        {isLoading ? (
          <div className="p-8 text-center text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
            <p className="text-xs">جاري جلب أطفال الفصل...</p>
          </div>
        ) : childrenList.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-xl text-xs text-on-surface-variant">
            لا يوجد أطفال يطابقون خيارات الفلترة
          </div>
        ) : (
          childrenList.map((child) => (
            <DailyChildListItem
              key={child.id}
              child={child}
              isSelected={child.id === selectedChildId}
              onSelect={onSelectChild}
            />
          ))
        )}
      </div>
    </div>
  )
}
