import React from 'react'
import type { StaffStats } from '../types'

interface StaffKpiMetricsProps {
  stats: StaffStats | null
  attendanceRate: number
  selectedDate: string
}

export const StaffKpiMetrics: React.FC<StaffKpiMetricsProps> = ({
  stats,
  attendanceRate,
  selectedDate
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
      {/* 1. Total Staff */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="font-label-md text-label-md font-semibold">إجمالي الكادر النشط</span>
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-display-md font-display-md text-on-surface font-bold">
            {stats?.activeCount ?? 0}
          </span>
          <span className="text-caption font-caption text-on-surface-variant">
            من أصل {stats?.totalCount ?? 0} موظف مسجل
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-caption font-caption text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span>معلمات وإداريات وعاملات</span>
        </div>
      </div>

      {/* 2. Present Today */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="font-label-md text-label-md font-semibold">الحاضرون اليوم</span>
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-display-md font-display-md text-primary font-bold">
            {stats?.presentCount ?? 0}
          </span>
          <span className="text-caption font-caption text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
            {attendanceRate}% نسبة الحضور
          </span>
        </div>
        <div className="mt-2 text-caption font-caption text-on-surface-variant font-mono">
          بتاريخ: {selectedDate}
        </div>
      </div>

      {/* 3. Absent / Late / Leaves */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="font-label-md text-label-md font-semibold">غياب وتأخير وإجازات</span>
          <span className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <div className="flex items-center gap-1">
            <span className="text-headline-md font-headline-md text-secondary font-bold">
              {stats?.lateCount ?? 0}
            </span>
            <span className="text-caption font-caption text-on-surface-variant">متأخر</span>
          </div>
          <span className="text-outline-variant">•</span>
          <div className="flex items-center gap-1">
            <span className="text-headline-md font-headline-md text-error font-bold">
              {stats?.absentCount ?? 0}
            </span>
            <span className="text-caption font-caption text-on-surface-variant">غائب</span>
          </div>
          <span className="text-outline-variant">•</span>
          <div className="flex items-center gap-1">
            <span className="text-headline-md font-headline-md text-primary font-bold">
              {stats?.activeLeavesCount ?? 0}
            </span>
            <span className="text-caption font-caption text-on-surface-variant">إجازة</span>
          </div>
        </div>
        <div className="mt-2 text-caption font-caption text-on-surface-variant">
          متابعة فورية للمناوبات اليومية
        </div>
      </div>

      {/* 4. Monthly Payroll Estimate */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span className="font-label-md text-label-md font-semibold">مسير الرواتب الشهري</span>
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-headline-lg font-headline-lg text-primary font-bold">
            {((stats?.payrollCents ?? 0) / 100).toLocaleString('ar-SA')}
          </span>
          <span className="text-caption font-caption text-on-surface-variant font-semibold">
            ريال / شهرياً
          </span>
        </div>
        <div className="mt-2 text-caption font-caption text-on-surface-variant">
          إجمالي الرواتب الأساسية للكادر النشط
        </div>
      </div>
    </div>
  )
}
