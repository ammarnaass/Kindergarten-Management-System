import React from 'react'
import type { ClassroomItem, TimetableActivePeriod } from '../../types'

interface ClassroomLiveHeaderProps {
  classrooms: ClassroomItem[]
  currentClassroom: ClassroomItem | null
  onSelectClassroom: (id: string) => void
  currentPeriod: TimetableActivePeriod | null
  onOpenTimer: () => void
  isTimerRunning: boolean
  timerFormatted: string
  pickupAlertsCount: number
  onTogglePickupAlerts: () => void
  onExitLiveMode: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export const ClassroomLiveHeader: React.FC<ClassroomLiveHeaderProps> = ({
  classrooms,
  currentClassroom,
  onSelectClassroom,
  currentPeriod,
  onOpenTimer,
  isTimerRunning,
  timerFormatted,
  pickupAlertsCount,
  onTogglePickupAlerts,
  onExitLiveMode,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      {/* Classroom Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl">
          {classrooms.map((c) => {
            const isSelected = c.id === currentClassroom?.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectClassroom(c.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-headline-sm text-headline-sm transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSelected ? 'shield' : 'meeting_room'}
                </span>
                <span>{c.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-caption font-mono ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {c.totalChildren}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Center Info: Period & Teacher */}
      <div className="flex items-center flex-wrap gap-3">
        {currentPeriod && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-fixed/30 border border-primary/20 text-on-surface">
            <span className="material-symbols-outlined text-primary text-[18px]">
              {currentPeriod.icon || 'schedule'}
            </span>
            <div className="leading-tight text-right">
              <span className="font-label-sm text-label-sm font-bold text-primary block">
                {currentPeriod.title}
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                {currentPeriod.startTime} - {currentPeriod.endTime}
              </span>
            </div>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant text-body-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">school</span>
          <span>المعلمة:</span>
          <span className="font-bold text-on-surface">
            {currentClassroom?.teacher?.name || 'غير معينة'}
          </span>
        </div>
      </div>

      {/* Controls & Tools */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Activity Timer Widget Button */}
        <button
          type="button"
          onClick={onOpenTimer}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-lg text-label-lg transition-all shadow-xs active:scale-95 ${
            isTimerRunning
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">timer</span>
          <span className="font-mono font-bold">{timerFormatted}</span>
          <span className="text-caption hidden sm:inline">المؤقت الصفي</span>
        </button>

        {/* Gate Pickup Alert Button */}
        <button
          type="button"
          onClick={onTogglePickupAlerts}
          className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors border border-outline-variant/40"
          title="نداءات استلام البوابة"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">
            campaign
          </span>
          <span className="hidden md:inline">نداء البوابة</span>
          {pickupAlertsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-error text-on-error font-mono text-[11px] font-bold flex items-center justify-center animate-bounce">
              {pickupAlertsCount}
            </span>
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة الذكية (F11)'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>

        {/* Exit Live Mode */}
        <button
          type="button"
          onClick={onExitLiveMode}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          <span>إنهاء وضع الفصل</span>
        </button>
      </div>
    </div>
  )
}
