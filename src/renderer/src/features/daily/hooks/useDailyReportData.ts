import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type {
  ClassroomItem,
  DailyClassroomChild,
  MoodType,
  FoodValue,
  NapValue,
  DailyFilterStatus,
  DailyStats,
  DailyReportFormState
} from '../types'
import { printSingleReport } from '../utils/printSingleReport'

export function useDailyReportData() {
  const queryClient = useQueryClient()
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('')
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [childSearch, setChildSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<DailyFilterStatus>('all')

  // Form State
  const [mood, setMood] = useState<MoodType | null>('happy')
  const [breakfastValue, setBreakfastValue] = useState<FoodValue | null>('full')
  const [breakfastNote, setBreakfastNote] = useState('تناول وجبته كاملة')
  const [lunchValue, setLunchValue] = useState<FoodValue | null>('full')
  const [lunchNote, setLunchNote] = useState('تناول وجبة الغداء كاملة')
  const [snackNote, setSnackNote] = useState('تناول فاكهة وعصير طبيعي')
  const [napValue, setNapValue] = useState<NapValue | null>('good_sleep')
  const [napTime, setNapTime] = useState('12:45 م - 01:45 م')
  const [activities, setActivities] = useState('رسم وتلوين، حفظ قصار السور، ألعاب حركية')
  const [teacherNote, setTeacherNote] = useState('مشاركة ممتازة وتفاعل رائع مع الأقران طوال اليوم.')
  const [guardianNotice, setGuardianNotice] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // 1. Fetch Classrooms
  const { data: classrooms = [] } = useQuery<ClassroomItem[]>({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list()
  })

  // Auto-select first classroom
  useEffect(() => {
    if (classrooms.length > 0 && !selectedClassroomId) {
      setSelectedClassroomId(classrooms[0].id)
    }
  }, [classrooms, selectedClassroomId])

  // 2. Fetch Children for Selected Classroom & Date
  const { data: classroomChildren = [], isLoading: childrenLoading } = useQuery<DailyClassroomChild[]>({
    queryKey: ['daily:listByClassroom', selectedClassroomId, selectedDate],
    queryFn: () =>
      selectedClassroomId
        ? api.daily.listByClassroom(selectedClassroomId, selectedDate)
        : Promise.resolve([]),
    enabled: Boolean(selectedClassroomId)
  })

  // Auto-select first child on classroom/date change
  useEffect(() => {
    if (classroomChildren.length > 0) {
      if (!selectedChildId || !classroomChildren.some((c) => c.id === selectedChildId)) {
        setSelectedChildId(classroomChildren[0].id)
      }
    } else {
      setSelectedChildId(null)
    }
  }, [classroomChildren, selectedChildId])

  const activeChild = useMemo(() => {
    if (!selectedChildId) return null
    return classroomChildren.find((c) => c.id === selectedChildId) ?? null
  }, [classroomChildren, selectedChildId])

  // 3. Fetch Existing Report
  const { data: currentReport, isLoading: reportLoading } = useQuery({
    queryKey: ['daily:get', selectedChildId, selectedDate],
    queryFn: () =>
      selectedChildId ? api.daily.get(selectedChildId, selectedDate) : Promise.resolve(null),
    enabled: Boolean(selectedChildId)
  })

  // Populate form from report data or default
  useEffect(() => {
    if (currentReport) {
      setMood((currentReport.mood as MoodType) || 'happy')
      setTeacherNote(currentReport.summary || '')

      const bItem = currentReport.items?.find((i) => i.category === 'breakfast')
      if (bItem) {
        setBreakfastValue((bItem.value as FoodValue) || 'full')
        setBreakfastNote(bItem.note || '')
      }

      const lItem = currentReport.items?.find((i) => i.category === 'lunch')
      if (lItem) {
        setLunchValue((lItem.value as FoodValue) || 'full')
        setLunchNote(lItem.note || '')
      }

      const sItem = currentReport.items?.find((i) => i.category === 'snack')
      if (sItem) setSnackNote(sItem.note || '')

      const nItem = currentReport.items?.find((i) => i.category === 'nap')
      if (nItem) {
        setNapValue((nItem.value as NapValue) || 'good_sleep')
        setNapTime(nItem.note || '12:45 م - 01:45 م')
      }

      const aItem = currentReport.items?.find((i) => i.category === 'activities')
      if (aItem) setActivities(aItem.note || '')

      const gItem = currentReport.items?.find((i) => i.category === 'guardian_notice')
      if (gItem) setGuardianNotice(gItem.note || '')

      setIsSaved(true)
    } else {
      setMood('happy')
      setBreakfastValue('full')
      setBreakfastNote('تناول وجبته كاملة بنشاط')
      setLunchValue('full')
      setLunchNote('تناول وجبة الغداء بالكامل')
      setSnackNote('تناول فاكهة وعصير طبيعي')
      setNapValue('good_sleep')
      setNapTime('12:45 م - 01:45 م')
      setActivities('رسم وتلوين، حفظ قصار السور، ألعاب حركية')
      setTeacherNote('مشاركة ممتازة وتفاعل إيجابي مع أقرانه.')
      setGuardianNotice('')
      setIsSaved(false)
    }
  }, [currentReport, selectedChildId])

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedChildId) throw new Error('يرجى اختيار طفل')
      return api.daily.save({
        childId: selectedChildId,
        date: selectedDate,
        mood,
        summary: teacherNote,
        items: [
          { category: 'breakfast', value: breakfastValue, note: breakfastNote },
          { category: 'lunch', value: lunchValue, note: lunchNote },
          { category: 'snack', value: 'snack', note: snackNote },
          { category: 'nap', value: napValue, note: napTime },
          { category: 'activities', value: 'educational', note: activities },
          { category: 'guardian_notice', value: 'notice', note: guardianNotice }
        ]
      })
    },
    onSuccess: () => {
      setIsSaved(true)
      queryClient.invalidateQueries({ queryKey: ['daily:listByClassroom'] })
      queryClient.invalidateQueries({ queryKey: ['daily:get', selectedChildId, selectedDate] })
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم حفظ التقرير اليومي للطفل في قاعدة البيانات المحلية'
      })
    },
    onError: (err: any) => {
      toast({
        title: 'فشل الحفظ',
        description: err.message || 'حدث خطأ أثناء حفظ التقرير',
        variant: 'destructive'
      })
    }
  })

  // Quick Stats
  const stats: DailyStats = useMemo(() => {
    const total = classroomChildren.length
    const completed = classroomChildren.filter((c) => c.reportStatus === 'completed').length
    const absent = classroomChildren.filter((c) => c.reportStatus === 'absent').length
    const withAllergies = classroomChildren.filter((c) => Boolean(c.allergies)).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, absent, withAllergies, percent }
  }, [classroomChildren])

  // Filtered Children
  const filteredChildren = useMemo(() => {
    return classroomChildren.filter((c) => {
      const matchName =
        !childSearch ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(childSearch.toLowerCase())

      if (!matchName) return false

      if (filterStatus === 'completed') return c.reportStatus === 'completed'
      if (filterStatus === 'pending')
        return c.reportStatus === 'pending' || c.reportStatus === 'in_progress'
      if (filterStatus === 'absent') return c.reportStatus === 'absent'
      if (filterStatus === 'allergy') return Boolean(c.allergies)
      return true
    })
  }, [classroomChildren, childSearch, filterStatus])

  const formState: DailyReportFormState = useMemo(
    () => ({
      mood,
      breakfastValue,
      breakfastNote,
      lunchValue,
      lunchNote,
      snackNote,
      napValue,
      napTime,
      activities,
      teacherNote,
      guardianNotice,
      isSaved
    }),
    [
      mood,
      breakfastValue,
      breakfastNote,
      lunchValue,
      lunchNote,
      snackNote,
      napValue,
      napTime,
      activities,
      teacherNote,
      guardianNotice,
      isSaved
    ]
  )

  const handlePrint = useCallback(() => {
    if (!activeChild) return
    const activeClassroom = classrooms.find((c) => c.id === selectedClassroomId)
    printSingleReport({
      child: activeChild,
      classroomName: activeClassroom?.name,
      date: selectedDate,
      form: formState
    })
  }, [activeChild, classrooms, selectedClassroomId, selectedDate, formState])

  return {
    selectedDate,
    setSelectedDate,
    selectedClassroomId,
    setSelectedClassroomId,
    selectedChildId,
    setSelectedChildId,
    childSearch,
    setChildSearch,
    filterStatus,
    setFilterStatus,
    activeChild,
    classrooms,
    classroomChildren,
    childrenLoading,
    filteredChildren,
    stats,
    formState,
    setMood,
    setBreakfastValue,
    setBreakfastNote,
    setLunchValue,
    setLunchNote,
    setSnackNote,
    setNapValue,
    setNapTime,
    setActivities,
    setTeacherNote,
    setGuardianNotice,
    isSaving: saveMutation.isPending,
    saveReport: () => saveMutation.mutate(),
    handlePrint
  }
}
