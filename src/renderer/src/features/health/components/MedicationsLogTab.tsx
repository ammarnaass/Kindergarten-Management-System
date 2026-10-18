import React from 'react'
import type { MedicationLogItem } from '../types'

interface MedicationsLogTabProps {
  medications: MedicationLogItem[]
  isLoading: boolean
}

export const MedicationsLogTab: React.FC<MedicationsLogTabProps> = ({ medications, isLoading }) => {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[700px] text-right border-collapse text-xs">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
            <th className="py-3 px-4">الطفل</th>
            <th className="py-3 px-4">الفصل</th>
            <th className="py-3 px-4">الدواء المعطى</th>
            <th className="py-3 px-4">الجرعة</th>
            <th className="py-3 px-4">وقت الإعطاء</th>
            <th className="py-3 px-4">المسؤول عن الإعطاء</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                <p>جاري جلب سجل الأدوية...</p>
              </td>
            </tr>
          ) : medications.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl text-outline mb-1">medication</span>
                <p className="font-bold text-on-surface">لا توجد جرعات أدوية مسجلة اليوم</p>
                <p className="text-2xs mt-1">اضغط F3 لتوثيق إعطاء دواء بتفويض</p>
              </td>
            </tr>
          ) : (
            medications.map((m) => (
              <tr key={m.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="py-3 px-4 font-bold text-on-surface">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-2xs">
                      {m.childFirstName ? m.childFirstName[0] : 'د'}
                    </div>
                    <span>{m.childFirstName} {m.childLastName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{m.classroomName || '—'}</td>
                <td className="py-3 px-4 font-bold text-secondary">{m.medicine}</td>
                <td className="py-3 px-4 font-semibold text-on-surface">{m.dose || '—'}</td>
                <td className="py-3 px-4 font-mono text-on-surface-variant">{m.givenAt}</td>
                <td className="py-3 px-4 text-on-surface-variant">{m.givenBy || 'ممرضة الروضة'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
