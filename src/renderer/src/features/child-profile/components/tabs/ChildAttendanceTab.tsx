import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ChildAttendanceKpiCards } from './ChildAttendanceKpiCards'

interface ChildAttendanceTabProps {
  childId: string
  childName: string
}

export function ChildAttendanceTab({ childId, childName }: ChildAttendanceTabProps) {
  const navigate = useNavigate()
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  const { data: attendanceList = [], isLoading } = useQuery({
    queryKey: ['attendance:child', childId],
    queryFn: () => (childId ? api.attendance.list({ childId }) : Promise.resolve([])),
    enabled: Boolean(childId)
  })

  // Filter by selected month if chosen
  const filteredList = useMemo(() => {
    if (!selectedMonth) return attendanceList
    return attendanceList.filter((a: any) => a.date?.startsWith(selectedMonth))
  }, [attendanceList, selectedMonth])

  // Compute live statistics
  const stats = useMemo(() => {
    const total = attendanceList.length
    if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 0 }
    const present = attendanceList.filter((a: any) => a.status === 'present').length
    const late = attendanceList.filter((a: any) => a.status === 'late').length
    const absent = attendanceList.filter((a: any) => a.status === 'absent').length
    const excused = attendanceList.filter((a: any) => a.status === 'excused').length
    const rate = Math.round(((present + late) / total) * 100)
    return { total, present, absent, late, excused, rate }
  }, [attendanceList])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
            حاضر
          </span>
        )
      case 'late':
        return (
          <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-amber-50 text-amber-800 border border-amber-200">
            متأخر
          </span>
        )
      case 'excused':
        return (
          <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-indigo-50 text-indigo-800 border border-indigo-200">
            غياب بعذر
          </span>
        )
      case 'absent':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-rose-50 text-rose-800 border border-rose-200">
            غياب
          </span>
        )
    }
  }

  const formatTime = (ts?: number | string | null) => {
    if (!ts) return '—'
    try {
      const d = new Date(ts)
      return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return '—'
    }
  }

  return (
    <div className="space-y-space-lg select-none animate-in fade-in duration-200">
      {/* 1. Attendance Metrics KPI Cards */}
      <ChildAttendanceKpiCards stats={stats} />

      {/* 2. Detailed History Table */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-outline-variant/30">
          <div>
            <h3 className="font-bold text-on-surface text-label-lg">سجل الحضور الشهري للطفل</h3>
            <p className="text-caption text-on-surface-variant">
              الأيام المسجلة، أوقات الحضور والانصراف، وأسماء مستلمي الطفل «{childName}»
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-caption font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              onClick={() => navigate('/attendance')}
              className="px-3.5 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-caption font-semibold transition-colors flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              <span>سجل التحضير العام</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">
              progress_activity
            </span>
            <span className="text-body-sm text-on-surface-variant">جاري تحميل سجلات الحضور...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-3">
              <span className="material-symbols-outlined text-3xl">event_busy</span>
            </div>
            <h4 className="font-bold text-on-surface text-body-lg">لا توجد سجلات حضور مسجلة</h4>
            <p className="text-caption text-on-surface-variant max-w-sm mt-1">
              لم يتم تسجيل أي حضور أو انصراف لهذا الطفل في الفترة المحددة حتى الآن.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-caption font-bold border-b border-outline-variant/30">
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">وقت الحضور</th>
                  <th className="py-3 px-4">وقت الانصراف</th>
                  <th className="py-3 px-4">الشخص المستلم</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">الملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-body-sm">
                {filteredList.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-on-surface">{rec.date}</td>
                    <td className="py-3 px-4 text-on-surface font-mono">{formatTime(rec.checkInTime)}</td>
                    <td className="py-3 px-4 text-on-surface font-mono">{formatTime(rec.checkOutTime)}</td>
                    <td className="py-3 px-4 text-on-surface">
                      {rec.pickupPersonName ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <span className="material-symbols-outlined text-sm">badge</span>
                          <span>{rec.pickupPersonName}</span>
                        </span>
                      ) : (
                        <span className="text-on-surface-variant text-caption font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(rec.status)}</td>
                    <td className="py-3 px-4 text-caption text-on-surface-variant">
                      {rec.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
