import React from 'react'
import { useDashboardData } from './hooks/useDashboardData'
import { ExecutiveBanner } from './components/ExecutiveBanner'
import { MetricCardsGrid } from './components/MetricCardsGrid'
import { UrgentAttentionBanner } from './components/UrgentAttentionBanner'
import { ClassroomAttendanceSection } from './components/ClassroomAttendanceSection'
import { RecentTransactionsSection } from './components/RecentTransactionsSection'

export default function Dashboard() {
  const {
    stats,
    statsLoading,
    classroomStats,
    recentPayments,
    birthdays,
    diag,
    dateString
  } = useDashboardData()

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
