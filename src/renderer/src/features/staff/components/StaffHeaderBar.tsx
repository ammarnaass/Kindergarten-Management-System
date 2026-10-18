import React from 'react'

interface StaffHeaderBarProps {
  selectedDate: string
  onDateChange: (date: string) => void
  onRefresh: () => void
  onOpenLeaveModal: () => void
  onOpenAddStaffModal: () => void
}

export const StaffHeaderBar: React.FC<StaffHeaderBarProps> = ({
  selectedDate,
  onDateChange,
  onRefresh,
  onOpenLeaveModal,
  onOpenAddStaffModal
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 print:hidden">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
          <span className="material-symbols-outlined text-[28px]">badge</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-md font-headline-md text-on-surface font-bold">
              إدارة الكادر والموظفين
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-caption text-caption font-semibold">
              محلي ومشفر 100% (Offline)
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            كشف الدوام اليومي، دليل المعلمات والموظفين، وسجل الإجازات ومسير الرواتب
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Picker for Attendance */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            calendar_month
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-label-md font-label-md text-on-surface focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          title="تحديث البيانات"
          className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>

        <button
          type="button"
          onClick={onOpenLeaveModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md font-semibold"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">event_busy</span>
          <span>توثيق إجازة</span>
          <kbd className="bg-surface-container-lowest text-on-surface-variant px-1.5 py-0.5 rounded font-caption text-caption">
            F4
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenAddStaffModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md font-semibold shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>إضافة موظف جديد</span>
          <kbd className="bg-white/20 px-1.5 py-0.5 rounded font-caption text-caption text-on-primary">
            F3
          </kbd>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          title="طباعة السجل (Ctrl+P)"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
        </button>
      </div>
    </div>
  )
}
