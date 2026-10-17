import type { CurrentPeriodStatus } from '../types'

interface CurrentPeriodHeroCardProps {
  status: CurrentPeriodStatus & { currentTimeFormatted: string; triggerChime: () => void }
  onOpenNewPeriod: () => void
  onPrint: () => void
}

export function CurrentPeriodHeroCard({
  status,
  onOpenNewPeriod,
  onPrint
}: CurrentPeriodHeroCardProps) {
  const {
    currentPeriod,
    nextPeriod,
    minutesRemaining,
    progressPercent,
    isSchoolHours,
    statusText,
    currentTimeFormatted,
    triggerChime
  } = status

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 shadow-sm border border-outline-variant/30 select-none">
      {/* Decorative background glow */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: currentPeriod?.color || '#0284c7' }}
      />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        {/* Left Section: Active Period Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-on-primary shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>الوقت الفعلي: {currentTimeFormatted}</span>
            </span>

            {isSchoolHours && currentPeriod && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
                الفترة {currentPeriod.periodNumber} نشطة الآن
              </span>
            )}
          </div>

          <div className="flex items-start gap-4 mt-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: currentPeriod?.color || '#0284c7' }}
            >
              <span className="material-symbols-outlined text-[32px]">
                {currentPeriod?.icon || 'schedule'}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface truncate">
                {currentPeriod ? currentPeriod.title : isSchoolHours ? 'فترة استراحة وانتقال' : 'خارج أوقات الدوام الرسمي'}
              </h2>

              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1 mt-0.5">
                {currentPeriod?.notes || statusText}
              </p>

              {/* Progress & Countdown Bar */}
              {currentPeriod && (
                <div className="mt-4 max-w-xl">
                  <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant mb-1.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">timer</span>
                      <span>{statusText}</span>
                    </span>
                    <span className="font-mono">
                      {currentPeriod.startTime} ← {currentPeriod.endTime} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500 ease-out shadow-xs"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: currentPeriod.color || '#0284c7'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Next Period Card & Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-stretch lg:items-end gap-3 shrink-0">
          {/* Next Period Preview Card */}
          {nextPeriod && (
            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 flex items-center gap-3 shadow-2xs min-w-[240px]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: nextPeriod.color || '#64748b' }}
              >
                <span className="material-symbols-outlined text-[20px]">{nextPeriod.icon || 'arrow_forward'}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-secondary uppercase block">الفترة التالية</span>
                <span className="font-bold text-label-md text-on-surface truncate block">
                  {nextPeriod.title}
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  الساعة {nextPeriod.startTime}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={triggerChime}
              className="p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all active:scale-95 shadow-2xs"
              title="رن جرس التنبيه الصوتي للانتقال"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-amber-500">notifications_active</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-label-md flex items-center gap-1.5 transition-colors border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة الجدول A4</span>
            </button>

            <button
              onClick={onOpenNewPeriod}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-label-md flex items-center gap-1.5 transition-all shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>فترة جديدة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
