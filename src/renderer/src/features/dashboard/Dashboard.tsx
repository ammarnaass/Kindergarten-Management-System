import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ExecutiveBanner } from './components/ExecutiveBanner'
import { MetricCardsGrid } from './components/MetricCardsGrid'
import { UrgentAttentionBanner } from './components/UrgentAttentionBanner'
import { ClassroomAttendanceSection } from './components/ClassroomAttendanceSection'
import { RecentTransactionsSection } from './components/RecentTransactionsSection'

export default function Dashboard() {
  const today = new Date().toISOString().slice(0, 10)

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard:stats'],
    queryFn: () => api.dashboard.stats(),
    refetchInterval: 30_000 // تحديث كل 30 ثانية
  })

  const { data: classroomStats } = useQuery({
    queryKey: ['classrooms:attendance', today],
    queryFn: () => api.classrooms.attendance(today),
    refetchInterval: 60_000
  })

  const { data: recentPayments } = useQuery({
    queryKey: ['payments:recent'],
    queryFn: () => api.finance.recentPayments(8),
    refetchInterval: 30_000
  })

  const { data: birthdays } = useQuery({
    queryKey: ['children:birthdaysSoon'],
    queryFn: () => api.children.birthdaysSoon(7)
  })

  const { data: diag } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: () => api.diagnostics.get(),
    refetchInterval: 120_000
  })

  // التاريخ الهجري / الميلادي بالعربية
  const dateString = new Date().toLocaleDateString('ar-DZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-6">
      {/* 1. شريط الترحيب والأوامر السريعة */}
      <ExecutiveBanner dateString={dateString} />

      {/* 2. بطاقات المؤشرات الرئيسية */}
      <MetricCardsGrid
        isLoading={statsLoading}
        totalChildren={stats?.totalChildren ?? 0}
        presentCount={stats?.presentToday ?? 0}
        absentCount={stats?.absentToday ?? 0}
        lateCount={stats?.lateToday ?? 0}
        attendanceRate={stats ? `${stats.attendanceRate}%` : '—'}
        tuitionPercent={stats?.tuitionPercent ?? 0}
        collectedAmountCents={stats?.collectedThisMonthCents ?? 0}
        totalTargetAmountCents={stats?.totalTargetThisMonthCents ?? 0}
        overdueInvoicesCount={stats?.overdueInvoicesCount ?? 0}
        overdueAmountCents={stats?.overdueAmountCents ?? 0}
        dbSizeBytes={diag?.dbSize ?? 0}
        backupsCount={diag?.backups ?? 0}
      />

      {/* 3. مركز الانتباه العاجل */}
      <UrgentAttentionBanner
        overdueInvoicesCount={stats?.overdueInvoicesCount ?? 0}
        birthdays={birthdays ?? []}
      />

      {/* 4. شبكة مزدوجة: حضور الفصول + آخر المدفوعات */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <ClassroomAttendanceSection classrooms={classroomStats ?? []} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <RecentTransactionsSection payments={recentPayments ?? []} />
        </div>
      </div>
    </div>
  )
}
