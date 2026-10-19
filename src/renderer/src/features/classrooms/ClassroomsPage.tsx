import React, { useState } from 'react'
import { useClassroomsData } from './hooks/useClassroomsData'
import { useClassroomLiveMode } from './hooks/useClassroomLiveMode'
import { useClassroomTimer } from './hooks/useClassroomTimer'
import { ClassroomsHeaderBanner } from './components/ClassroomsHeaderBanner'
import { ClassroomsMetrics } from './components/ClassroomsMetrics'
import { ClassroomCard } from './components/ClassroomCard'
import { ClassroomOverviewEmptyState } from './components/ClassroomOverviewEmptyState'
import { AddEditClassroomModal } from './components/AddEditClassroomModal'
import { ConfirmDeleteClassroomModal } from './components/ConfirmDeleteClassroomModal'
import { ClassroomLiveHeader } from './components/live-mode/ClassroomLiveHeader'
import { ClassroomLiveStatsBar } from './components/live-mode/ClassroomLiveStatsBar'
import { ClassroomChildrenGrid } from './components/live-mode/ClassroomChildrenGrid'
import { ClassroomLiveEmptyState } from './components/live-mode/ClassroomLiveEmptyState'
import { ClassroomActivityTimer } from './components/live-mode/ClassroomActivityTimer'
import { ClassroomPickupAlerts } from './components/live-mode/ClassroomPickupAlerts'
import { ChildQuickActionModal } from './components/live-mode/ChildQuickActionModal'
import type { ClassroomItem } from './types'

