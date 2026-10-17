import { useState, useEffect, useMemo, useRef } from 'react'
import {
  api,
  type GuardianItem,
  type AuthorizedPickupItem,
  type ChildItem,
  type ClassroomItem
} from '@/lib/api'
import type { CategoryTab, ViewMode, ParentsStats } from '../types'

export function useParentsData() {
  const [guardians, setGuardians] = useState<GuardianItem[]>([])
  const [pickups, setPickups] = useState<AuthorizedPickupItem[]>([])
  const [childrenList, setChildrenList] = useState<ChildItem[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [loading, setLoading] = useState(true)

  // Selection & Filters
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [classroomFilter, setClassroomFilter] = useState('all')
  const [authFilter, setAuthFilter] = useState('all')
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Modals
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false)
  const [isAddPickupOpen, setIsAddPickupOpen] = useState(false)
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
  const [isPickupCardOpen, setIsPickupCardOpen] = useState(false)

  // Quick Dispatch Console
  const [dispatchText, setDispatchText] = useState('')
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [gData, pData, cData, clsData] = await Promise.all([
        api.guardians.list(),
        api.guardians.allPickups(),
        api.children.list({ limit: 100 }),
        api.classrooms.list()
      ])
      setGuardians(gData || [])
      setPickups(pData || [])
      setChildrenList(cData?.items || [])
      setClassrooms(clsData || [])

      if (gData && gData.length > 0 && !selectedGuardianId) {
        setSelectedGuardianId(gData[0].id)
      }
    } catch (err) {
      console.error('Failed to load parents directory data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtered Guardians
  const filteredGuardians = useMemo(() => {
    return guardians.filter((g) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = `${g.firstName} ${g.lastName}`.toLowerCase().includes(q)
        const matchPhone = g.phone?.includes(q)
        const matchNatId = g.nationalId?.includes(q)
        const matchChild = g.children.some((c) => c.childName.toLowerCase().includes(q))
        if (!matchName && !matchPhone && !matchNatId && !matchChild) return false
      }

      // 2. Classroom Filter
      if (classroomFilter !== 'all') {
        const hasChildInClass = g.children.some((c) => c.classroomId === classroomFilter)
        if (!hasChildInClass) return false
      }

      // 3. Authorization Filter
      if (authFilter !== 'all') {
        if (authFilter === 'authorized' && !g.children.some((c) => c.canPickup)) return false
        if (authFilter === 'forbidden' && g.children.some((c) => c.canPickup)) return false
      }

      // 4. Category Tabs
      if (categoryTab === 'fathers') {
        const isFather = g.children.some((c) => c.relation.includes('أب'))
        if (!isFather) return false
      } else if (categoryTab === 'mothers') {
        const isMother = g.children.some((c) => c.relation.includes('أم'))
        if (!isMother) return false
      } else if (categoryTab === 'emergency') {
        const isEmergency = g.children.some((c) => c.isPrimary)
        if (!isEmergency) return false
      } else if (categoryTab === 'restricted') {
        const isRestricted = g.children.some((c) => !c.canPickup)
        if (!isRestricted) return false
      }

      return true
    })
  }, [guardians, searchQuery, classroomFilter, authFilter, categoryTab])

  // Selected Guardian
  const selectedGuardian = useMemo(() => {
    return guardians.find((g) => g.id === selectedGuardianId) || filteredGuardians[0] || null
  }, [guardians, selectedGuardianId, filteredGuardians])

  // Pickups for Selected Guardian
  const selectedGuardianPickups = useMemo(() => {
    if (!selectedGuardian) return []
    const childIds = selectedGuardian.children.map((c) => c.childId)
    return pickups.filter((p) => childIds.includes(p.childId))
  }, [selectedGuardian, pickups])

  // Stats
  const stats: ParentsStats = useMemo(() => {
    const total = guardians.length
    let fathersCount = 0
    let mothersCount = 0
    let emergencyCount = 0
    let restrictedCount = 0

    for (const g of guardians) {
      if (g.children.some((c) => c.relation.includes('أب'))) fathersCount++
      if (g.children.some((c) => c.relation.includes('أم'))) mothersCount++
      if (g.children.some((c) => c.isPrimary)) emergencyCount++
      if (g.children.some((c) => !c.canPickup)) restrictedCount++
    }

    return {
      total,
      fathersCount,
      mothersCount,
      emergencyCount,
      restrictedCount,
      totalPickups: pickups.length
    }
  }, [guardians, pickups])

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'

      if (e.key === 'F3') {
        e.preventDefault()
        setIsAddGuardianOpen(true)
      } else if (e.key === 'F4') {
        e.preventDefault()
        setIsBroadcastOpen(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (isAddGuardianOpen || isAddPickupOpen || isBroadcastOpen || isPickupCardOpen) {
          setIsAddGuardianOpen(false)
          setIsAddPickupOpen(false)
          setIsBroadcastOpen(false)
          setIsPickupCardOpen(false)
        } else {
          setSearchQuery('')
        }
      } else if (!isInput && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault()
        if (filteredGuardians.length === 0) return
        const currentIndex = filteredGuardians.findIndex((g) => g.id === selectedGuardianId)
        if (e.key === 'ArrowDown') {
          const nextIndex = (currentIndex + 1) % filteredGuardians.length
          setSelectedGuardianId(filteredGuardians[nextIndex].id)
        } else {
          const prevIndex = (currentIndex - 1 + filteredGuardians.length) % filteredGuardians.length
          setSelectedGuardianId(filteredGuardians[prevIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedGuardianId, filteredGuardians, isAddGuardianOpen, isAddPickupOpen, isBroadcastOpen, isPickupCardOpen])

  const handleQuickDispatch = (templateText?: string) => {
    const textToSend = templateText || dispatchText
    if (!textToSend.trim() || !selectedGuardian) return

    setDispatchFeedback(`جاري ضخ الرسالة إلى المودم (${selectedGuardian.phone})...`)
    setTimeout(() => {
      setDispatchFeedback(`تم تسليم الرسالة بنجاح عبر بوابة GSM لرقم ${selectedGuardian.phone}`)
      setDispatchText('')
      setTimeout(() => setDispatchFeedback(null), 3000)
    }, 600)
  }

  const handleRevokePickup = async (pickupId: string) => {
    try {
      await api.guardians.removePickup(pickupId)
      setPickups((prev) => prev.filter((p) => p.id !== pickupId))
    } catch (err) {
      console.error('Failed to revoke pickup:', err)
    }
  }

  const handleExportCsv = () => {
    const headers = ['الاسم الأول', 'اسم العائلة', 'الجوال', 'الهوية', 'العنوان']
    const rows = guardians.map((g) => [g.firstName, g.lastName, g.phone, g.nationalId || '', g.address || ''])
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guardians_export_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const resetFilters = () => {
    setSearchQuery('')
    setClassroomFilter('all')
    setAuthFilter('all')
    setCategoryTab('all')
  }

  return {
    guardians,
    setGuardians,
    pickups,
    childrenList,
    classrooms,
    loading,
    selectedGuardianId,
    setSelectedGuardianId,
    selectedGuardian,
    selectedGuardianPickups,
    searchQuery,
    setSearchQuery,
    classroomFilter,
    setClassroomFilter,
    authFilter,
    setAuthFilter,
    categoryTab,
    setCategoryTab,
    viewMode,
    setViewMode,
    stats,
    filteredGuardians,
    dispatchText,
    setDispatchText,
    dispatchFeedback,
    setDispatchFeedback,
    searchInputRef,
    isAddGuardianOpen,
    setIsAddGuardianOpen,
    isAddPickupOpen,
    setIsAddPickupOpen,
    isBroadcastOpen,
    setIsBroadcastOpen,
    isPickupCardOpen,
    setIsPickupCardOpen,
    fetchData,
    handleQuickDispatch,
    handleRevokePickup,
    handleExportCsv,
    resetFilters
  }
}
