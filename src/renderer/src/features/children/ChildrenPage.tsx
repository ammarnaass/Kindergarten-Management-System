import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildren, useClassrooms } from './queries'
import { ChildrenHeaderFilter } from './components/ChildrenHeaderFilter'
import { ChildrenGridView } from './components/ChildrenGridView'
import { ChildrenTableView } from './components/ChildrenTableView'
import { ChildrenEmptyState } from './components/ChildrenEmptyState'

export default function ChildrenPage() {
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

  const isFiltered = Boolean(search.trim() || selectedClassroom !== 'all')

  return (
    <div className="flex flex-col w-full gap-space-lg select-none">
      <ChildrenHeaderFilter
        totalCount={data?.total ?? childrenList.length}
        search={search}
        onSearchChange={setSearch}
        selectedClassroom={selectedClassroom}
        onClassroomChange={setSelectedClassroom}
        classrooms={classrooms}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewChild={handleOpenNewChild}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant font-body-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
            <span>جاري استرجاع سجلات الأطفال من قاعدة البيانات المحلية...</span>
          </div>
        </div>
      ) : formattedChildren.length === 0 ? (
        <ChildrenEmptyState
          isFiltered={isFiltered}
          onNewChild={handleOpenNewChild}
          onClearFilter={() => {
            setSearch('')
            setSelectedClassroom('all')
          }}
        />
      ) : viewMode === 'grid' ? (
        <ChildrenGridView
          children={formattedChildren}
          onOpenProfile={(id) => navigate(`/children/${id}`)}
          onPayTuition={() => navigate('/finance')}
        />
      ) : (
        <ChildrenTableView
          children={formattedChildren}
          onOpenProfile={(id) => navigate(`/children/${id}`)}
        />
      )}
    </div>
  )
}