export const ClassroomsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'live'>('overview')
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [classroomToEdit, setClassroomToEdit] = useState<ClassroomItem | null>(null)
  const [classroomToDelete, setClassroomToDelete] = useState<ClassroomItem | null>(null)
  const [isDeletingClassroom, setIsDeletingClassroom] = useState(false)
  const [isPickupAlertsOpen, setIsPickupAlertsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Data Hooks
  const classroomsData = useClassroomsData()
  const liveMode = useClassroomLiveMode(selectedClassroomId, classroomsData.allClassrooms)
  const timer = useClassroomTimer()

  const handleEnterLiveMode = (classroomId?: string) => {
    const targetId = classroomId || classroomsData.classrooms[0]?.id || null
    setSelectedClassroomId(targetId)
    setViewMode('live')
  }

  const handleExitLiveMode = () => {
    setViewMode('overview')
  }

  const handleOpenAddModal = () => {
    setClassroomToEdit(null)
    setIsAddEditModalOpen(true)
  }

  const handleOpenEditModal = (c: ClassroomItem) => {
    setClassroomToEdit(c)
    setIsAddEditModalOpen(true)
  }

  const handleDeleteClassroom = (c: ClassroomItem) => {
    setClassroomToDelete(c)
  }

  const handleConfirmDelete = async () => {
    if (!classroomToDelete) return
    setIsDeletingClassroom(true)
    try {
      await classroomsData.deleteClassroom(classroomToDelete.id)
      setClassroomToDelete(null)
      if (selectedClassroomId === classroomToDelete.id) {
        setSelectedClassroomId(null)
      }
    } finally {
      setIsDeletingClassroom(false)
    }
  }

  const handleSaveClassroom = async (data: {
    name: string
    capacity: number
    room?: string | null
    teacherId?: string | null
  }) => {
    if (classroomToEdit) {
      await classroomsData.updateClassroom({ id: classroomToEdit.id, ...data })
    } else {
      await classroomsData.createClassroom(data)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreen(false)
    }
  }

  return (
    <div className="flex flex-col w-full gap-y-6 pb-12 select-none">
      {viewMode === 'overview' ? (
        <>
          <ClassroomsHeaderBanner
            searchQuery={classroomsData.searchQuery}
            onSearchChange={classroomsData.setSearchQuery}
            onAddClassroom={handleOpenAddModal}
            onEnterLiveMode={() => handleEnterLiveMode()}
            onRefresh={classroomsData.refetch}
            isLoading={classroomsData.isLoading}
          />

          <ClassroomsMetrics metrics={classroomsData.metrics} />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">grid_view</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  قاعات وفصول الروضة
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption">
                  {classroomsData.classrooms.length} قاعات مسجلة
                </span>
              </div>
            </div>

            {classroomsData.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-surface-container-low animate-pulse" />
                ))}
              </div>
            ) : classroomsData.classrooms.length === 0 ? (
              <ClassroomOverviewEmptyState onAddClassroom={handleOpenAddModal} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {classroomsData.classrooms.map((c) => (
                  <ClassroomCard
                    key={c.id}
                    classroom={c}
                    onEnterLiveMode={handleEnterLiveMode}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteClassroom}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : classroomsData.allClassrooms.length === 0 ? (
        <ClassroomLiveEmptyState
          onAddClassroom={handleOpenAddModal}
          onExitLiveMode={handleExitLiveMode}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <ClassroomLiveHeader
            classrooms={classroomsData.allClassrooms}
            currentClassroom={liveMode.currentClassroom}
            onSelectClassroom={(id) => setSelectedClassroomId(id)}
            currentPeriod={liveMode.currentPeriod}
            onOpenTimer={() => liveMode.setIsTimerOpen(true)}
            isTimerRunning={timer.isRunning}
            timerFormatted={timer.formattedTime}
            pickupAlertsCount={liveMode.pickupAlerts.length}
            onTogglePickupAlerts={() => setIsPickupAlertsOpen(true)}
            onExitLiveMode={handleExitLiveMode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />

          <ClassroomLiveStatsBar
            stats={liveMode.stats}
            filterStatus={liveMode.filterStatus}
            onFilterChange={liveMode.setFilterStatus}
            searchQuery={liveMode.searchStudentQuery}
            onSearchChange={liveMode.setSearchStudentQuery}
            onMarkAllPresent={liveMode.markAllPresent}
          />

          <ClassroomChildrenGrid
            students={liveMode.students}
            isLoading={liveMode.isLoadingStudents}
            onMarkAttendance={(childId, status) => liveMode.markAttendance({ childId, status })}
            onOpenQuickAction={(student) => liveMode.setSelectedChildForQuickAction(student)}
          />

          {liveMode.undoToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 animate-scale-in">
              <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
              <span className="font-label-lg text-label-lg font-medium">{liveMode.undoToast.message}</span>
              <button
                type="button"
                onClick={liveMode.executeUndo}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-colors"
              >
                تراجع عن التحديد
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add or Edit Classroom */}
      <AddEditClassroomModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        classroomToEdit={classroomToEdit}
        staffList={classroomsData.staffList}
        onSubmit={handleSaveClassroom}
        isSubmitting={classroomsData.isCreating || classroomsData.isUpdating}
      />

      {/* Modal: Confirm Delete Classroom */}
      <ConfirmDeleteClassroomModal
        isOpen={!!classroomToDelete}
        classroomName={classroomToDelete?.name || ''}
        classroomId={classroomToDelete?.id}
        isDeleting={isDeletingClassroom}
        onClose={() => setClassroomToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal: Classroom Activity Timer */}
      <ClassroomActivityTimer
        isOpen={liveMode.isTimerOpen}
        onClose={() => liveMode.setIsTimerOpen(false)}
        timer={timer}
      />

      {/* Modal: Classroom Pickup Alerts */}
      <ClassroomPickupAlerts
        isOpen={isPickupAlertsOpen}
        onClose={() => setIsPickupAlertsOpen(false)}
        alerts={liveMode.pickupAlerts}
        onDismissAlert={liveMode.dismissPickupAlert}
      />

      {/* Modal: Child Quick Action */}
      <ChildQuickActionModal
        student={liveMode.selectedChildForQuickAction}
        isOpen={!!liveMode.selectedChildForQuickAction}
        onClose={() => liveMode.setSelectedChildForQuickAction(null)}
        onSaveQuickLog={liveMode.saveQuickLog}
      />
    </div>
  )
}
