import React from 'react'
import type { StaffLeaveItem } from '../types'

interface StaffLeavesTabProps {
  isLoading: boolean
  leavesList: StaffLeaveItem[]
  onOpenLeaveModal: () => void
}

export const StaffLeavesTab: React.FC<StaffLeavesTabProps> = ({
  isLoading,
  leavesList,
  onOpenLeaveModal
}) => {
  return (
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-body-sm font-body-sm text-on-surface-variant">
          سجل الإجازات الرسمية والمرضية والاضطرارية لجميع الكوادر
        </span>
        <button
          type="button"
          onClick={onOpenLeaveModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-sm font-semibold shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>طلب إجازة جديد (F4)</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
            progress_activity
          </span>
          <span className="text-body-md">جاري تحميل سجل الإجازات...</span>
        </div>
      ) : leavesList.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-[40px] text-outline">event_available</span>
          <span className="text-headline-sm font-semibold text-on-surface">لا توجد إجازات مسجلة</span>
          <span className="text-body-sm">الكادر مكتمل الحضور دون إجازات معلقة أو سابقة.</span>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin rounded-xl border border-outline-variant/30">
          <table className="w-full min-w-[700px] text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">الموظف</th>
                <th className="py-3 px-4">المسمى الوظيفي</th>
                <th className="py-3 px-4">من تاريخ</th>
                <th className="py-3 px-4">إلى تاريخ</th>
                <th className="py-3 px-4">سبب الإجازة</th>
                <th className="py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {leavesList.map((leave, idx) => (
                <tr key={leave.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 text-caption text-outline font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {leave.staffFirstName} {leave.staffLastName}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">{leave.staffRole}</td>
                  <td className="py-3 px-4 font-mono text-caption text-on-surface">{leave.fromDate}</td>
                  <td className="py-3 px-4 font-mono text-caption text-on-surface">{leave.toDate}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{leave.reason || '—'}</td>
                  <td className="py-3 px-4">
                    {leave.status === 'approved' ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-caption font-semibold">
                        معتمدة
                      </span>
                    ) : leave.status === 'pending' ? (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-caption font-semibold">
                        قيد المراجعة
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-caption font-semibold">
                        مرفوضة
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
