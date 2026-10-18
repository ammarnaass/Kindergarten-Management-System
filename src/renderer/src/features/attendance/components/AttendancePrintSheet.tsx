import React from 'react'
import type { StudentAttendanceItem, ClassroomItem } from '../types'
import { formatArabicDate } from '../utils/dateHelpers'

interface AttendancePrintSheetProps {
  students: StudentAttendanceItem[]
  activeClassroom?: ClassroomItem
  selectedDate: string
}

export const AttendancePrintSheet: React.FC<AttendancePrintSheetProps> = ({
  students,
  activeClassroom,
  selectedDate,
}) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans dir-rtl">
      <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">روضتي — كشف الحضور والانصراف اليومي</h1>
          <p className="text-sm mt-1">
            الفصل: <span className="font-bold">{activeClassroom?.name ?? '—'}</span> ({activeClassroom?.room ?? ''})
          </p>
        </div>
        <div className="text-left font-mono">
          <p className="font-bold text-lg">{selectedDate}</p>
          <p className="text-sm">{formatArabicDate(selectedDate)}</p>
        </div>
      </div>

      <table className="w-full text-right border-collapse border border-gray-400 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 p-2 w-12 text-center">#</th>
            <th className="border border-gray-400 p-2">اسم الطفل</th>
            <th className="border border-gray-400 p-2 w-28 text-center">الحالة</th>
            <th className="border border-gray-400 p-2 w-28 text-center">وقت الحضور</th>
            <th className="border border-gray-400 p-2">تنبيه صحي / ملاحظات</th>
            <th className="border border-gray-400 p-2 w-32 text-center">توقيع المستلم</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={s.id} className="border-b border-gray-300">
              <td className="border border-gray-400 p-2 text-center font-mono">{idx + 1}</td>
              <td className="border border-gray-400 p-2 font-bold">{s.name}</td>
              <td className="border border-gray-400 p-2 text-center">
                {s.status === 'present'
                  ? 'حاضر'
                  : s.status === 'absent'
                    ? 'غائب'
                    : s.status === 'late'
                      ? 'متأخر'
                      : 'غير مسجل'}
              </td>
              <td className="border border-gray-400 p-2 text-center font-mono">{s.checkInTime || '—'}</td>
              <td className="border border-gray-400 p-2">{s.medicalAlert || '—'}</td>
              <td className="border border-gray-400 p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-300">
        <div>
          <p className="text-sm font-semibold">توقيع المعلمة المعتمدة:</p>
          <div className="h-16 w-48 border-b border-dashed border-gray-400 mt-2" />
        </div>
        <div>
          <p className="text-sm font-semibold">ختم وتوقيع إدارة الروضة:</p>
          <div className="h-16 w-48 border-b border-dashed border-gray-400 mt-2" />
        </div>
      </div>
    </div>
  )
}
