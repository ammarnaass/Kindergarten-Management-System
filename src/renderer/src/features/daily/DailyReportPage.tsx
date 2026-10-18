import React from 'react'
import { useDailyReportData } from './hooks/useDailyReportData'
import { DailyHeaderBanner } from './components/DailyHeaderBanner'
import { DailyClassroomTabs } from './components/DailyClassroomTabs'
import { DailyMetricsCards } from './components/DailyMetricsCards'
import { DailyChildrenRoster } from './components/DailyChildrenRoster'
import { DailyReportEditor } from './components/DailyReportEditor'

export default function DailyReportPage() {
  const {
    selectedDate,
    setSelectedDate,
    selectedClassroomId,
    setSelectedClassroomId,
    selectedChildId,
    setSelectedChildId,
    childSearch,
    setChildSearch,
    filterStatus,
    setFilterStatus,
    activeChild,
    classrooms,
    childrenLoading,
    filteredChildren,
    stats,
    formState,
    setMood,
    setBreakfastValue,
    setBreakfastNote,
    setLunchValue,
    setLunchNote,
    setSnackNote,
    setNapValue,
    setNapTime,
    setActivities,
    setTeacherNote,
    setGuardianNotice,
    isSaving,
    saveReport,
    handlePrint
  } = useDailyReportData()

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-24">
      {/* 1. Header Banner & Date Selector */}
      <DailyHeaderBanner
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onPrint={handlePrint}
        hasActiveChild={Boolean(activeChild)}
      />

      {/* 2. Classroom Switcher Tabs */}
      <DailyClassroomTabs
        classrooms={classrooms}
        selectedClassroomId={selectedClassroomId}
        onSelectClassroom={(id) => {
          setSelectedClassroomId(id)
          setSelectedChildId(null)
        }}
      />

      {/* 3. Daily Stats KPI Cards */}
      <DailyMetricsCards stats={stats} />

      {/* 4. Main Workbench: Children Roster (Left) & Report Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <DailyChildrenRoster
          childrenList={filteredChildren}
          isLoading={childrenLoading}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
          searchQuery={childSearch}
          onSearchChange={setChildSearch}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <DailyReportEditor
          activeChild={activeChild}
          selectedDate={selectedDate}
          form={formState}
          isSaving={isSaving}
          onSave={saveReport}
          onMoodChange={setMood}
          onBreakfastValueChange={setBreakfastValue}
          onBreakfastNoteChange={setBreakfastNote}
          onLunchValueChange={setLunchValue}
          onLunchNoteChange={setLunchNote}
          onSnackNoteChange={setSnackNote}
          onNapValueChange={setNapValue}
          onNapTimeChange={setNapTime}
          onActivitiesChange={setActivities}
          onTeacherNoteChange={setTeacherNote}
          onGuardianNoticeChange={setGuardianNotice}
        />
      </div>
    </div>
  )
}
