import React from 'react'

interface ChildFinanceKpiCardsProps {
  stats: {
    totalInvoiced: number
    totalPaid: number
    totalDue: number
    isSettled: boolean
  }
}

export function ChildFinanceKpiCards({ stats }: ChildFinanceKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-on-surface-variant font-medium">إجمالي الرسوم المعتمدة</span>
        <div className="text-headline-md font-bold text-on-surface font-mono mt-2">
          {(stats.totalInvoiced / 100).toLocaleString('ar-DZ')}{' '}
          <span className="text-body-sm font-normal">دج</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-emerald-700 font-medium">إجمالي المبالغ المسددة</span>
        <div className="text-headline-md font-bold text-emerald-700 font-mono mt-2">
          {(stats.totalPaid / 100).toLocaleString('ar-DZ')}{' '}
          <span className="text-body-sm font-normal">دج</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-on-surface-variant font-medium">الرصيد المتبقي المستحق</span>
        <div
          className={`text-headline-md font-bold font-mono mt-2 ${
            stats.isSettled ? 'text-emerald-700' : 'text-error'
          }`}
        >
          {(stats.totalDue / 100).toLocaleString('ar-DZ')}{' '}
          <span className="text-body-sm font-normal">دج</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-on-surface-variant font-medium">حالة الحساب المالي</span>
        <div className="mt-2">
          <span
            className={`px-3 py-1 rounded-xl text-label-sm font-bold inline-block ${
              stats.isSettled
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {stats.isSettled ? 'خالص ومسدد' : 'توجد مستحقات متأخرة'}
          </span>
        </div>
      </div>
    </div>
  )
}
