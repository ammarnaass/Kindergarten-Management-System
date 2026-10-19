import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

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
          <span className="text-caption text-primary font-medium">نسبة الانضباط</span>
          <div className="text-headline-md font-bold text-primary font-mono mt-2">
            {stats.total > 0 ? `${stats.rate}%` : '—'}
          </div>
        </div>
      </div>

      {/* 2. Detailed Attendance Table Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs space-y-space-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
            <div>
              <h3 className="font-bold text-on-surface text-label-lg">سجل الحضور اليومي للطفل</h3>
              <p className="text-caption text-on-surface-variant">السجلات المعتمدة إلكترونياً المحفوظة محلياً</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-sm font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>فتح كشك التحضير اليومي</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-on-surface-variant font-body-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-primary text-xl">progress_activity</span>
            <span>جاري استرجاع سجلات الحضور...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-14 text-center text-on-surface-variant bg-surface-container-low/30 rounded-xl space-y-2">
            <span className="material-symbols-outlined text-[44px] text-outline mb-1 block">fact_check</span>
            <p className="font-bold text-on-surface text-body-md">لا توجد سجلات حضور مسجلة للطفل «{childName}»</p>
            <p className="text-caption max-w-sm mx-auto text-on-surface-variant">
              يمكنك رصد أول يوم حضور للطفل بسهولة عبر شاشة التحضير اليومي للفصول.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-right border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-3 text-center">وقت الحضور</th>
                  <th className="py-3 px-3 text-center">وقت الانصراف</th>
                  <th className="py-3 px-3 text-center">المستلم</th>
                  <th className="py-3 px-3 text-center">الحالة</th>
                  <th className="py-3 px-4">الملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono">
                {filteredList.map((item: any) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface">{item.date}</td>
                    <td className="py-3 px-3 text-center text-on-surface-variant font-medium">
                      {formatTime(item.checkInAt)}
                    </td>
                    <td className="py-3 px-3 text-center text-on-surface-variant font-medium">
                      {formatTime(item.checkOutAt)}
                    </td>
                    <td className="py-3 px-3 text-center font-sans text-caption text-on-surface">
                      {item.pickedUpBy || '—'}
                    </td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 font-sans text-caption text-on-surface-variant">
                      {item.note || '—'}
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
