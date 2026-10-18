import React from 'react'
import type { ClassroomMetricsData } from '../types'

interface ClassroomsMetricsProps {
  metrics: ClassroomMetricsData
}

export const ClassroomsMetrics: React.FC<ClassroomsMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1: Total Enrolled & Capacity */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xs border border-outline-variant/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">إجمالي المقيدين</span>
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">groups</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display-md text-display-md text-on-surface font-bold font-mono">
            {metrics.totalEnrolled}
          </span>
          <span className="font-caption text-caption text-on-surface-variant">
            من سعة {metrics.totalCapacity}
          </span>
        </div>
        <div className="mt-2 text-[11px] font-caption text-on-surface-variant flex items-center justify-between">
          <span>نسبة الإشغال الإجمالية:</span>
          <span className="font-bold text-primary font-mono">{metrics.utilizationRate}%</span>
        </div>
      </div>

      {/* 2: Attendance Rate */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xs border border-outline-variant/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">نسبة الحضور اليوم</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display-md text-display-md text-emerald-600 dark:text-emerald-400 font-bold font-mono">
            {metrics.averageAttendanceRate}%
          </span>
          <span className="font-caption text-caption text-on-surface-variant">
            ({metrics.presentToday} حاضر)
          </span>
        </div>
        <div className="mt-2 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, metrics.averageAttendanceRate)}%` }}
          />
        </div>
      </div>

      {/* 3: Active Classrooms */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xs border border-outline-variant/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">القاعات والفصول</span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">meeting_room</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display-md text-display-md text-on-surface font-bold font-mono">
            {metrics.totalClassrooms}
          </span>
          <span className="font-caption text-caption text-secondary font-medium">
            فصول دراسية نشطة
          </span>
        </div>
        <div className="mt-2 text-[11px] font-caption text-on-surface-variant">
          مهيأة للشاشات التفاعلية واللمس
        </div>
      </div>

      {/* 4: Absent */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xs border border-outline-variant/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">الغياب اليوم</span>
          <div className={`w-8 h-8 rounded-lg ${metrics.absentToday > 0 ? 'bg-error-container text-error' : 'bg-surface-container-high text-outline'} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[18px]">person_off</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className={`font-display-md text-display-md font-bold font-mono ${metrics.absentToday > 0 ? 'text-error' : 'text-on-surface'}`}>
            {metrics.absentToday}
          </span>
          <span className="font-caption text-caption text-on-surface-variant">
            {metrics.absentToday > 0 ? 'طفل مسجل غائب' : 'حضور كامل'}
          </span>
        </div>
        <div className="mt-2 text-[11px] font-caption text-on-surface-variant">
          مسجل بسجل الحضور المركزي
        </div>
      </div>

      {/* 5: Late */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xs border border-outline-variant/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">المتأخرون</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">avg_time</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display-md text-display-md text-amber-600 dark:text-amber-400 font-bold font-mono">
            {metrics.lateToday}
          </span>
          <span className="font-caption text-caption text-on-surface-variant">
            وصول بعد الطابور
          </span>
        </div>
        <div className="mt-2 text-[11px] font-caption text-on-surface-variant">
          تم توثيق وقت الدخول
        </div>
      </div>
    </div>
  )
}
