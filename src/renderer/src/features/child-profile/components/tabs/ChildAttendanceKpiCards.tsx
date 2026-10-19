import React from 'react'

interface ChildAttendanceKpiCardsProps {
  stats: {
    total: number
    present: number
    late: number
    absent: number
    rate: number
  }
}

export function ChildAttendanceKpiCards({ stats }: ChildAttendanceKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md">
      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-on-surface-variant font-medium">إجمالي الأيام المسجلة</span>
        <div className="text-headline-md font-bold text-on-surface font-mono mt-2">{stats.total}</div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-emerald-700 font-medium">أيام الحضور</span>
        <div className="text-headline-md font-bold text-emerald-700 font-mono mt-2">{stats.present}</div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-amber-700 font-medium">مرات التأخر</span>
        <div className="text-headline-md font-bold text-amber-700 font-mono mt-2">{stats.late}</div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <span className="text-caption text-rose-700 font-medium">أيام الغياب</span>
        <div className="text-headline-md font-bold text-rose-700 font-mono mt-2">{stats.absent}</div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
        <span className="text-caption text-on-surface-variant font-medium">نسبة الانضباط</span>
        <div className="text-headline-md font-bold text-primary font-mono mt-2">{stats.rate}%</div>
      </div>
    </div>
  )
}
