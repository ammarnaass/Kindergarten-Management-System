import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { useChildren, useClassrooms } from '../queries'

export function useChildrenData() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [childToDelete, setChildToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: classroomsData } = useClassrooms()
  const { data, isLoading } = useChildren({
    search: search.trim(),
    classroomId: selectedClassroom === 'all' ? undefined : selectedClassroom,
    limit: 100,
    offset: 0
  })

  const childrenList = data?.items || []

  const classrooms = useMemo(() => [
    { id: 'all', label: 'جميع الفصول' },
    ...(classroomsData?.map((c) => ({ id: c.id, label: c.name })) || [])
  ], [classroomsData])

  const classroomsMap = useMemo(() => {
    const map = new Map<string, string>()
    classroomsData?.forEach((c) => map.set(c.id, c.name))
    return map
  }, [classroomsData])

  const formattedChildren = useMemo(() => {
    return childrenList.map((c) => ({
      ...c,
      classroomId: c.classroomId ? (classroomsMap.get(c.classroomId) || c.classroomId) : 'غير مسكن بفصل'
    }))
  }, [childrenList, classroomsMap])

  const handleOpenNewChild = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', ctrlKey: true }))
  }

  const handleOpenProfile = (id: string) => {
    navigate(`/children/${id}`)
  }

  const handlePayTuition = () => {
    navigate('/finance')
  }

  const clearFilter = () => {
    setSearch('')
    setSelectedClassroom('all')
  }

  const isFiltered = Boolean(search.trim() || selectedClassroom !== 'all')

  const promptDeleteChild = (id: string, name: string) => {
    setChildToDelete({ id, name })
  }

  const cancelDeleteChild = () => {
    setChildToDelete(null)
  }

  const confirmDeleteChild = async () => {
    if (!childToDelete) return
    setIsDeleting(true)
    try {
      await api.children.remove(childToDelete.id)
      await queryClient.invalidateQueries({ queryKey: ['children'] })
      toast({
        title: 'تم حذف ملف الطفل',
        description: `تم نقل ملف «${childToDelete.name}» إلى الأرشيف بنجاح.`
      })
      setChildToDelete(null)
    } catch (err: any) {
      toast({
        title: 'خطأ أثناء حذف ملف الطفل',
        description: err.message || 'تعذر إتمام عملية الحذف في قاعدة البيانات.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    search,
    setSearch,
    selectedClassroom,
    setSelectedClassroom,
    viewMode,
    setViewMode,
    classrooms,
    formattedChildren,
    totalCount: data?.total ?? childrenList.length,
    isLoading,
    isFiltered,
    childToDelete,
    isDeleting,
    promptDeleteChild,
    cancelDeleteChild,
    confirmDeleteChild,
    handleOpenNewChild,
    handleOpenProfile,
    handlePayTuition,
    clearFilter
  }
}
