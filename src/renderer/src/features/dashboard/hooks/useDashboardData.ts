import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useDashboardData() {
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

  return {
    today,
    stats,
    statsLoading,
    classroomStats,
    recentPayments,
    birthdays,
    diag,
    dateString
  }
}
