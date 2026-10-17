import React from 'react'
import type { GuardianItem } from '../types'

interface ParentsHeaderActionsProps {
  onOpenAddGuardian: () => void
  onOpenBroadcast: () => void
  onOpenPickupCard: () => void
  onExportCsv: () => void
  hasSelectedGuardian: boolean
}

export const ParentsHeaderActions: React.FC<ParentsHeaderActionsProps> = ({
  onOpenAddGuardian,
  onOpenBroadcast,
  onOpenPickupCard,
  onExportCsv,
  hasSelectedGuardian
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
      <div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption mb-1">
          <span>شؤون الطلاب والاستقبال</span>
          <span className="material-symbols-outlined text-[12px]">chevron_left</span>
          <span>بوابات الاستلام وأولياء الأمور</span>
          <span className="material-symbols-outlined text-[12px]">chevron_left</span>
          <span className="text-primary font-semibold">الدليل العام والتفويضات</span>
        </div>
        <h1 className="font-display-md text-display-md text-on-surface tracking-tight">
          دليل أولياء الأمور والتفويضات المعتمدة
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          إدارة السجلات الأسرية، تصاريح الاستلام المشفرة، وبيانات الاتصال للطوارئ بدقة متناهية
        </p>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-space-sm">
        <button
          onClick={onOpenAddGuardian}
          className="group flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md py-2 rounded-lg font-label-lg text-label-lg shadow-sm transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
            person_add
          </span>
          <span>إضافة ولي أمر / مستلم</span>
          <kbd className="mr-1 bg-white/20 px-1.5 py-0.5 rounded font-caption text-caption text-on-primary">
            F3
          </kbd>
        </button>

        <button
          onClick={onOpenBroadcast}
          className="group flex items-center gap-space-xs bg-surface-container-high text-on-surface hover:bg-surface-container-highest px-space-md py-2 rounded-lg font-label-lg text-label-lg transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">campaign</span>
          <span>إرسال تعميم فوري</span>
          <kbd className="mr-1 bg-surface-container-lowest text-on-surface-variant px-1.5 py-0.5 rounded font-caption text-caption">
            F4
          </kbd>
        </button>

        <button
          onClick={onOpenPickupCard}
          disabled={!hasSelectedGuardian}
          className="group flex items-center gap-space-xs bg-surface-container-high text-on-surface hover:bg-surface-container-highest px-space-md py-2 rounded-lg font-label-lg text-label-lg transition-colors disabled:opacity-50"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary">badge</span>
          <span>طباعة بطاقات الاستلام</span>
          <kbd className="mr-1 bg-surface-container-lowest text-on-surface-variant px-1.5 py-0.5 rounded font-caption text-caption">
            Ctrl+P
          </kbd>
        </button>

        <button
          onClick={onExportCsv}
          className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="تصدير السجل إلى ملف CSV"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">file_download</span>
        </button>
      </div>
    </div>
  )
}
