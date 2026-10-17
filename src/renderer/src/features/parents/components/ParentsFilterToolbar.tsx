import React, { RefObject } from 'react'
import type { ClassroomItem, CategoryTab, ViewMode, ParentsStats } from '../types'

interface ParentsFilterToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchInputRef: RefObject<HTMLInputElement>
  classroomFilter: string
  onClassroomFilterChange: (value: string) => void
  classrooms: ClassroomItem[]
  authFilter: string
  onAuthFilterChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  categoryTab: CategoryTab
  onCategoryTabChange: (tab: CategoryTab) => void
  stats: ParentsStats
}

export const ParentsFilterToolbar: React.FC<ParentsFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchInputRef,
  classroomFilter,
  onClassroomFilterChange,
  classrooms,
  authFilter,
  onAuthFilterChange,
  viewMode,
  onViewModeChange,
  categoryTab,
  onCategoryTabChange,
  stats
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/20 flex flex-col gap-space-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        {/* Search Bar with Keyboard Hint */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute right-space-md top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث سريع بالاسم، رقم الهوية الوطنية، رقم الجوال، أو اسم الطفل المسجل..."
            className="w-full pr-11 pl-20 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/70 transition-all border border-transparent focus:border-primary/30"
          />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded font-caption text-caption text-on-surface-variant">
              Ctrl+F
            </kbd>
          </div>
        </div>

        {/* Quick Select Classrooms & Status */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="relative">
            <select
              value={classroomFilter}
              onChange={(e) => onClassroomFilterChange(e.target.value)}
              className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 pr-space-md pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-transparent"
            >
              <option value="all">جميع الفصول والصفوف</option>
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={authFilter}
              onChange={(e) => onAuthFilterChange(e.target.value)}
              className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 pr-space-md pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-transparent"
            >
              <option value="all">حالة التفويض: الكل</option>
              <option value="authorized">مصرح بالاستلام الدائم</option>
              <option value="forbidden">غير مصرح بالاستلام / محظور</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="عرض جدول مكتبي مكثف"
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              <span>جدول</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                viewMode === 'cards'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="عرض البطاقات الأسرية"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>بطاقات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tags Ribbon */}
      <div className="flex items-center gap-space-xs overflow-x-auto pb-1 text-on-surface-variant font-label-md text-label-md">
        <span className="font-caption text-caption text-outline ml-space-xs flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[14px]">tune</span>
          التصنيف:
        </span>
        <button
          type="button"
          onClick={() => onCategoryTabChange('all')}
          className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 transition-all ${
            categoryTab === 'all'
              ? 'bg-primary text-on-primary shadow-xs font-semibold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span>الكل</span>
          <span className="bg-white/20 text-current text-[10px] px-1.5 rounded-full">{stats.total}</span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryTabChange('fathers')}
          className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 transition-all ${
            categoryTab === 'fathers'
              ? 'bg-primary text-on-primary shadow-xs font-semibold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span>الآباء</span>
          <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 rounded-full">
            {stats.fathersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryTabChange('mothers')}
          className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 transition-all ${
            categoryTab === 'mothers'
              ? 'bg-primary text-on-primary shadow-xs font-semibold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span>الأمهات</span>
          <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 rounded-full">
            {stats.mothersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryTabChange('pickups')}
          className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 transition-all ${
            categoryTab === 'pickups'
              ? 'bg-primary text-on-primary shadow-xs font-semibold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span>المفوضون الخارجيون (سائقين/أقارب)</span>
          <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 rounded-full">
            {stats.totalPickups}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryTabChange('emergency')}
          className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 transition-all ${
            categoryTab === 'emergency'
              ? 'bg-primary text-on-primary shadow-xs font-semibold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
          <span>جهات الطوارئ الأولى</span>
          <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 rounded-full">
            {stats.emergencyCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryTabChange('restricted')}
          className={`px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 transition-all ${
            categoryTab === 'restricted'
              ? 'bg-primary text-on-primary shadow-xs font-semibold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-error" />
          <span>تفويضات معلقة أو محظورة</span>
          <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1.5 rounded-full">
            {stats.restrictedCount}
          </span>
        </button>
      </div>
    </div>
  )
}
