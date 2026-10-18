import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AttendanceHeaderBar } from './components/AttendanceHeaderBar'
import { AttendanceKeypadHint } from './components/AttendanceKeypadHint'
import { AttendancePrintSheet } from './components/AttendancePrintSheet'
import { AttendanceGridSection } from './components/AttendanceGridSection'
import { useAttendanceData } from './hooks/useAttendanceData'
import { formatArabicDate } from './utils/dateHelpers'

export default function AttendancePage() {
  const navigate = useNavigate()
  const {
    selectedDate,
    setSelectedDate,
    activeClassroomId,
    setActiveClassroomId,
    activeClassroom,
    classrooms,
    students,
    counts,
    isLoading,
    isSaving,
    isSaved,
    errorMessage,
    handleStatusChange,
    handleMarkAllPresent,
    handleCommitAttendance,
  } = useAttendanceData()

  return (
    <div className="flex flex-col w-full select-none pb-24">
      {/* 1. Header Bar and Actions */}
      <div className="print:hidden">
        <AttendanceHeaderBar
          classrooms={classrooms}
          activeClassroomId={activeClassroomId}
          onClassChange={setActiveClassroomId}
          onMarkAllPresent={handleMarkAllPresent}
          onCommitAttendance={handleCommitAttendance}
          onPrintSheet={() => window.print()}
          counts={counts}
          dateString={formatArabicDate(selectedDate)}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          isSaving={isSaving}
          isSaved={isSaved}
          errorMessage={errorMessage}
        />

        {/* 2. Keypad & Touch Shortcuts Hint */}
        <AttendanceKeypadHint />
      </div>

      {/* 3. Printable sheet (printed view only) */}
      <AttendancePrintSheet
        students={students}
        activeClassroom={activeClassroom}
        selectedDate={selectedDate}
      />

      {/* 4. Interactive Student Grid */}
      <div className="print:hidden">
        <AttendanceGridSection
          isLoading={isLoading}
          classrooms={classrooms}
          activeClassroom={activeClassroom}
          students={students}
          onStatusChange={handleStatusChange}
          onNavigateSettings={() => navigate('/settings')}
          onNavigateChildren={() => navigate('/children')}
        />
      </div>
    </div>
  )
}
