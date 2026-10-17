import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { GrowthMetricsBento } from './GrowthMetricsBento'
import { AuditTimelineCard } from './AuditTimelineCard'

interface GrowthAndAuditSectionProps {
  childId?: string
  child?: any
}

export function GrowthAndAuditSection({ childId, child }: GrowthAndAuditSectionProps) {
  const navigate = useNavigate()

  // 1. استعلام الحضور الفعلي للطفل
  const { data: attendanceList = [] } = useQuery({
    queryKey: ['attendance:child', childId],
    queryFn: () => (childId ? api.attendance.list({ childId }) : Promise.resolve([])),
    enabled: Boolean(childId),
  })

  // 2. استعلام الفواتير الفعلية للطفل
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices:child', childId],
    queryFn: () => (childId ? api.finance.listByChild(childId) : Promise.resolve([])),
    enabled: Boolean(childId),
  })

  const attendanceStats = (() => {
    const total = attendanceList.length
    if (total === 0) return { total: 0, present: 0, absent: 0, rate: 100 }
    const present = attendanceList.filter((a: any) => a.status === 'present' || a.status === 'late').length
    const absent = attendanceList.filter((a: any) => a.status === 'absent').length
    const rate = Math.round((present / total) * 100)
    return { total, present, absent, rate }
  })()

  const financialStats = (() => {
    const totalDueCents = invoices.reduce((acc, inv) => {
      const remaining = inv.remainingCents ?? Math.max(0, inv.totalCents - inv.discountCents - (inv.paidCents ?? 0))
      return acc + remaining
    }, 0)
    const isSettled = totalDueCents === 0
    return {
      dueCents: totalDueCents,
      isSettled,
      invoicesCount: invoices.length,
    }
  })()

  return (
    <div className="flex flex-col gap-space-lg select-none">
      {/* Growth & Health Quick Metrics Bento */}
      <GrowthMetricsBento />

      {/* Attendance & Financial Status Split Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {/* Attendance Widget */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface">سجل الحضور</span>
            <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
          </div>
          <div className="flex items-center gap-space-md">
            {/* Attendance Donut SVG */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${attendanceStats.rate}, 100`}
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-on-surface">
                {attendanceStats.total > 0 ? `${attendanceStats.rate}%` : '—'}
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {attendanceStats.total > 0 ? `${attendanceStats.present} / ${attendanceStats.total} يوم` : 'لا سجلات بعد'}
              </div>
              <p className="font-caption text-caption text-on-surface-variant">
                {attendanceStats.absent > 0 ? `الغياب: ${attendanceStats.absent} أيام` : 'سجل حضور منضبط'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/attendance')}
            className="font-caption text-caption text-primary hover:underline font-semibold flex items-center gap-0.5 justify-end"
            type="button"
          >
            فتح كشف الحضور ←
          </button>
        </div>

        {/* Financial Widget */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface">الملف المالي</span>
            <span
              className={`px-2 py-0.5 rounded font-caption text-caption font-bold ${
                financialStats.isSettled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              {financialStats.isSettled ? 'منتظم ومسوى' : 'مستحقات معلقة'}
            </span>
          </div>
          <div>
            <span className="font-caption text-caption text-on-surface-variant">الرصيد المستحق الحالي</span>
            <div
              className={`font-display-md text-display-md font-bold ${
                financialStats.isSettled ? 'text-emerald-700' : 'text-error'
              }`}
            >
              {(financialStats.dueCents / 100).toLocaleString('ar-DZ')}{' '}
              <span className="font-body-sm text-body-sm font-normal">دج</span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant truncate">
              {invoices.length > 0 ? `${invoices.length} فواتير مسجلة` : 'لا توجد فواتير بعد'}
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-caption text-caption text-outline">
              {financialStats.isSettled ? 'لا توجد متأخرات' : 'يحتاج متابعة السداد'}
            </span>
            <button
              onClick={() => navigate('/finance')}
              className="text-primary hover:text-primary-container font-caption text-caption font-bold"
              type="button"
            >
              تسجيل دفعة
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Snapshot */}
      <AuditTimelineCard child={child} invoices={invoices} />
    </div>
  )
}
