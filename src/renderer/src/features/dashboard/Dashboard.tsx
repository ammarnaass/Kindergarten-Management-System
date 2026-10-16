import { useQuery } from '@tanstack/react-query'
import { ipc } from '@/lib/ipc'
import { ExecutiveBanner } from './components/ExecutiveBanner'
import { MetricCardsGrid } from './components/MetricCardsGrid'
import { UrgentAttentionBanner } from './components/UrgentAttentionBanner'
import { ClassroomAttendanceSection } from './components/ClassroomAttendanceSection'
import { RecentTransactionsSection } from './components/RecentTransactionsSection'

export default function Dashboard() {
  const diag = useQuery({
    queryKey: ['diagnostics'],
    queryFn: () => ipc<any>('app:diagnostics'),
  })

  const childrenQuery = useQuery({
    queryKey: ['children-count'],
    queryFn: () => ipc<any>('children:list', { limit: 1 }),
  })

  const totalChildren = childrenQuery.data?.total ?? 52

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-6">
      {/* 1. Executive Top Greeting & Command Ribbon */}
      <ExecutiveBanner teacherName="أ. نادية" />

      {/* 2. KPI Metric Bento Grid */}
      <MetricCardsGrid
        totalCount={totalChildren}
        presentCount={Math.round(totalChildren * 0.9)}
        attendanceRate="90.4%"
        tuitionPercent={84}
        collectedAmount="840,000 دج"
        totalTargetAmount="1,000,000 دج"
        overdueInvoicesCount={12}
        overdueAmount="186,000 دج"
        backupTimeAgo="قبل 45 دقيقة"
      />

      {/* 3. Urgent Action Center Banner */}
      <UrgentAttentionBanner />

      {/* 4. Split Grid Section (60% Classroom Attendance / 40% Recent Financial Transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Right Column (7 cols): Classroom Attendance Overview */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <ClassroomAttendanceSection />
        </div>

        {/* Left Column (5 cols): Recent Financial Transactions */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <RecentTransactionsSection />
        </div>
      </div>
    </div>
  )
}
