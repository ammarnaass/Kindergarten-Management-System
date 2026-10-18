import React from 'react'
import type { CriticalAllergyChild } from '../types'

interface CriticalAllergiesTabProps {
  allergies: CriticalAllergyChild[]
  isLoading: boolean
}

export const CriticalAllergiesTab: React.FC<CriticalAllergiesTabProps> = ({
  allergies,
  isLoading
}) => {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[700px] text-right border-collapse text-xs">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
            <th className="py-3 px-4">اسم الطفل</th>
            <th className="py-3 px-4">الفصل</th>
            <th className="py-3 px-4">تاريخ الميلاد</th>
            <th className="py-3 px-4">نوع الحساسية المسجلة</th>
            <th className="py-3 px-4">ملاحظات طبية وإجراءات الطوارئ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                <p>جاري فحص سجلات الحساسية...</p>
              </td>
            </tr>
          ) : allergies.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                <p className="font-bold text-on-surface">لا توجد حالات حساسية حرجة مسجلة</p>
              </td>
            </tr>
          ) : (
            allergies.map((c) => (
              <tr key={c.id} className="hover:bg-rose-50/40 transition-colors">
                <td className="py-3 px-4 font-bold text-on-surface">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-2xs">
                      !
                    </div>
                    <span>{c.firstName} {c.lastName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{c.classroomName || '—'}</td>
                <td className="py-3 px-4 font-mono text-on-surface-variant">{c.birthDate}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-700 font-bold text-2xs">
                    {c.allergies}
                  </span>
                </td>
                <td className="py-3 px-4 text-on-surface max-w-sm">
                  {c.medicalNotes || 'اتخاذ الحيطة في الوجبات والتواصل الفوري مع ولي الأمر عند ظهور أعراض'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
