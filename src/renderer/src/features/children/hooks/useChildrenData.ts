import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildren, useClassrooms } from '../queries'

export function useChildrenData() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

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
    handleOpenNewChild,
    handleOpenProfile,
    handlePayTuition,
    clearFilter
  }
}
