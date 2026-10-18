import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { api } from '@/lib/api'
import type { ChildItem, ClassroomItem, SafePickupGuardian, GateLogItem, GateQueueItem } from '../types'
import { getTodayString, formatTime } from '../utils/dateHelpers'

export function useSafePickupData() {
  const todayStr = useMemo(() => getTodayString(), [])
  const [barcode, setBarcode] = useState('')
  const [childrenList, setChildrenList] = useState<ChildItem[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [activeGuardians, setActiveGuardians] = useState<SafePickupGuardian[]>([])
  const [deliverySuccessMessage, setDeliverySuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const scannerInputRef = useRef<HTMLInputElement>(null)

  // 1. Initial Data Fetch
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [childrenRes, classroomsRes, attendanceRes] = await Promise.all([
        api.children.list({ limit: 200 }).catch(() => ({ items: [] })),
        api.classrooms.list().catch(() => []),
        api.attendance.list({ date: todayStr }).catch(() => [])
      ])

      const ch = (childrenRes as any)?.items || []
      setChildrenList(ch)
      setClassrooms(classroomsRes || [])
      setAttendanceRecords(attendanceRes || [])

      // Auto-select first waiting child if none selected
      setSelectedChildId((prev) => {
        if (prev && ch.some((c: ChildItem) => c.id === prev)) return prev
        const attendedUnpicked = (attendanceRes || []).find(
          (a: any) => (a.status === 'present' || a.status === 'late') && !a.checkOutAt
        )
        if (attendedUnpicked) return attendedUnpicked.childId
        return ch[0]?.id || null
      })
    } catch (err) {
      console.error('Error loading safe pickup data:', err)
    } finally {
      setLoading(false)
    }
  }, [todayStr])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Map for fast lookups
  const childrenMap = useMemo(() => {
    const map = new Map<string, ChildItem>()
    childrenList.forEach((c) => map.set(c.id, c))
    return map
  }, [childrenList])

  const classroomsMap = useMemo(() => {
    const map = new Map<string, string>()
    classrooms.forEach((cls) => map.set(cls.id, cls.name))
    return map
  }, [classrooms])

  // Active child object
  const activeChild = useMemo(() => {
    if (!selectedChildId) return null
    return childrenMap.get(selectedChildId) || null
  }, [selectedChildId, childrenMap])

  // 2. Fetch guardians and pickups for active child
  useEffect(() => {
    if (!activeChild) {
      setActiveGuardians([])
      return
    }

    let isMounted = true
    Promise.all([
      api.children.getGuardians(activeChild.id).catch(() => []),
      api.children.getPickups(activeChild.id).catch(() => [])
    ]).then(([guardiansRes, pickupsRes]) => {
      if (!isMounted) return

      const list: SafePickupGuardian[] = []

      // Guardians
      ;(guardiansRes || []).forEach((g: any) => {
        list.push({
          id: `g-${g.id}`,
          name: `${g.firstName} ${g.lastName}`,
          profession: g.address || undefined,
          relationship: g.relation || 'ولي أمر معتمد',
          nationalId: g.nationalId || undefined,
          phone: g.phone || undefined,
          photoUrl: null,
          isPermanent: true
        })
      })

      // Authorized Pickups
      ;(pickupsRes || []).forEach((p: any) => {
        list.push({
          id: `p-${p.id}`,
          name: p.fullName || p.name,
          relationship: p.note || 'مخوّل رسمي بالاستلام',
          nationalId: p.nationalId || undefined,
          phone: p.phone || undefined,
          photoUrl: null,
          isPermanent: false
        })
      })

      setActiveGuardians(list)
    })

    return () => {
      isMounted = false
    }
  }, [activeChild])

  // 3. Compute queues and activity logs
  const { completedLogs, waitingQueue, completedCount, remainingCount } = useMemo(() => {
    const logs: GateLogItem[] = []
    const queue: GateQueueItem[] = []

    const attendedChildrenIds = new Set<string>()

    attendanceRecords.forEach((a: any) => {
      if (a.status !== 'present' && a.status !== 'late') return
      attendedChildrenIds.add(a.childId)

      const child = childrenMap.get(a.childId)
      const classroomName = child?.classroomId
        ? classroomsMap.get(child.classroomId) || 'عام'
        : 'عام'
      const childName = child ? `${child.firstName} ${child.lastName}` : 'طفل'

      if (a.checkOutAt) {
        logs.push({
          id: a.id,
          childName,
          classroom: classroomName,
          time: formatTime(a.checkOutAt),
          receiver: a.pickedUpBy || 'مستلم موثق',
          status: 'مكتمل بنجاح',
          gate: 'البوابة الرئيسية',
          staff: a.recordedBy || 'أمانة الاستقبال'
        })
      } else {
        queue.push({
          id: a.childId,
          name: childName,
          classroom: classroomName,
          timeIn: formatTime(a.checkInAt) || 'حاضر'
        })
      }
    })

    // If no attendance records at all today, show active enrolled children in queue
    if (attendanceRecords.length === 0 && childrenList.length > 0) {
      childrenList.slice(0, 15).forEach((child) => {
        queue.push({
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          classroom: child.classroomId ? classroomsMap.get(child.classroomId) || 'عام' : 'عام',
          timeIn: 'مسجل بالقائمة'
        })
      })
    }

    return {
      completedLogs: logs,
      waitingQueue: queue,
      completedCount: logs.length,
      remainingCount: queue.length
    }
  }, [attendanceRecords, childrenMap, classroomsMap, childrenList])

  // 4. Handle barcode search/scanner typing
  const handleBarcodeChange = (val: string) => {
    setBarcode(val)
    if (!val.trim()) return

    const query = val.trim().toLowerCase()
    const match = childrenList.find(
      (c) =>
        c.id.toLowerCase() === query ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query)
    )

    if (match) {
      setSelectedChildId(match.id)
    }
  }

  // Handle hotkeys (F2 for scanner focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        scannerInputRef.current?.focus()
        scannerInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 5. Confirm dismissal & delivery
  const handleConfirmDelivery = async (guardian: SafePickupGuardian) => {
    if (!activeChild) return

    try {
      const childFullName = `${activeChild.firstName} ${activeChild.lastName}`
      const receiverName = `${guardian.name} (${guardian.relationship})`

      await api.attendance.mark(todayStr, [
        {
          childId: activeChild.id,
          status: 'present',
          checkOutAt: Date.now(),
          pickedUpBy: receiverName
        }
      ])

      setDeliverySuccessMessage(
        `تم توثيق استلام الطفل ${childFullName} بنجاح إلى: ${guardian.name}`
      )
      setTimeout(() => setDeliverySuccessMessage(null), 4000)

      // Refresh attendance list from SQLite
      const updatedAttendance = await api.attendance.list({ date: todayStr }).catch(() => [])
      setAttendanceRecords(updatedAttendance)

      // Select next child from remaining queue
      const nextWaiting = (updatedAttendance || []).find(
        (a: any) =>
          (a.status === 'present' || a.status === 'late') &&
          !a.checkOutAt &&
          a.childId !== activeChild.id
      )
      if (nextWaiting) {
        setSelectedChildId(nextWaiting.childId)
      }
    } catch (err: any) {
      console.error('Failed to confirm pickup:', err)
      alert(`حدث خطأ أثناء تسجيل حركة الاستلام: ${err.message || 'خطأ غير متوقع'}`)
    }
  }

  const handleTestScan = () => {
    if (childrenList.length > 0) {
      const randomChild = childrenList[Math.floor(Math.random() * childrenList.length)]
      setSelectedChildId(randomChild.id)
      setBarcode(`${randomChild.firstName} ${randomChild.lastName}`)
    }
  }

  return {
    todayStr,
    barcode,
    setBarcode,
    childrenList,
    classrooms,
    attendanceRecords,
    selectedChildId,
    setSelectedChildId,
    activeGuardians,
    deliverySuccessMessage,
    loading,
    scannerInputRef,
    childrenMap,
    classroomsMap,
    activeChild,
    completedLogs,
    waitingQueue,
    completedCount,
    remainingCount,
    handleBarcodeChange,
    handleConfirmDelivery,
    handleTestScan
  }
}
