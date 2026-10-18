import React from 'react'
import type { HealthStats } from '../types'

interface HealthStatsCardsProps {
  stats?: HealthStats
}

export const HealthStatsCards: React.FC<HealthStatsCardsProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* KPI 1: Critical Allergies */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="font-caption text-caption text-on-surface-variant block">حالات حرجة ومزمنة</span>
            <span className="font-bold text-sm text-on-surface">تنبيهات الحساسية</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display-lg text-display-lg font-bold text-rose-600">
              {stats?.criticalAllergiesCount ?? 0}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">أطفال مسجلين</span>
          </div>
          <span className="font-caption text-2xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
            مطبخ الروضة مفعّل
          </span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: '100%' }} />
        </div>
        <span className="font-caption text-2xs text-on-surface-variant mt-1.5 truncate">
          متابعة فورية لقوائم الوجبات المدرسية
        </span>
      </div>

      {/* KPI 2: Medication Dispensing */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="font-caption text-caption text-on-surface-variant block">إعطاء الأدوية بتفويض</span>
            <span className="font-bold text-sm text-on-surface">جرعات اليوم الموثقة</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">medication_liquid</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display-lg text-display-lg font-bold text-on-surface">
              {stats?.medicationsTodayCount ?? 0}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">جرعات مسجلة</span>
          </div>
          <span className="font-label-sm text-2xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
            بتفويض معتمد
          </span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '85%' }} />
        </div>
        <span className="font-caption text-2xs text-amber-800 mt-1.5 truncate flex items-center gap-1 font-semibold">
          <span className="material-symbols-outlined text-xs">alarm</span>
          توثيق دقيق للاسم والجرعة
        </span>
      </div>

      {/* KPI 3: Clinic Visits Today */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="font-caption text-caption text-on-surface-variant block">حركة الاستقبال والعلاج</span>
            <span className="font-bold text-sm text-on-surface">مراجعات العيادة اليوم</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">airline_seat_recline_normal</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display-lg text-display-lg font-bold text-primary">
              {stats?.clinicVisitsTodayCount ?? 0}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">حالات مفحوصة</span>
          </div>
          <span className="font-label-sm text-2xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-md font-semibold">
            مستقرة
          </span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }} />
        </div>
        <span className="font-caption text-2xs text-on-surface-variant mt-1.5 truncate">
          قياس حرارة • إسعاف أولي • فحص
        </span>
      </div>

      {/* KPI 4: First Aid Readiness */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="font-caption text-caption text-on-surface-variant block">حقيبة الطوارئ والإسعاف</span>
            <span className="font-bold text-sm text-on-surface">جاهزية العيادة</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display-lg text-display-lg font-bold text-emerald-600">98%</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">جاهزية كاملة</span>
          </div>
          <span className="font-caption text-2xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            جاهز
          </span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '98%' }} />
        </div>
        <span className="font-caption text-2xs text-on-surface-variant mt-1.5 truncate">
          مستلزمات الضماد والأدوية مكتملة
        </span>
      </div>
    </section>
  )
}
