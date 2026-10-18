import React from 'react'
import type { ActiveTab, DirectoryViewMode } from '../types'

interface StaffNavigationTabsProps {
  activeTab: ActiveTab
  onSelectTab: (tab: ActiveTab) => void
  attendanceCount: number
  staffCount: number
  leavesCount: number
  // Directory controls
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  uniqueRoles: string[]
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  directoryViewMode: DirectoryViewMode
  onDirectoryViewModeChange: (mode: DirectoryViewMode) => void
  // Attendance controls
  onMarkAllPresent: () => void
  onSaveAttendance: () => void
  isSavingAttendance: boolean
}

export const StaffNavigationTabs: React.FC<StaffNavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  attendanceCount,
  staffCount,
  leavesCount,
  roleFilter,
  onRoleFilterChange,
  uniqueRoles,
  searchQuery,
  onSearchQueryChange,
  directoryViewMode,
  onDirectoryViewModeChange,
  onMarkAllPresent,
  onSaveAttendance,
  isSavingAttendance
}) => {
  return (
    <div className="px-6 pt-4 border-b border-surface-container-high flex flex-wrap items-center justify-between gap-4 bg-surface-container-low/40 print:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectTab('attendance')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'attendance'
              ? 'border-primary text-primary bg-surface-container-lowest'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          <span>كشف الدوام اليومي</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary font-bold">
            {attendanceCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('directory')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'directory'
              ? 'border-primary text-primary bg-surface-container-lowest'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">contact_page</span>
          <span>دليل الموظفين والمعلمات</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container text-on-surface-variant font-bold">
            {staffCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('leaves')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'leaves'
              ? 'border-primary text-primary bg-surface-container-lowest'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">event_note</span>
          <span>سجل الإجازات والاستئذان</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container text-on-surface-variant font-bold">
            {leavesCount}
          </span>
        </button>
      </div>

      {/* Directory Tab Toolbar */}
      {activeTab === 'directory' && (
        <div className="flex items-center gap-3 pb-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none"
          >
            <option value="ALL">جميع المسميات ({staffCount})</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="بحث بالاسم أو الهاتف..."
              className="pr-8 pl-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none w-52"
            />
          </div>

          {/* View Switcher: Cards vs Table */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onDirectoryViewModeChange('cards')}
              className={`px-2 py-1 rounded text-caption flex items-center gap-1 font-semibold ${
                directoryViewMode === 'cards'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
              title="عرض البطاقات المهنية"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>بطاقات</span>
            </button>
            <button
              type="button"
              onClick={() => onDirectoryViewModeChange('table')}
              className={`px-2 py-1 rounded text-caption flex items-center gap-1 font-semibold ${
                directoryViewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
              title="عرض جدول تفصيلي"
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              <span>جدول</span>
            </button>
          </div>
        </div>
      )}

      {/* Attendance Tab Toolbar */}
      {activeTab === 'attendance' && (
        <div className="flex items-center gap-2 pb-2">
          <button
            type="button"
            onClick={onMarkAllPresent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-label-sm font-semibold border border-primary/20"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>تحديد الكل كحاضر</span>
          </button>

          <button
            type="button"
            onClick={onSaveAttendance}
            disabled={isSavingAttendance || attendanceCount === 0}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-sm font-semibold shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>{isSavingAttendance ? 'جاري الاعتماد...' : 'اعتماد وحفظ الكشف (Ctrl+S)'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
