import React, { useState } from 'react'
import { api } from '../../lib/api'
import { useToast } from '@/components/ui/toast'
import type { StaffMember } from '../../lib/api/types'
import { useStaffData } from './hooks/useStaffData'
import { StaffHeaderBar } from './components/StaffHeaderBar'
import { StaffKpiMetrics } from './components/StaffKpiMetrics'
import { StaffNavigationTabs } from './components/StaffNavigationTabs'
import { StaffAttendanceTab } from './components/StaffAttendanceTab'
import { StaffDirectoryTab } from './components/StaffDirectoryTab'
import { StaffLeavesTab } from './components/StaffLeavesTab'
import { StaffShortcutsBar } from './components/StaffShortcutsBar'
import { AddStaffModal } from './components/AddStaffModal'
import { RecordLeaveModal } from './components/RecordLeaveModal'
import { StaffCardModal } from './components/StaffCardModal'
import { ConfirmDeleteStaffModal } from './components/ConfirmDeleteStaffModal'

export default function StaffPage() {
  const { toast } = useToast()
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null)
  const [isDeletingStaff, setIsDeletingStaff] = useState(false)

  const {
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
  } = useStaffData()

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return
    setIsDeletingStaff(true)
    try {
      await api.staff.delete(staffToDelete.id)
      toast({
        title: 'تم حذف الموظف بنجاح',
        description: `تم إزالة بيانات الموظف «${staffToDelete.firstName} ${staffToDelete.lastName}» من كادر الروضة.`,
        variant: 'default'
      })
      setStaffToDelete(null)
      loadData()
    } catch (err: any) {
      toast({
        title: 'فشل حذف الموظف',
        description: err.message || 'تعذر إتمام عملية الحذف من قاعدة البيانات.',
        variant: 'destructive'
      })
    } finally {
      setIsDeletingStaff(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-140px)] bg-background select-none">
      {/* 1. Header & Actions Banner */}
      <StaffHeaderBar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={loadData}
        onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
        onOpenAddStaffModal={() => {
          setEditingStaff(null)
          setIsAddStaffOpen(true)
        }}
      />

      {/* 2. Bento KPI Metric Cards */}
      <StaffKpiMetrics
        stats={stats}
        attendanceRate={attendanceRate}
        selectedDate={selectedDate}
      />

      {/* 3. Main Workspace with Navigation Tabs */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col flex-1">
        <StaffNavigationTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          attendanceCount={attendanceSheet.length}
          staffCount={staffList.length}
          leavesCount={leavesList.length}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          uniqueRoles={uniqueRoles}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          directoryViewMode={directoryViewMode}
          onDirectoryViewModeChange={setDirectoryViewMode}
          onMarkAllPresent={handleMarkAllPresent}
          onSaveAttendance={handleSaveAttendance}
          isSavingAttendance={isSavingAttendance}
        />

        {activeTab === 'attendance' && (
          <StaffAttendanceTab
            selectedDate={selectedDate}
            attendanceSheet={attendanceSheet}
            attendanceDraft={attendanceDraft}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onNoteChange={handleNoteChange}
            onOpenAddStaffModal={() => setIsAddStaffOpen(true)}
          />
        )}

        {activeTab === 'directory' && (
          <StaffDirectoryTab
            isLoading={isLoading}
            filteredStaff={filteredStaff}
            directoryViewMode={directoryViewMode}
            onEdit={(staff) => {
              setEditingStaff(staff)
              setIsAddStaffOpen(true)
            }}
            onToggleActive={handleToggleActive}
            onOpenCard={(staff) => setStaffForCard(staff)}
            onDelete={(staff) => setStaffToDelete(staff)}
          />
        )}

        {activeTab === 'leaves' && (
          <StaffLeavesTab
            isLoading={isLoading}
            leavesList={leavesList}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
          />
        )}
      </div>

      {/* 4. Keyboard Shortcuts & Offline Strip */}
      <StaffShortcutsBar />

      {/* 5. Modals */}
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

      <ConfirmDeleteStaffModal
        isOpen={Boolean(staffToDelete)}
        staffMember={staffToDelete}
        isDeleting={isDeletingStaff}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleDeleteStaff}
      />
    </div>
  )
}
