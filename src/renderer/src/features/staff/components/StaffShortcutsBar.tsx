import React from 'react'

export const StaffShortcutsBar: React.FC = () => {
  return (
    <div className="bg-surface-container-low/80 rounded-xl p-space-sm flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant font-caption text-caption border border-outline-variant/10 print:hidden">
      <div className="flex items-center gap-space-md flex-wrap">
        <span className="font-bold text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-primary">keyboard</span>
          اختصارات الكادر:
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">F3</kbd>
          إضافة موظف
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">F4</kbd>
          طلب إجازة
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Ctrl+S</kbd>
          اعتماد الحضور
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Ctrl+P</kbd>
          طباعة
        </span>
      </div>
      <div className="flex items-center gap-1 text-primary font-semibold">
        <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
        <span>سجلات الرواتب والدوام تعمل دون إنترنت</span>
      </div>
    </div>
  )
}
