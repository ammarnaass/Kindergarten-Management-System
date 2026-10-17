import React from 'react'
import type { ParentsStats } from '../types'

interface ParentsKpiGridProps {
  stats: ParentsStats
}

export const ParentsKpiGrid: React.FC<ParentsKpiGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* Card 1 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/20 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">أولياء الأمور المسجلين</span>
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">family_restroom</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
            {stats.total}
          </span>
          <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            100% موثقين
          </span>
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full rounded-full w-full" />
        </div>
        <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-2">
          <span>{stats.fathersCount} أب</span>
          <span>{stats.mothersCount} أم</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/20 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">جهات اتصال الطوارئ</span>
          <span className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">emergency</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
            {stats.emergencyCount}
          </span>
          <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-0.5 bg-tertiary/10 px-2 py-0.5 rounded-md font-semibold">
            <span className="material-symbols-outlined text-[14px]">phone_in_talk</span>
            استجابة سريعة
          </span>
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-tertiary h-full rounded-full" style={{ width: '85%' }} />
        </div>
        <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-2">
          <span>أقارب من الدرجة الأولى</span>
          <span>محدثة للفصل الحالي</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/20 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">المفوضون بالاستلام الساري</span>
          <span className="w-8 h-8 rounded-lg bg-secondary-container/30 text-on-secondary-container flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
            {stats.totalPickups}
          </span>
          <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 bg-secondary-container/20 px-2 py-0.5 rounded-md font-semibold">
            <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
            بطاقات مشفرة
          </span>
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-secondary-container h-full rounded-full" style={{ width: '70%' }} />
        </div>
        <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-2">
          <span>أقارب وسائقين معتمدين</span>
          <span>سارية الصلاحية</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/20 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">قناة الإرسال الداخلي</span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-display-lg text-display-lg text-primary tracking-tight font-bold">
            100%
          </span>
          <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 bg-surface-container px-2 py-0.5 rounded-md font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            مودم جاهز
          </span>
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full rounded-full w-full" />
        </div>
        <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-2">
          <span>شريحة STC أعمال</span>
          <span>بدون انقطاع</span>
        </div>
      </div>
    </div>
  )
}
