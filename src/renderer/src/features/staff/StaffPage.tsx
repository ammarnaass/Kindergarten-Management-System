import { useState, useEffect, useMemo } from 'react'
import { api } from '../../lib/api'
import { useToast } from '@/components/ui/toast'
import { AddStaffModal } from './components/AddStaffModal'
import { RecordLeaveModal } from './components/RecordLeaveModal'
import { StaffCardModal } from './components/StaffCardModal'
import type { StaffStats, StaffMember, StaffAttendanceItem, StaffLeaveItem } from '../../lib/api/types'

type ActiveTab = 'attendance' | 'directory' | 'leaves'

export default function StaffPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<ActiveTab>('attendance')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [directoryViewMode, setDirectoryViewMode] = useState<'table' | 'cards'>('cards')

  // Data states
  const [stats, setStats] = useState<StaffStats | null>(null)
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [attendanceSheet, setAttendanceSheet] = useState<StaffAttendanceItem[]>([])
  const [leavesList, setLeavesList] = useState<StaffLeaveItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Local editable attendance state: map of staffId -> { status, note }
  const [attendanceDraft, setAttendanceDraft] = useState<
    Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; note: string }>
  >({})
  const [isSavingAttendance, setIsSavingAttendance] = useState(false)

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [staffForCard, setStaffForCard] = useState<StaffMember | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, listRes, attRes, leavesRes] = await Promise.all([
        api.staff.stats(selectedDate),
        api.staff.list(),
        api.staff.listAttendance(selectedDate),
        api.staff.listLeaves(),
      ])

      setStats(statsRes ?? null)
      setStaffList(listRes ?? [])
      const items = attRes?.items ?? (Array.isArray(attRes) ? attRes : [])
      setAttendanceSheet(items)
      setLeavesList(leavesRes ?? [])

      // Initialize attendance draft from fetched attendance items
      const draft: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; note: string }> = {}
      for (const item of items) {
        draft[item.staffId] = {
          status: item.status ?? 'present',
          note: item.note ?? '',
        }
      }
      setAttendanceDraft(draft)
    } catch (err: any) {
      toast({
        title: 'خطأ في تحميل البيانات',
        description: err.message || 'تعذر تحميل بيانات الكادر والموظفين من قاعدة البيانات.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedDate])

  // Desktop Global Shortcuts (F3, F4, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault()
        setEditingStaff(null)
        setIsAddStaffOpen(true)
      } else if (e.key === 'F4') {
        e.preventDefault()
        setIsLeaveModalOpen(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && activeTab === 'attendance') {
        e.preventDefault()
        handleSaveAttendance()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, attendanceDraft, attendanceSheet])

  const handleStatusChange = (staffId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [staffId]: {
        ...(prev[staffId] || { note: '' }),
        status,
      },
    }))
  }

  const handleNoteChange = (staffId: string, note: string) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [staffId]: {
        ...(prev[staffId] || { status: 'present' }),
        note,
      },
    }))
  }

  const handleMarkAllPresent = () => {
    setAttendanceDraft((prev) => {
      const next = { ...prev }
      for (const item of attendanceSheet) {
        next[item.staffId] = {
          ...(next[item.staffId] || { note: '' }),
          status: 'present',
        }
      }
      return next
    })
  }

  const handleSaveAttendance = async () => {
    if (attendanceSheet.length === 0) return
    setIsSavingAttendance(true)

    try {
      const records = attendanceSheet.map((item) => ({
        staffId: item.staffId,
        status: attendanceDraft[item.staffId]?.status ?? 'present',
        note: attendanceDraft[item.staffId]?.note || undefined,
      }))

      await api.staff.batchRecordAttendance({
        date: selectedDate,
        records,
      })

      toast({
        title: 'تم اعتماد كشف الدوام',
        description: `تم حفظ وتوثيق حضور وانصراف الكادر لتاريخ ${selectedDate} بنجاح.`,
      })

      // Reload stats
      const newStats = await api.staff.stats(selectedDate)
      setStats(newStats)
    } catch (err: any) {
      toast({
        title: 'خطأ أثناء حفظ الحضور',
        description: err.message || 'تعذر حفظ الكشف في قاعدة البيانات المحلية.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingAttendance(false)
    }
  }

  const handleToggleActive = async (staff: StaffMember) => {
    try {
      await api.staff.update({
        id: staff.id,
        isActive: !staff.isActive,
      })
      toast({
        title: staff.isActive ? 'تم إيقاف الموظف مؤقتاً' : 'تمت إعادة تفعيل الموظف',
        description: `${staff.firstName} ${staff.lastName}`,
      })
      loadData()
    } catch (err: any) {
      toast({
        title: 'تعذر تحديث الحالة',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  // Filtered staff list for Directory tab
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (s.phone && s.phone.includes(searchQuery.trim())) ||
        s.role.toLowerCase().includes(searchQuery.trim().toLowerCase())

      const matchesRole = roleFilter === 'ALL' || s.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [staffList, searchQuery, roleFilter])

  // Available unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const set = new Set<string>()
    staffList.forEach((s) => set.add(s.role))
    return Array.from(set)
  }, [staffList])

  const attendanceRate =
    stats && stats.activeCount > 0 ? Math.round((stats.presentCount / stats.activeCount) * 100) : 0

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-140px)] bg-background select-none">
      {/* ── Top Header & Actions ───────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[28px]">badge</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-headline-md font-headline-md text-on-surface font-bold">
                إدارة الكادر والموظفين
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-caption text-caption font-semibold">
                محلي ومشفر 100% (Offline)
              </span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              كشف الدوام اليومي، دليل المعلمات والموظفين، وسجل الإجازات ومسير الرواتب
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker for Attendance */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              calendar_month
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-label-md font-label-md text-on-surface focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={loadData}
            title="تحديث البيانات"
            className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md font-semibold"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">event_busy</span>
            <span>توثيق إجازة</span>
            <kbd className="bg-surface-container-lowest text-on-surface-variant px-1.5 py-0.5 rounded font-caption text-caption">
              F4
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingStaff(null)
              setIsAddStaffOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>إضافة موظف جديد</span>
            <kbd className="bg-white/20 px-1.5 py-0.5 rounded font-caption text-caption text-on-primary">
              F3
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            title="طباعة السجل (Ctrl+P)"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
        </div>
      </div>

      {/* ── 4 Bento KPI Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Total Staff */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md font-semibold">إجمالي الكادر النشط</span>
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-display-md font-display-md text-on-surface font-bold">
              {stats?.activeCount ?? 0}
            </span>
            <span className="text-caption font-caption text-on-surface-variant">
              من أصل {stats?.totalCount ?? 0} موظف مسجل
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-caption font-caption text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>معلمات وإداريات وعاملات</span>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md font-semibold">الحاضرون اليوم</span>
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-display-md font-display-md text-primary font-bold">
              {stats?.presentCount ?? 0}
            </span>
            <span className="text-caption font-caption text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              {attendanceRate}% نسبة الحضور
            </span>
          </div>
          <div className="mt-2 text-caption font-caption text-on-surface-variant font-mono">
            بتاريخ: {selectedDate}
          </div>
        </div>

        {/* Absent / Late / Leaves */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md font-semibold">غياب وتأخير وإجازات</span>
            <span className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="flex items-center gap-1">
              <span className="text-headline-md font-headline-md text-secondary font-bold">
                {stats?.lateCount ?? 0}
              </span>
              <span className="text-caption font-caption text-on-surface-variant">متأخر</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1">
              <span className="text-headline-md font-headline-md text-error font-bold">
                {stats?.absentCount ?? 0}
              </span>
              <span className="text-caption font-caption text-on-surface-variant">غائب</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1">
              <span className="text-headline-md font-headline-md text-primary font-bold">
                {stats?.activeLeavesCount ?? 0}
              </span>
              <span className="text-caption font-caption text-on-surface-variant">إجازة</span>
            </div>
          </div>
          <div className="mt-2 text-caption font-caption text-on-surface-variant">
            متابعة فورية للمناوبات اليومية
          </div>
        </div>

        {/* Monthly Payroll Estimate */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md font-semibold">مسير الرواتب الشهري</span>
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-headline-lg font-headline-lg text-primary font-bold">
              {((stats?.payrollCents ?? 0) / 100).toLocaleString('ar-SA')}
            </span>
            <span className="text-caption font-caption text-on-surface-variant font-semibold">
              ريال / شهرياً
            </span>
          </div>
          <div className="mt-2 text-caption font-caption text-on-surface-variant">
            إجمالي الرواتب الأساسية للكادر النشط
          </div>
        </div>
      </div>

      {/* ── Main Workspace with Tabs ─────────────────────── */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col flex-1">
        {/* Navigation Tabs Header */}
        <div className="px-6 pt-4 border-b border-surface-container-high flex flex-wrap items-center justify-between gap-4 bg-surface-container-low/40 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-label-md text-label-md font-semibold border-b-2 transition-all ${
                activeTab === 'attendance'
                  ? 'border-primary text-primary bg-surface-container-lowest'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              <span>كشف الدوام اليومي</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary font-bold">
                {attendanceSheet.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-label-md text-label-md font-semibold border-b-2 transition-all ${
                activeTab === 'directory'
                  ? 'border-primary text-primary bg-surface-container-lowest'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">contact_page</span>
              <span>دليل الموظفين والمعلمات</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container text-on-surface-variant font-bold">
                {staffList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leaves')}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-label-md text-label-md font-semibold border-b-2 transition-all ${
                activeTab === 'leaves'
                  ? 'border-primary text-primary bg-surface-container-lowest'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">event_note</span>
              <span>سجل الإجازات والاستئذان</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-surface-container text-on-surface-variant font-bold">
                {leavesList.length}
              </span>
            </button>
          </div>

          {/* Quick search/filter bar depending on active tab */}
          {activeTab === 'directory' && (
            <div className="flex items-center gap-3 pb-2 flex-wrap">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none"
              >
                <option value="ALL">جميع المسميات ({staffList.length})</option>
                {uniqueRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-[18px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو الهاتف..."
                  className="pr-8 pl-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none w-52"
                />
              </div>

              {/* View Switcher: Cards vs Table */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode('cards')}
                  className={`px-2 py-1 rounded text-caption flex items-center gap-1 font-semibold ${
                    directoryViewMode === 'cards'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant'
                  }`}
                  title="عرض البطاقات المهنية"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>بطاقات</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode('table')}
                  className={`px-2 py-1 rounded text-caption flex items-center gap-1 font-semibold ${
                    directoryViewMode === 'table'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant'
                  }`}
                  title="عرض جدول تفصيلي"
                >
                  <span className="material-symbols-outlined text-[16px]">view_list</span>
                  <span>جدول</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="flex items-center gap-2 pb-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-label-sm font-semibold border border-primary/20"
              >
                <span className="material-symbols-outlined text-[16px]">done_all</span>
                <span>تحديد الكل كحاضر</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={isSavingAttendance || attendanceSheet.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-sm font-semibold shadow-xs disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>{isSavingAttendance ? 'جاري الاعتماد...' : 'اعتماد وحفظ الكشف (Ctrl+S)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Attendance Sheet */}
        {activeTab === 'attendance' && (
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-body-sm font-body-sm text-on-surface-variant">
                كشف تسجيل الدوام لتاريخ:{' '}
                <span className="font-semibold text-on-surface font-mono">{selectedDate}</span> — يمكنك تعديل حالة كل موظف مباشرة ثم الضغط على "اعتماد وحفظ الكشف".
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
                  progress_activity
                </span>
                <span className="text-body-md">جاري تحميل كشف دوام الكادر...</span>
              </div>
            ) : attendanceSheet.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-3 bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/60">
                <span className="material-symbols-outlined text-[48px] text-outline">group_off</span>
                <span className="text-headline-sm font-semibold text-on-surface">
                  لا يوجد كادر نشط مسجل حالياً
                </span>
                <p className="text-body-sm max-w-md text-center">
                  قم بإضافة معلمات وموظفين عبر زر "إضافة موظف جديد" لتتمكن من رصد حضورهم وغيابهم اليومي.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md font-semibold text-label-md shadow-sm"
                >
                  إضافة أول موظف الآن
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">الموظف / المعلمة</th>
                      <th className="py-3 px-4">المسمى الوظيفي</th>
                      <th className="py-3 px-4">الهاتف</th>
                      <th className="py-3 px-4 text-center">حالة الحضور</th>
                      <th className="py-3 px-4">ملاحظات أو عذر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-body-sm">
                    {attendanceSheet.map((item, idx) => {
                      const currentStatus = attendanceDraft[item.staffId]?.status ?? 'present'
                      const currentNote = attendanceDraft[item.staffId]?.note ?? ''

                      return (
                        <tr
                          key={item.staffId}
                          className="hover:bg-surface-container-low/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-caption text-outline font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-semibold text-on-surface">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-caption">
                                {item.firstName.charAt(0)}
                              </div>
                              <span>
                                {item.firstName} {item.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">
                            <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-caption font-semibold">
                              {item.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant font-mono text-caption" dir="ltr">
                            {item.phone || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.staffId, 'present')}
                                className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                                  currentStatus === 'present'
                                    ? 'bg-primary text-on-primary shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                              >
                                حاضر
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.staffId, 'late')}
                                className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                                  currentStatus === 'late'
                                    ? 'bg-secondary text-on-secondary shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                              >
                                متأخر
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.staffId, 'absent')}
                                className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                                  currentStatus === 'absent'
                                    ? 'bg-error text-on-error shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                              >
                                غائب
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.staffId, 'excused')}
                                className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${
                                  currentStatus === 'excused'
                                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                              >
                                إجازة / عذر
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={currentNote}
                              onChange={(e) => handleNoteChange(item.staffId, e.target.value)}
                              placeholder="ملاحظة أو عذر..."
                              className="w-full px-2.5 py-1 text-caption bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface focus:outline-none focus:border-primary"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Directory Table / Cards */}
        {activeTab === 'directory' && (
          <div className="p-6 flex-1 flex flex-col">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
                  progress_activity
                </span>
                <span className="text-body-md">جاري تحميل دليل الكادر...</span>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
                <span className="text-headline-sm font-semibold text-on-surface">لا توجد نتائج مطابقة</span>
                <span className="text-body-sm">جرّب تغيير عبارة البحث أو اختيار مسمى وظيفي آخر.</span>
              </div>
            ) : directoryViewMode === 'cards' ? (
              /* Bento Cards Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shadow-xs">
                          {staff.firstName.charAt(0)}.{staff.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface text-label-lg leading-tight">
                            {staff.firstName} {staff.lastName}
                          </h3>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container text-caption font-semibold mt-1">
                            {staff.role}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          staff.isActive
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {staff.isActive ? 'على رأس العمل' : 'متوقف'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-body-sm text-on-surface border-t border-outline-variant/20 pt-3">
                      <div className="flex items-center justify-between text-caption text-on-surface-variant">
                        <span>الهاتف:</span>
                        <span className="font-mono text-on-surface font-semibold dir-ltr">
                          {staff.phone || 'غير مسجل'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-caption text-on-surface-variant">
                        <span>الراتب الأساسي:</span>
                        <span className="font-mono text-on-surface font-bold">
                          {(staff.salaryCents / 100).toLocaleString('ar-SA')} ر.س
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-caption text-on-surface-variant">
                        <span>تاريخ المباشرة:</span>
                        <span className="font-mono text-on-surface">{staff.hiredAt || '—'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setStaffForCard(staff)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-caption font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="طباعة بطاقة العمل (CR80)"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                        <span>بطاقة العمل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingStaff(staff)
                          setIsAddStaffOpen(true)
                        }}
                        className="py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-caption font-semibold transition-colors"
                      >
                        تعديل
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(staff)}
                        className={`py-1.5 px-2.5 rounded-lg text-caption font-semibold transition-colors ${
                          staff.isActive
                            ? 'text-error hover:bg-error-container/20'
                            : 'text-primary hover:bg-primary/10'
                        }`}
                        title={staff.isActive ? 'إيقاف الموظف مؤقتاً' : 'إعادة التنشيط'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {staff.isActive ? 'pause_circle' : 'play_circle'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">الاسم الكامل</th>
                      <th className="py-3 px-4">المسمى الوظيفي</th>
                      <th className="py-3 px-4">الهاتف</th>
                      <th className="py-3 px-4">البريد الإلكتروني</th>
                      <th className="py-3 px-4">الراتب الأساسي</th>
                      <th className="py-3 px-4">تاريخ المباشرة</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4 text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-body-sm">
                    {filteredStaff.map((staff, idx) => (
                      <tr key={staff.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-4 text-caption text-outline font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-on-surface">
                          {staff.firstName} {staff.lastName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-caption">
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant font-mono text-caption" dir="ltr">
                          {staff.phone || '—'}
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant font-mono text-caption" dir="ltr">
                          {staff.email || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-on-surface">
                          {(staff.salaryCents / 100).toLocaleString('ar-SA')} ر.س
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant text-caption font-mono">
                          {staff.hiredAt || '—'}
                        </td>
                        <td className="py-3 px-4">
                          {staff.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-caption font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>على رأس العمل</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-caption">
                              <span>متوقف</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setStaffForCard(staff)}
                              className="p-1 rounded hover:bg-surface-container-high text-primary transition-colors"
                              title="بطاقة العمل (CR80)"
                            >
                              <span className="material-symbols-outlined text-[18px]">badge</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStaff(staff)
                                setIsAddStaffOpen(true)
                              }}
                              className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-caption font-semibold transition-colors"
                            >
                              تعديل
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Leaves Register */}
        {activeTab === 'leaves' && (
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-body-sm font-body-sm text-on-surface-variant">
                سجل الإجازات الرسمية والمرضية والاضطرارية لجميع الكوادر
              </span>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-sm font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>طلب إجازة جديد (F4)</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
                  progress_activity
                </span>
                <span className="text-body-md">جاري تحميل سجل الإجازات...</span>
              </div>
            ) : leavesList.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-[40px] text-outline">event_available</span>
                <span className="text-headline-sm font-semibold text-on-surface">لا توجد إجازات مسجلة</span>
                <span className="text-body-sm">الكادر مكتمل الحضور دون إجازات معلقة أو سابقة.</span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">الموظف</th>
                      <th className="py-3 px-4">المسمى الوظيفي</th>
                      <th className="py-3 px-4">من تاريخ</th>
                      <th className="py-3 px-4">إلى تاريخ</th>
                      <th className="py-3 px-4">سبب الإجازة</th>
                      <th className="py-3 px-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-body-sm">
                    {leavesList.map((leave, idx) => (
                      <tr key={leave.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-4 text-caption text-outline font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-on-surface">
                          {leave.staffFirstName} {leave.staffLastName}
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant">{leave.staffRole}</td>
                        <td className="py-3 px-4 font-mono text-caption text-on-surface">{leave.fromDate}</td>
                        <td className="py-3 px-4 font-mono text-caption text-on-surface">{leave.toDate}</td>
                        <td className="py-3 px-4 text-on-surface-variant">{leave.reason || '—'}</td>
                        <td className="py-3 px-4">
                          {leave.status === 'approved' ? (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-caption font-semibold">
                              معتمدة
                            </span>
                          ) : leave.status === 'pending' ? (
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-caption font-semibold">
                              قيد المراجعة
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-caption font-semibold">
                              مرفوضة
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Operational Shortcuts Hint Strip */}
      <div className="bg-surface-container-low/80 rounded-xl p-space-sm flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant font-caption text-caption border border-outline-variant/10 print:hidden">
        <div className="flex items-center gap-space-md flex-wrap">
          <span className="font-bold text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary">keyboard</span>
            اختصارات الكادر:
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">F3</kbd>
            إضافة موظف
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">F4</kbd>
            طلب إجازة
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Ctrl+S</kbd>
            اعتماد الحضور
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface font-mono">Ctrl+P</kbd>
            طباعة
          </span>
        </div>
        <div className="flex items-center gap-1 text-primary font-semibold">
          <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
          <span>سجلات الرواتب والدوام تعمل دون إنترنت</span>
        </div>
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSuccess={loadData}
        staffMember={editingStaff}
      />

      <RecordLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadData}
        staffList={staffList.filter((s) => s.isActive)}
      />

      <StaffCardModal
        isOpen={Boolean(staffForCard)}
        onClose={() => setStaffForCard(null)}
        staff={staffForCard}
      />
    </div>
  )
}
