import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api/ipc'
import type { ClassroomItem, ClassroomStudent, AttendanceStatus, TimetableActivePeriod, PickupAlertItem } from '../types'

export function useClassroomLiveMode(selectedClassroomId: string | null, classrooms: ClassroomItem[]) {
  const queryClient = useQueryClient()
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchStudentQuery, setSearchStudentQuery] = useState('')
  const [selectedChildForQuickAction, setSelectedChildForQuickAction] = useState<ClassroomStudent | null>(null)
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [undoToast, setUndoToast] = useState<{ message: string; prevStates: { id: string; status: AttendanceStatus }[] } | null>(null)
  const [pickupAlerts, setPickupAlerts] = useState<PickupAlertItem[]>([])

  const currentClassroom = useMemo(() => {
    return classrooms.find((c) => c.id === selectedClassroomId) ?? classrooms[0] ?? null
  }, [classrooms, selectedClassroomId])

  // 1. Fetch children with today's attendance & daily status
  const { data: students = [], isLoading: isLoadingStudents, refetch: refetchStudents } = useQuery<ClassroomStudent[]>({
    queryKey: ['classroom:students', currentClassroom?.id, todayStr],
    enabled: !!currentClassroom?.id,
    queryFn: async () => {
      if (!currentClassroom?.id) return []
      const res = await api.daily.listByClassroom(currentClassroom.id, todayStr)
      return (res || []) as ClassroomStudent[]
    }
  })

  // 2. Fetch timetable periods to detect current active period
  const { data: periods = [] } = useQuery<TimetableActivePeriod[]>({
    queryKey: ['timetable:periods', currentClassroom?.id],
    queryFn: async () => {
      const res = await api.timetable.listPeriods(currentClassroom?.id)
      return (res || []) as TimetableActivePeriod[]
    }
  })

  // Calculate current active period based on local time
  const currentPeriod = useMemo<TimetableActivePeriod | null>(() => {
    if (!periods.length) return null
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    for (const p of periods) {
      if (!p.startTime || !p.endTime) continue
      const [sh, sm] = p.startTime.split(':').map(Number)
      const [eh, em] = p.endTime.split(':').map(Number)
      const startMin = sh * 60 + sm
      const endMin = eh * 60 + em
      if (nowMinutes >= startMin && nowMinutes <= endMin) {
        return p
      }
    }
    return periods[0] ?? null
  }, [periods])

  // 3. Mark single child attendance
  const markAttendanceMutation = useMutation({
    mutationFn: async ({ childId, status }: { childId: string; status: AttendanceStatus }) => {
      await api.attendance.mark(todayStr, [
        {
          childId,
          status: status === 'unknown' ? 'present' : status,
          checkInAt: status === 'present' || status === 'late' ? Date.now() : undefined
        }
      ])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom:students', currentClassroom?.id] })
      queryClient.invalidateQueries({ queryKey: ['classrooms:list'] })
    }
  })

  // Batch mark all present
  const markAllPresent = useCallback(async () => {
    if (!students.length) return
    const prevStates = students.map((s) => ({ id: s.id, status: s.attendanceStatus }))

    const entries = students.map((s) => ({
      childId: s.id,
      status: 'present' as const,
      checkInAt: Date.now()
    }))

    await api.attendance.mark(todayStr, entries)
    queryClient.invalidateQueries({ queryKey: ['classroom:students', currentClassroom?.id] })
    queryClient.invalidateQueries({ queryKey: ['classrooms:list'] })

    setUndoToast({
      message: `تم تحديد جميع الأطفال (${students.length}) كـ "حاضر" بنجاح`,
      prevStates
    })
    setTimeout(() => {
      setUndoToast(null)
    }, 6000)
  }, [students, todayStr, currentClassroom?.id, queryClient])

  // Undo batch action
  const executeUndo = useCallback(async () => {
    if (!undoToast?.prevStates?.length) return
    const entries = undoToast.prevStates.map((s) => ({
      childId: s.id,
      status: (s.status === 'unknown' ? 'absent' : s.status) as 'present' | 'absent' | 'late' | 'excused'
    }))
    await api.attendance.mark(todayStr, entries)
    setUndoToast(null)
    queryClient.invalidateQueries({ queryKey: ['classroom:students', currentClassroom?.id] })
    queryClient.invalidateQueries({ queryKey: ['classrooms:list'] })
  }, [undoToast, todayStr, currentClassroom?.id, queryClient])

  // Save quick log (meal, nap, potty, note)
  const saveQuickLog = useCallback(
    async (logData: {
      childId: string
      category: 'meal' | 'nap' | 'potty' | 'behavior' | 'activity'
      value: string
      note?: string
    }) => {
      await api.daily.save({
        childId: logData.childId,
        date: todayStr,
        items: [
          {
            category: logData.category,
            value: logData.value,
            note: logData.note || undefined
          }
        ]
      })
      queryClient.invalidateQueries({ queryKey: ['classroom:students', currentClassroom?.id] })
      setSelectedChildForQuickAction(null)
    },
    [todayStr, currentClassroom?.id, queryClient]
  )

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filterStatus === 'present' && s.attendanceStatus !== 'present') return false
      if (filterStatus === 'absent' && s.attendanceStatus !== 'absent' && s.attendanceStatus !== 'excused') return false
      if (filterStatus === 'late' && s.attendanceStatus !== 'late') return false
      if (filterStatus === 'alerts' && !s.allergies && !s.medicalNotes) return false

      if (searchStudentQuery.trim()) {
        const q = searchStudentQuery.toLowerCase().trim()
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase()
        return fullName.includes(q)
      }
      return true
    })
  }, [students, filterStatus, searchStudentQuery])

  // Live stats for this classroom
  const stats = useMemo(() => {
    const total = students.length
    let present = 0
    let absent = 0
    let late = 0
    let withAlerts = 0

    for (const s of students) {
      if (s.attendanceStatus === 'present') present++
      else if (s.attendanceStatus === 'absent' || s.attendanceStatus === 'excused') absent++
      else if (s.attendanceStatus === 'late') late++

      if (s.allergies || s.medicalNotes) withAlerts++
    }

    return { total, present, absent, late, withAlerts }
  }, [students])

  const dismissPickupAlert = (id: string) => {
    setPickupAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  return {
    currentClassroom,
    students: filteredStudents,
    rawStudents: students,
    stats,
    currentPeriod,
    isLoadingStudents,
    filterStatus,
    setFilterStatus,
    searchStudentQuery,
    setSearchStudentQuery,
    selectedChildForQuickAction,
    setSelectedChildForQuickAction,
    isTimerOpen,
    setIsTimerOpen,
    undoToast,
    pickupAlerts,
    dismissPickupAlert,
    markAttendance: markAttendanceMutation.mutateAsync,
    markAllPresent,
    executeUndo,
    saveQuickLog,
    refetchStudents
  }
}
