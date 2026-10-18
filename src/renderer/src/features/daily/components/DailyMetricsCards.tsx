import React from 'react'
import type { DailyStats } from '../types'

interface DailyMetricsCardsProps {
  stats: DailyStats
}

export const DailyMetricsCards: React.FC<DailyMetricsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      {/* 1. Completion Percentage */}
      <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
        <div>
          <span className="font-caption text-caption text-outline">اكتمال التقارير</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display-md text-display-md font-bold text-on-surface">
              {stats.percent}%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              ({stats.completed} / {stats.total} طفلاً)
            </span>
          </div>
          <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">pie_chart</span>
        </div>
      </div>

      {/* 2. Pending Reports */}
      <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
        <div>
          <span className="font-caption text-caption text-outline">تقارير بانتظار الإدخال</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display-md text-display-md font-bold text-secondary">
              {Math.max(0, stats.total - stats.completed - stats.absent)}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">أطفال حاضرون</span>
          </div>
          <span className="font-caption text-caption text-outline mt-1 block">جاهزون للتوثيق اليومي</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-2xl">pending_actions</span>
        </div>
      </div>

      {/* 3. Allergies & Medical Alerts */}
      <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
        <div>
          <span className="font-caption text-caption text-outline">تنبيهات الحساسية الطبية</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display-md text-display-md font-bold text-rose-600">
              {stats.withAllergies}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">أطفال بالفصل</span>
          </div>
          <span className="font-caption text-caption text-rose-600 mt-1 block">مراعاة خاصة للوجبات</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
          <span className="material-symbols-outlined text-2xl">medical_services</span>
        </div>
      </div>

      {/* 4. Absent Children */}
      <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
        <div>
          <span className="font-caption text-caption text-outline">الأطفال الغائبون اليوم</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display-md text-display-md font-bold text-on-surface-variant">
              {stats.absent}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">غائب</span>
          </div>
          <span className="font-caption text-caption text-outline mt-1 block">معفى من التقرير</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-2xl">person_off</span>
        </div>
      </div>
    </div>
  )
}
