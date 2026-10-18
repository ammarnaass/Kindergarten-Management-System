import React from 'react'

interface DailyHeaderBannerProps {
  selectedDate: string
  onDateChange: (date: string) => void
  onPrint: () => void
  hasActiveChild: boolean
}

export const DailyHeaderBanner: React.FC<DailyHeaderBannerProps> = ({
  selectedDate,
  onDateChange,
  onPrint,
  hasActiveChild
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-outline-variant/60">
      <div className="flex items-center gap-space-md">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-2xs">
          <span className="material-symbols-outlined text-[26px]">summarize</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              التقرير اليومي والملاحظات التربوية
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-caption text-caption font-bold">
              حفظ محلي SQLite 100%
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            توثيق شامل للوجبات، القيلولة، السلوكيات، والتواصل المباشر مع أولياء الأمور
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Picker */}
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/60">
          <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-on-surface focus:outline-none"
          />
        </div>

        {/* Print Button */}
        <button
          type="button"
          onClick={onPrint}
          disabled={!hasActiveChild}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold shadow-2xs transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base text-secondary">print</span>
          <span>طباعة تقرير A5 (Ctrl+P)</span>
        </button>
      </div>
    </div>
  )
}
