import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { ClassroomItem, ChildItem } from '@/lib/api/types'
import type { ProfileTabId } from '../components/ProfileNavigationTabs'

export function useChildProfileData() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [child, setChild] = useState<ChildItem | null>(null)
  const [guardians, setGuardians] = useState<any[]>([])
  const [pickups, setPickups] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddPickupModalOpen, setIsAddPickupModalOpen] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [c, g, p, cls] = await Promise.all([
        api.children.get(id).catch(() => null),
        api.children.getGuardians(id).catch(() => []),
        api.children.getPickups(id).catch(() => []),
        api.classrooms.list().catch(() => [])
      ])
      setChild(c)
      setGuardians(g ?? [])
      setPickups(p ?? [])
      setClassrooms(cls ?? [])
    } catch (e: any) {
      console.error('Error loading child profile:', e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  // Desktop keyboard shortcuts (Ctrl+E for Edit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        if (child) {
          setIsEditModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [child])

  const navigateToChildrenRoster = () => {
    navigate('/children')
  }

  const handlePrint = () => {
    window.print()
  }

  return {
    id,
    child,
    guardians,
    pickups,
    classrooms,
    loading,
    activeTab,
    setActiveTab,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddPickupModalOpen,
    setIsAddPickupModalOpen,
    load,
    navigateToChildrenRoster,
    handlePrint
  }
}
