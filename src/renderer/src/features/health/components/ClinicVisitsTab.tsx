import React from 'react'
import type { ClinicVisitItem } from '../types'

interface ClinicVisitsTabProps {
  visits: ClinicVisitItem[]
  isLoading: boolean
}

export const ClinicVisitsTab: React.FC<ClinicVisitsTabProps> = ({ visits, isLoading }) => {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[700px] text-right border-collapse text-xs">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
            <th className="py-3 px-4">الطفل</th>
            <th className="py-3 px-4">الفصل</th>
            <th className="py-3 px-4">نوع الفحص</th>
            <th className="py-3 px-4">الأعراض والإجراء المتخذ</th>
            <th className="py-3 px-4">تاريخ المراجعة</th>
            <th className="py-3 px-4">الحساسية المسجلة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                <p>جاري جلب سجل مراجعات العيادة...</p>
              </td>
            </tr>
          ) : visits.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl text-outline mb-1">verified</span>
                <p className="font-bold text-on-surface">لا توجد مراجعات مسجلة في العيادة</p>
                <p className="text-2xs mt-1">اضغط F2 لتسجيل كشف طبي أو قياس حرارة</p>
              </td>
            </tr>
          ) : (
            visits.map((v) => (
              <tr key={v.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="py-3 px-4 font-bold text-on-surface">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-2xs">
                      {v.childFirstName[0]}
                    </div>
                    <span>{v.childFirstName} {v.childLastName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{v.classroomName || '—'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-2xs">
                    {v.kind === 'clinic_visit'
                      ? 'كشف عام'
                      : v.kind === 'temperature_check'
                        ? 'قياس حرارة'
                        : v.kind === 'first_aid'
                          ? 'إسعاف أولي'
                          : v.kind}
                  </span>
                </td>
                <td className="py-3 px-4 text-on-surface max-w-xs">{v.detail}</td>
                <td className="py-3 px-4 font-mono text-on-surface-variant">{v.recordedOn}</td>
                <td className="py-3 px-4">
                  {v.allergies ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 font-bold text-2xs">
                      {v.allergies}
                    </span>
                  ) : (
                    <span className="text-outline text-2xs">لا توجد</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
