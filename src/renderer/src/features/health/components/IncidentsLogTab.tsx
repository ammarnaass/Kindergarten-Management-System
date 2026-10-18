import React from 'react'
import type { IncidentItem } from '../types'

interface IncidentsLogTabProps {
  incidents: IncidentItem[]
  isLoading: boolean
}

export const IncidentsLogTab: React.FC<IncidentsLogTabProps> = ({ incidents, isLoading }) => {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[700px] text-right border-collapse text-xs">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
            <th className="py-3 px-4">الطفل</th>
            <th className="py-3 px-4">الفصل</th>
            <th className="py-3 px-4">وقت الحادث</th>
            <th className="py-3 px-4">وصف الواقعة</th>
            <th className="py-3 px-4">الإسعاف الأولي المتخذ</th>
            <th className="py-3 px-4">إشعار ولي الأمر</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                <p>جاري جلب سجل الحوادث...</p>
              </td>
            </tr>
          ) : incidents.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl text-emerald-600 mb-1">
                  sentiment_very_satisfied
                </span>
                <p className="font-bold text-on-surface">الحمد لله، لم تُسجل أي حوادث أو إصابات</p>
                <p className="text-2xs mt-1">يوم آمن وخالٍ من الإصابات في الروضة</p>
              </td>
            </tr>
          ) : (
            incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-rose-50/30 transition-colors">
                <td className="py-3 px-4 font-bold text-on-surface">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-2xs">
                      {inc.childFirstName ? inc.childFirstName[0] : '!'}
                    </div>
                    <span>{inc.childFirstName} {inc.childLastName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{inc.classroomName || '—'}</td>
                <td className="py-3 px-4 font-mono text-on-surface-variant">{inc.happenedAt}</td>
                <td className="py-3 px-4 text-on-surface max-w-xs">{inc.description}</td>
                <td className="py-3 px-4 text-on-surface max-w-xs">{inc.actionTaken || '—'}</td>
                <td className="py-3 px-4">
                  {inc.notifiedGuardian ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-2xs">
                      تم الإشعار هاتفياً
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-2xs">
                      لم يُشعر بعد
                    </span>
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
