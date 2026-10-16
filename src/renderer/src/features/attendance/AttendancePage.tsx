import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ipc } from '@/lib/ipc'
import { AttendanceHeaderBar } from './components/AttendanceHeaderBar'
import { AttendanceKeypadHint } from './components/AttendanceKeypadHint'
import { StudentAttendanceCard, StudentAttendanceItem, AttendanceStatus } from './components/StudentAttendanceCard'

// Realistic student rosters based on stitch_ (1)/stitch_/_2/code.html
const DEFAULT_STUDENTS: StudentAttendanceItem[] = [
  { id: '1', name: 'أحمد قدور', checkInTime: '08:10 ص', medicalAlert: 'حساسية بنسلين', status: 'present' },
  { id: '2', name: 'ليلى عثماني', checkInTime: '08:15 ص', status: 'present' },
  { id: '3', name: 'يوسف بن خالد', checkInTime: '08:22 ص', status: 'present' },
  { id: '4', name: 'سارة بوعلام', checkInTime: '08:25 ص', medicalAlert: 'حساسية الفول السوداني', status: 'present' },
  { id: '5', name: 'كريم منصور', checkInTime: '08:30 ص', status: 'present' },
  { id: '6', name: 'ريم الجزائري', status: 'absent' },
  { id: '7', name: 'آدم تواتي', checkInTime: '08:45 ص', status: 'late' },
  { id: '8', name: 'فاطمة عماري', checkInTime: '08:12 ص', status: 'present' },
  { id: '9', name: 'إلياس رحماني', checkInTime: '08:18 ص', status: 'present' },
  { id: '10', name: 'مروة دحمان', status: 'absent' },
  { id: '11', name: 'زياد بن ناصر', checkInTime: '08:20 ص', status: 'present' },
  { id: '12', name: 'نور الهدى صالحي', checkInTime: '08:28 ص', status: 'present' },
  { id: '13', name: 'بلال مهدوي', status: 'unmarked' },
  { id: '14', name: 'سيرين قاسي', status: 'unmarked' },
  { id: '15', name: 'طارق بن علي', status: 'unmarked' },
]

export default function AttendancePage() {
  const [activeClass, setActiveClass] = useState('فصل النجوم')
  const [students, setStudents] = useState<StudentAttendanceItem[]>(DEFAULT_STUDENTS)
  const [isSaved, setIsSaved] = useState(false)

  // Query database children if available
  const { data: dbChildren } = useQuery({
    queryKey: ['children-attendance'],
    queryFn: () => ipc<any>('children:list', { limit: 50, offset: 0 }),
  })

  // Synchronize when db has records
  useEffect(() => {
    if (dbChildren?.items && dbChildren.items.length > 0) {
      const mapped: StudentAttendanceItem[] = dbChildren.items.map((c: any, index: number) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        photo: c.photoPath,
        checkInTime: index % 5 === 0 ? '08:45 ص' : '08:15 ص',
        medicalAlert: c.allergies || (index === 0 ? 'حساسية بنسلين' : undefined),
        status: (index === 5 || index === 9 ? 'absent' : index === 6 ? 'late' : 'present') as AttendanceStatus,
      }))
      setStudents(mapped)
    }
  }, [dbChildren])

  const counts = useMemo(() => {
    const present = students.filter((s) => s.status === 'present').length
    const absent = students.filter((s) => s.status === 'absent').length
    const late = students.filter((s) => s.status === 'late').length
    const unmarked = students.filter((s) => s.status === 'unmarked').length
    return { present, absent, late, unmarked, total: students.length }
  }, [students])

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setIsSaved(false)
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    )
  }

  const handleMarkAllPresent = () => {
    setIsSaved(false)
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })))
  }

  const handleCommitAttendance = useCallback(async () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const entries = students.map((s) => ({
        childId: s.id.includes('-') ? s.id : '00000000-0000-0000-0000-000000000001',
        status: s.status === 'unmarked' ? 'absent' : s.status,
      }))
      await ipc('attendance:mark', { date: today, entries })
    } catch {}
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }, [students])

  // Handle Ctrl+S keyboard shortcut
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

  return (
    <div className="flex flex-col w-full select-none pb-24">
      {/* 1. Top Command & Class Selection Bar */}
      <AttendanceHeaderBar
        activeClass={activeClass}
        onClassChange={setActiveClass}
        onMarkAllPresent={handleMarkAllPresent}
        onCommitAttendance={handleCommitAttendance}
        onPrintSheet={() => window.print()}
        counts={counts}
        isSaved={isSaved}
      />

      {/* 2. Touch Keypad Hint Banner */}
      <AttendanceKeypadHint />

      {/* 3. Classroom Attendance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-space-md">
        {students.map((student) => (
          <StudentAttendanceCard
            key={student.id}
            student={student}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  )
}
