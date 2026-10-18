import { useState, useEffect, useMemo, useCallback } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import type {
  ActiveTab,
  DirectoryViewMode,
  AttendanceStatusType,
  AttendanceDraftMap,
  StaffStats,
  StaffMember,
  StaffAttendanceItem,
  StaffLeaveItem
} from '../types'

export function useStaffData() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<ActiveTab>('attendance')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [directoryViewMode, setDirectoryViewMode] = useState<DirectoryViewMode>('cards')

  // Data states
  const [stats, setStats] = useState<StaffStats | null>(null)
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [attendanceSheet, setAttendanceSheet] = useState<StaffAttendanceItem[]>([])
  const [leavesList, setLeavesList] = useState<StaffLeaveItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Local editable attendance state
  const [attendanceDraft, setAttendanceDraft] = useState<AttendanceDraftMap>({})
  const [isSavingAttendance, setIsSavingAttendance] = useState(false)

  // Modals state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [staffForCard, setStaffForCard] = useState<StaffMember | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statsRes, listRes, attRes, leavesRes] = await Promise.all([
        api.staff.stats(selectedDate),
        api.staff.list(),
        api.staff.listAttendance(selectedDate),
        api.staff.listLeaves()
      ])

      setStats(statsRes ?? null)
      setStaffList(listRes ?? [])
      const items = attRes?.items ?? (Array.isArray(attRes) ? attRes : [])
      setAttendanceSheet(items)
      setLeavesList(leavesRes ?? [])

      const draft: AttendanceDraftMap = {}
      for (const item of items) {
        draft[item.staffId] = {
          status: (item.status as AttendanceStatusType) ?? 'present',
          note: item.note ?? ''
        }
      }
      setAttendanceDraft(draft)
    } catch (err: any) {
      toast({
        title: 'خطأ في تحميل البيانات',
        description: err.message || 'تعذر تحميل بيانات الكادر والموظفين من قاعدة البيانات.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = (staffId: string, status: AttendanceStatusType) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [staffId]: {
        ...(prev[staffId] || { note: '' }),
        status
      }
    }))
  }

  const handleNoteChange = (staffId: string, note: string) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [staffId]: {
        ...(prev[staffId] || { status: 'present' }),
        note
      }
    }))
  }

  const handleMarkAllPresent = () => {
    setAttendanceDraft((prev) => {
      const next = { ...prev }
      for (const item of attendanceSheet) {
        next[item.staffId] = {
          ...(next[item.staffId] || { note: '' }),
          status: 'present'
        }
      }
      return next
    })
  }

  const handleSaveAttendance = useCallback(async () => {
    if (attendanceSheet.length === 0) return
    setIsSavingAttendance(true)

    try {
      const records = attendanceSheet.map((item) => ({
        staffId: item.staffId,
        status: attendanceDraft[item.staffId]?.status ?? 'present',
        note: attendanceDraft[item.staffId]?.note || undefined
      }))

      await api.staff.batchRecordAttendance({
        date: selectedDate,
        records
      })

      toast({
        title: 'تم اعتماد كشف الدوام',
        description: `تم حفظ وتوثيق حضور وانصراف الكادر لتاريخ ${selectedDate} بنجاح.`
      })

      const newStats = await api.staff.stats(selectedDate)
      setStats(newStats)
    } catch (err: any) {
      toast({
        title: 'خطأ أثناء حفظ الحضور',
        description: err.message || 'تعذر حفظ الكشف في قاعدة البيانات المحلية.',
        variant: 'destructive'
      })
    } finally {
      setIsSavingAttendance(false)
    }
  }, [attendanceSheet, attendanceDraft, selectedDate, toast])

  const handleToggleActive = async (staff: StaffMember) => {
    try {
      await api.staff.update({
        id: staff.id,
        isActive: !staff.isActive
      })
      toast({
        title: staff.isActive ? 'تم إيقاف الموظف مؤقتاً' : 'تمت إعادة تفعيل الموظف',
        description: `${staff.firstName} ${staff.lastName}`
      })
      loadData()
    } catch (err: any) {
      toast({
        title: 'تعذر تحديث الحالة',
        description: err.message,
        variant: 'destructive'
      })
    }
  }

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
  }, [activeTab, handleSaveAttendance])

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

  const uniqueRoles = useMemo(() => {
    const set = new Set<string>()
    staffList.forEach((s) => set.add(s.role))
    return Array.from(set)
  }, [staffList])

  const attendanceRate =
    stats && stats.activeCount > 0 ? Math.round((stats.presentCount / stats.activeCount) * 100) : 0

  return {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    directoryViewMode,
    setDirectoryViewMode,
    stats,
    staffList,
    attendanceSheet,
    leavesList,
    isLoading,
    attendanceDraft,
    isSavingAttendance,
    isAddStaffOpen,
    setIsAddStaffOpen,
    editingStaff,
    setEditingStaff,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    staffForCard,
    setStaffForCard,
    loadData,
    handleStatusChange,
    handleNoteChange,
    handleMarkAllPresent,
    handleSaveAttendance,
    handleToggleActive,
    filteredStaff,
    uniqueRoles,
    attendanceRate
  }
}
