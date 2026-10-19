import React from 'react'
import { useChildrenData } from './hooks/useChildrenData'
import { ChildrenHeaderFilter } from './components/ChildrenHeaderFilter'
import { ChildrenGridView } from './components/ChildrenGridView'
import { ChildrenTableView } from './components/ChildrenTableView'
import { ChildrenEmptyState } from './components/ChildrenEmptyState'

export default function ChildrenPage() {
  const {
    search,
    setSearch,
    selectedClassroom,
    setSelectedClassroom,
    viewMode,
    setViewMode,
    classrooms,
    formattedChildren,
    totalCount,
    isLoading,
    isFiltered,
    handleOpenNewChild,
    handleOpenProfile,
    handlePayTuition,
    clearFilter
  } = useChildrenData()

  return (
    <div className="flex flex-col w-full gap-space-lg select-none">
      <ChildrenHeaderFilter
        totalCount={totalCount}
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
          onClearFilter={clearFilter}
        />
      ) : viewMode === 'grid' ? (
        <ChildrenGridView
          children={formattedChildren}
          onOpenProfile={handleOpenProfile}
          onPayTuition={handlePayTuition}
        />
      ) : (
        <ChildrenTableView
          children={formattedChildren}
          onOpenProfile={handleOpenProfile}
        />
      )}
    </div>
  )
}
