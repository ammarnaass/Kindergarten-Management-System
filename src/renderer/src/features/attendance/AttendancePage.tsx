import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { AttendanceHeaderBar } from './components/AttendanceHeaderBar'
import { AttendanceKeypadHint } from './components/AttendanceKeypadHint'
import { StudentAttendanceCard, StudentAttendanceItem, AttendanceStatus } from './components/StudentAttendanceCard'

function formatArabicDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-DZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatCheckInTime(timestamp: unknown): string | null {
  if (!timestamp) return null
  try {
    const d = new Date(timestamp as string | number)
    return d.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return null
  }
}

export default function AttendancePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // اليوم الافتراضي بصيغة YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [activeClassroomId, setActiveClassroomId] = useState<string>('')
  const [students, setStudents] = useState<StudentAttendanceItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. جلب الفصول الدراسية الحقيقية من قاعدة البيانات
  const { data: classrooms = [], isLoading: classroomsLoading } = useQuery({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list(),
  })

  // اختيار الفصل الأول تلقائياً عند تحميل الفصول
  useEffect(() => {
    if (classrooms.length > 0 && (!activeClassroomId || !classrooms.some((c) => c.id === activeClassroomId))) {
      setActiveClassroomId(classrooms[0].id)
    }
  }, [classrooms, activeClassroomId])

  const activeClassroom = useMemo(() => {
    return classrooms.find((c) => c.id === activeClassroomId)
  }, [classrooms, activeClassroomId])

  // 2. جلب الأطفال النشطين في هذا الفصل من قاعدة البيانات
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

  // 3. جلب سجلات الحضور لهذا التاريخ
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance:records', selectedDate],
    queryFn: () => api.attendance.list({ date: selectedDate }),
  })

  // 4. دمج الأطفال مع سجلات الحضور المحفوظة
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

  // إحصائيات سريعة للرأسية
  const counts = useMemo(() => {
    const present = students.filter((s) => s.status === 'present').length
    const absent = students.filter((s) => s.status === 'absent').length
    const late = students.filter((s) => s.status === 'late').length
    const unmarked = students.filter((s) => s.status === 'unmarked').length
    return { present, absent, late, unmarked, total: students.length }
  }, [students])

  // تغيير حالة طفل فردي
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

  // تحديد الجميع حاضر
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

  // اعتماد وحفظ الحضور في SQLite الحقيقي عبر IPC
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

      // تحديث الاستعلامات ليعكس النظام الحي الإحصائيات مباشرة
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

  // اختصار Ctrl+S / Cmd+S
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

  const handlePrintSheet = () => {
    window.print()
  }

  const isLoading = classroomsLoading || childrenLoading || attendanceLoading

  return (
    <div className="flex flex-col w-full select-none pb-24">
      {/* 1. الشريط العلوي واختيار الفصل والتاريخ وأزرار الإجراءات */}
      <div className="print:hidden">
        <AttendanceHeaderBar
          classrooms={classrooms}
          activeClassroomId={activeClassroomId}
          onClassChange={setActiveClassroomId}
          onMarkAllPresent={handleMarkAllPresent}
          onCommitAttendance={handleCommitAttendance}
          onPrintSheet={handlePrintSheet}
          counts={counts}
          dateString={formatArabicDate(selectedDate)}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          isSaving={isSaving}
          isSaved={isSaved}
          errorMessage={errorMessage}
        />

        {/* 2. تلميحات لوحة المفاتيح واللمس */}
        <AttendanceKeypadHint />
      </div>

      {/* 3. كشف الطباعة الورقي (يظهر فقط عند أمر الطباعة) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans dir-rtl">
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">روضتي — كشف الحضور والانصراف اليومي</h1>
            <p className="text-sm mt-1">
              الفصل: <span className="font-bold">{activeClassroom?.name ?? '—'}</span> ({activeClassroom?.room ?? ''})
            </p>
          </div>
          <div className="text-left font-mono">
            <p className="font-bold text-lg">{selectedDate}</p>
            <p className="text-sm">{formatArabicDate(selectedDate)}</p>
          </div>
        </div>

        <table className="w-full text-right border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 w-12 text-center">#</th>
              <th className="border border-gray-400 p-2">اسم الطفل</th>
              <th className="border border-gray-400 p-2 w-28 text-center">الحالة</th>
              <th className="border border-gray-400 p-2 w-28 text-center">وقت الحضور</th>
              <th className="border border-gray-400 p-2">تنبيه صحي / ملاحظات</th>
              <th className="border border-gray-400 p-2 w-32 text-center">توقيع المستلم</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s.id} className="border-b border-gray-300">
                <td className="border border-gray-400 p-2 text-center font-mono">{idx + 1}</td>
                <td className="border border-gray-400 p-2 font-bold">{s.name}</td>
                <td className="border border-gray-400 p-2 text-center">
                  {s.status === 'present'
                    ? 'حاضر'
                    : s.status === 'absent'
                      ? 'غائب'
                      : s.status === 'late'
                        ? 'متأخر'
                        : 'غير مسجل'}
                </td>
                <td className="border border-gray-400 p-2 text-center font-mono">{s.checkInTime || '—'}</td>
                <td className="border border-gray-400 p-2">{s.medicalAlert || '—'}</td>
                <td className="border border-gray-400 p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-300">
          <div>
            <p className="text-sm font-semibold">توقيع المعلمة المعتمدة:</p>
            <div className="h-16 w-48 border-b border-dashed border-gray-400 mt-2" />
          </div>
          <div>
            <p className="text-sm font-semibold">ختم وتوقيع إدارة الروضة:</p>
            <div className="h-16 w-48 border-b border-dashed border-gray-400 mt-2" />
          </div>
        </div>
      </div>

      {/* 4. شبكة بطاقات الأطفال التفاعلية */}
      <div className="print:hidden">
        {isLoading ? (
          <div className="p-16 text-center bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">
              sync
            </span>
            <p className="text-on-surface font-semibold text-base">جاري تحميل سجل الأطفال وقائمة الحضور...</p>
          </div>
        ) : classrooms.length === 0 ? (
          <div className="p-16 text-center bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-outline mb-3">meeting_room</span>
            <h2 className="text-on-surface font-headline-sm font-bold text-lg mb-1">
              لا توجد فصول دراسية مضافة
            </h2>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-4">
              لبدء تسجيل حضور الأطفال، يرجى إضافة الفصول الدراسية أولاً من شاشة الإعدادات.
            </p>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:opacity-90 transition-opacity"
              type="button"
            >
              الذهاب للإعدادات
            </button>
          </div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-5xl text-outline mb-3">sentiment_dissatisfied</span>
            <h2 className="text-on-surface font-headline-sm font-bold text-lg mb-1">
              لا يوجد أطفال مسجلون في {activeClassroom?.name ?? 'هذا الفصل'}
            </h2>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-4">
              لم يتم تعيين أي أطفال نشطين لهذا الفصل بعد. يمكنك إضافة أطفال وتعيينهم لهذا الفصل بسهولة.
            </p>
            <button
              onClick={() => navigate('/children')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:opacity-90 transition-opacity"
              type="button"
            >
              إضافة أطفال للفصل
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-space-md">
            {students.map((student) => (
              <StudentAttendanceCard
                key={student.id}
                student={student}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
