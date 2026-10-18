import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { AttendanceStatus, StudentAttendanceItem, AttendanceCounts } from '../types'
import { formatCheckInTime } from '../utils/dateHelpers'

export function useAttendanceData() {
  const queryClient = useQueryClient()

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [activeClassroomId, setActiveClassroomId] = useState<string>('')
  const [students, setStudents] = useState<StudentAttendanceItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. Fetch classrooms
  const { data: classrooms = [], isLoading: classroomsLoading } = useQuery({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list(),
  })

  // Auto-select first classroom
  useEffect(() => {
    if (classrooms.length > 0 && (!activeClassroomId || !classrooms.some((c) => c.id === activeClassroomId))) {
      setActiveClassroomId(classrooms[0].id)
    }
  }, [classrooms, activeClassroomId])

  const activeClassroom = useMemo(() => {
    return classrooms.find((c) => c.id === activeClassroomId)
  }, [classrooms, activeClassroomId])

  // 2. Fetch children in active classroom
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ['children:list', { classroomId: activeClassroomId }],
    queryFn: () =>
      api.children.list({
        classroomId: activeClassroomId,
        status: 'active',
        limit: 100,
        offset: 0,
      }),
    enabled: Boolean(activeClassroomId),
  })

  // 3. Fetch attendance records for selected date
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance:records', selectedDate],
    queryFn: () => api.attendance.list({ date: selectedDate }),
  })

  // 4. Merge children with attendance records
  useEffect(() => {
    if (!childrenData?.items) {
      setStudents([])
      return
    }

    const attendanceMap = new Map<string, any>()
    for (const record of attendanceRecords) {
      if (record && record.childId) {
        attendanceMap.set(record.childId, record)
      }
    }

    const mapped: StudentAttendanceItem[] = childrenData.items.map((c) => {
      const rec = attendanceMap.get(c.id)
      return {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        photo: c.photoPath,
        medicalAlert: c.allergies || c.medicalNotes || null,
        status: (rec?.status as AttendanceStatus) || 'unmarked',
        checkInTime: rec?.checkInAt ? formatCheckInTime(rec.checkInAt) : null,
      }
    })

    setStudents(mapped)
    setIsSaved(false)
    setErrorMessage(null)
  }, [childrenData, attendanceRecords])

  // Header quick counts
  const counts: AttendanceCounts = useMemo(() => {
    const present = students.filter((s) => s.status === 'present').length
    const absent = students.filter((s) => s.status === 'absent').length
    const late = students.filter((s) => s.status === 'late').length
    const unmarked = students.filter((s) => s.status === 'unmarked').length
    return { present, absent, late, unmarked, total: students.length }
  }, [students])

  // Change status of individual child
  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setIsSaved(false)
    setErrorMessage(null)
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const time =
          status === 'present' || status === 'late'
            ? s.checkInTime || new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
            : null
        return { ...s, status, checkInTime: time }
      })
    )
  }

  // Mark all present
  const handleMarkAllPresent = () => {
    setIsSaved(false)
    setErrorMessage(null)
    const nowTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'present',
        checkInTime: s.checkInTime || nowTime,
      }))
    )
  }

  // Commit attendance to SQLite
  const handleCommitAttendance = useCallback(async () => {
    if (students.length === 0) return
    setIsSaving(true)
    setErrorMessage(null)
    try {
      const allEntries = students.map((s) => ({
        childId: s.id,
        status: (s.status === 'unmarked' ? 'absent' : s.status) as 'present' | 'absent' | 'late' | 'excused',
        checkInAt: s.status === 'present' || s.status === 'late' ? Date.now() : null,
      }))

      await api.attendance.mark(selectedDate, allEntries)
      setIsSaved(true)

      toast({
        title: 'تم اعتماد الحضور',
        description: `تم حفظ حضور ${allEntries.length} طفلاً لفصل ${activeClassroom?.name ?? ''} بنجاح`,
        variant: 'success',
      })

      await queryClient.invalidateQueries({ queryKey: ['attendance:records'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard:stats'] })
      await queryClient.invalidateQueries({ queryKey: ['classrooms:attendance'] })

      setTimeout(() => setIsSaved(false), 4000)
    } catch (err: any) {
      const msg = err.message || 'فشل في حفظ سجل الحضور'
      setErrorMessage(msg)
      toast({
        title: 'خطأ أثناء الحفظ',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [students, selectedDate, activeClassroom, queryClient])

  // Ctrl+S / Cmd+S shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleCommitAttendance()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCommitAttendance])

  const isLoading = classroomsLoading || childrenLoading || attendanceLoading

  return {
    selectedDate,
    setSelectedDate,
    activeClassroomId,
    setActiveClassroomId,
    activeClassroom,
    classrooms,
    students,
    counts,
    isLoading,
    isSaving,
    isSaved,
    errorMessage,
    handleStatusChange,
    handleMarkAllPresent,
    handleCommitAttendance,
  }
}
