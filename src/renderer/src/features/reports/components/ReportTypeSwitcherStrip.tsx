import React from 'react'
import type { ReportType } from '../types'

interface ReportTypeSwitcherStripProps {
  activeReport: ReportType
  onSelectReport: (report: ReportType) => void
}

const REPORT_TABS = [
  { id: 'roster' as const, label: 'كشوفات قيد الفصول', icon: 'format_list_numbered', desc: 'قوائم الطلاب والبيانات الأساسية' },
  { id: 'registration' as const, label: 'استمارة التسجيل الرسمية', icon: 'description', desc: 'نموذج A4 للأرشيف والتوقيع' },
  { id: 'cards' as const, label: 'بطاقات الهوية والاستلام', icon: 'qr_code_scanner', desc: 'بطاقات PVC للبوابة بباركود مشفر' },
  { id: 'receipt' as const, label: 'سند الاستلام الأمني', icon: 'receipt_long', desc: 'إيصال 80mm حراري أو A5 للبوابة' },
  { id: 'attendance' as const, label: 'سجل الحضور والانضباط', icon: 'fact_check', desc: 'كشف الغياب والالتزام الشهري' },
  { id: 'finance' as const, label: 'مسير الرسوم والمالية', icon: 'account_balance_wallet', desc: 'ميزان المدفوعات والذمم المتبقية' },
  { id: 'clinic' as const, label: 'العيادة والحالات الحرجة', icon: 'medical_services', desc: 'الحساسيات وتنبيهات الطوارئ' }
]

export const ReportTypeSwitcherStrip: React.FC<ReportTypeSwitcherStripProps> = ({
  activeReport,
  onSelectReport
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 print:hidden">
      {REPORT_TABS.map((tab) => {
        const isActive = activeReport === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectReport(tab.id)}
            className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
              isActive
                ? 'bg-primary-container text-on-primary-container border-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-low'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              </span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-on-primary-container" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-label-md leading-tight">{tab.label}</h3>
              <p
                className={`text-[11px] mt-0.5 line-clamp-1 ${
                  isActive ? 'text-on-primary-container/80' : 'text-on-surface-variant'
                }`}
              >
                {tab.desc}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
