import React from 'react'

export const OperationalShortcutsStrip: React.FC = () => {
  return (
    <div className="mt-space-lg mb-space-md bg-surface-container-low/80 rounded-xl p-space-sm flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant font-caption text-caption border border-outline-variant/10">
      <div className="flex items-center gap-space-md flex-wrap">
        <span className="font-bold text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-primary">keyboard</span>
          اختصارات وضع المكتب:
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">F3</kbd>
          تسجيل ولي أمر جديد
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">F4</kbd>
          إرسال تعميم SMS
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Ctrl+P</kbd>
          طباعة بطاقة الاستلام المشفرة
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Ctrl+F</kbd>
          الانتقال إلى حقل البحث
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Esc</kbd>
          إلغاء التحديد
        </span>
      </div>
      <div className="flex items-center gap-1 text-primary font-semibold">
        <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
        <span>يعمل بالكامل بدون اتصال إنترنت (Offline-First Ready)</span>
      </div>
    </div>
  )
}
