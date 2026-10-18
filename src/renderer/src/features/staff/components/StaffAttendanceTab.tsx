import React from 'react'
import type { StaffAttendanceItem, AttendanceDraftMap, AttendanceStatusType } from '../types'

interface StaffAttendanceTabProps {
  selectedDate: string
  attendanceSheet: StaffAttendanceItem[]
  attendanceDraft: AttendanceDraftMap
  isLoading: boolean
  onStatusChange: (staffId: string, status: AttendanceStatusType) => void
  onNoteChange: (staffId: string, note: string) => void
  onOpenAddStaffModal: () => void
}

export const StaffAttendanceTab: React.FC<StaffAttendanceTabProps> = ({
  selectedDate,
  attendanceSheet,
  attendanceDraft,
  isLoading,
  onStatusChange,
  onNoteChange,
  onOpenAddStaffModal
}) => {
  return (
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-body-sm font-body-sm text-on-surface-variant">
          كشف تسجيل الدوام لتاريخ:{' '}
          <span className="font-semibold text-on-surface font-mono">{selectedDate}</span> — يمكنك تعديل حالة كل موظف مباشرة ثم الضغط على "اعتماد وحفظ الكشف".
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
            progress_activity
          </span>
          <span className="text-body-md">جاري تحميل كشف دوام الكادر...</span>
        </div>
      ) : attendanceSheet.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-3 bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/60">
          <span className="material-symbols-outlined text-[48px] text-outline">group_off</span>
          <span className="text-headline-sm font-semibold text-on-surface">
            لا يوجد كادر نشط مسجل حالياً
          </span>
          <p className="text-body-sm max-w-md text-center">
            قم بإضافة معلمات وموظفين عبر زر "إضافة موظف جديد" لتتمكن من رصد حضورهم وغيابهم اليومي.
          </p>
          <button
            type="button"
            onClick={onOpenAddStaffModal}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md font-semibold text-label-md shadow-sm"
          >
            إضافة أول موظف الآن
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin rounded-xl border border-outline-variant/30">
          <table className="w-full min-w-[700px] text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">الموظف / المعلمة</th>
                <th className="py-3 px-4">المسمى الوظيفي</th>
                <th className="py-3 px-4">الهاتف</th>
                <th className="py-3 px-4 text-center">حالة الحضور</th>
                <th className="py-3 px-4">ملاحظات أو عذر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {attendanceSheet.map((item, idx) => {
                const currentStatus = attendanceDraft[item.staffId]?.status ?? 'present'
                const currentNote = attendanceDraft[item.staffId]?.note ?? ''

                return (
                  <tr
                    key={item.staffId}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-caption text-outline font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-on-surface">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-caption">
                          {item.firstName.charAt(0)}
                        </div>
                        <span>
                          {item.firstName} {item.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-caption font-semibold">
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant font-mono text-caption" dir="ltr">
                      {item.phone || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onStatusChange(item.staffId, 'present')}
                          className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          حاضر
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusChange(item.staffId, 'late')}
                          className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-secondary text-on-secondary shadow-xs'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          متأخر
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusChange(item.staffId, 'absent')}
                          className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-error text-on-error shadow-xs'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          غائب
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusChange(item.staffId, 'excused')}
                          className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                            currentStatus === 'excused'
                              ? 'bg-primary-container text-on-primary-container shadow-xs'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          إجازة / عذر
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={currentNote}
                        onChange={(e) => onNoteChange(item.staffId, e.target.value)}
                        placeholder="ملاحظة أو عذر..."
                        className="w-full px-2.5 py-1 text-caption bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface focus:outline-none focus:border-primary"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
