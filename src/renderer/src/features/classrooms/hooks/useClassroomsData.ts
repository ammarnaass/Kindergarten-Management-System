import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api/ipc'
import type { ClassroomItem, ClassroomMetricsData } from '../types'

export function useClassroomsData() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: classrooms = [], isLoading, isError, refetch } = useQuery<ClassroomItem[]>({
    queryKey: ['classrooms:list'],
    queryFn: async () => {
      const res = await api.classrooms.list()
      return (res || []) as ClassroomItem[]
    }
  })

  const { data: staffList = [] } = useQuery({
    queryKey: ['staff:list'],
    queryFn: async () => {
      const res = await api.staff.list({ isActive: true })
      return (res || []) as any[]
    }
  })

  const createMutation = useMutation({
    mutationFn: (input: { name: string; capacity?: number; room?: string | null; teacherId?: string | null }) =>
      api.classrooms.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms:list'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (input: { id: string; name?: string; capacity?: number; room?: string | null; teacherId?: string | null }) =>
      api.classrooms.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms:list'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.classrooms.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms:list'] })
    }
  })

  const metrics: ClassroomMetricsData = useMemo(() => {
    const totalClassrooms = classrooms.length
    let totalEnrolled = 0
    let totalCapacity = 0
    let presentToday = 0
    let absentToday = 0
    let lateToday = 0

    for (const c of classrooms) {
      totalEnrolled += c.totalChildren || 0
      totalCapacity += c.capacity || 20
      presentToday += c.presentCount || 0
      absentToday += c.absentCount || 0
      lateToday += c.lateCount || 0
    }

    const averageAttendanceRate = totalEnrolled > 0
      ? Math.round(((presentToday + lateToday) / totalEnrolled) * 1000) / 10
      : 0

    const utilizationRate = totalCapacity > 0
      ? Math.round((totalEnrolled / totalCapacity) * 1000) / 10
      : 0

    return {
      totalClassrooms,
      totalEnrolled,
      totalCapacity,
      averageAttendanceRate,
      presentToday,
      absentToday,
      lateToday,
      utilizationRate
    }
  }, [classrooms])

  const filteredClassrooms = useMemo(() => {
    if (!searchQuery.trim()) return classrooms
    const q = searchQuery.toLowerCase().trim()
    return classrooms.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.room && c.room.toLowerCase().includes(q)) ||
      (c.teacher && c.teacher.name.toLowerCase().includes(q))
    )
  }, [classrooms, searchQuery])

  return {
    classrooms: filteredClassrooms,
    allClassrooms: classrooms,
    staffList,
    metrics,
    isLoading,
    isError,
    refetch,
    searchQuery,
    setSearchQuery,
    createClassroom: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateClassroom: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteClassroom: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  }
}
