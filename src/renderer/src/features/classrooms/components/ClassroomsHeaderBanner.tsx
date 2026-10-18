import React from 'react'

interface ClassroomsHeaderBannerProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  onAddClassroom: () => void
  onEnterLiveMode: () => void
  onRefresh: () => void
  isLoading: boolean
}

export const ClassroomsHeaderBanner: React.FC<ClassroomsHeaderBannerProps> = ({
  searchQuery,
  onSearchChange,
  onAddClassroom,
  onEnterLiveMode,
  onRefresh,
  isLoading
}) => {
  const todayArabic = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date())

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[28px]">meeting_room</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              إدارة الفصول ووضع الفصل
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
              شاشات ذكية وتفاعل حي
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-primary font-semibold">
              <span className="material-symbols-outlined text-[15px]">calendar_today</span>
              {todayArabic}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
            <span>متابعة تفاعلية لقاعات الروضة وسجلات الحضور والأنشطة اللحظية</span>
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        {/* Search */}
        <div className="relative flex items-center min-w-[240px]">
          <span className="material-symbols-outlined absolute right-3 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث عن فصل، قاعة، معلمة..."
            className="w-full h-10 pr-9 pl-3 rounded-lg bg-surface-container-low text-on-surface text-body-sm placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-colors"
          />
        </div>

        {/* Enter Live Mode */}
        <button
          type="button"
          onClick={onEnterLiveMode}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-headline-sm text-headline-sm transition-all shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">touch_app</span>
          <span>دخول وضع الفصل المباشر</span>
        </button>

        {/* Add Classroom */}
        <button
          type="button"
          onClick={onAddClassroom}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-all active:scale-95 border border-outline-variant/40 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>
          <span>إضافة فصل جديد</span>
        </button>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title="تحديث البيانات"
          className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>
            refresh
          </span>
        </button>
      </div>
    </div>
  )
}
