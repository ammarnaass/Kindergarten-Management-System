import React from 'react'
import { ReportsHeaderBar } from './components/ReportsHeaderBar'
import { ReportTypeSwitcherStrip } from './components/ReportTypeSwitcherStrip'
import { ReportFilterToolbar } from './components/ReportFilterToolbar'
import { ReportViewerCanvas } from './components/ReportViewerCanvas'
import { useReportsData } from './hooks/useReportsData'

export default function ReportsPage() {
  const {
    activeReport,
    setActiveReport,
    selectedClassroomId,
    setSelectedClassroomId,
    period,
    setPeriod,
    childrenList,
    classrooms,
    invoices,
    allergiesList,
    clinicVisits,
    isLoading,
    loadData,
    kindergartenName,
    branchName,
    academicYear
  } = useReportsData()

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-140px)] bg-background">
      {/* 1. Header Bar with Refresh & Print */}
      <ReportsHeaderBar onRefresh={loadData} onPrint={() => window.print()} />

      {/* 2. Report Type Switcher Strip */}
      <ReportTypeSwitcherStrip
        activeReport={activeReport}
        onSelectReport={setActiveReport}
      />

      {/* 3. Filter Toolbar */}
      <ReportFilterToolbar
        activeReport={activeReport}
        selectedClassroomId={selectedClassroomId}
        onClassroomChange={setSelectedClassroomId}
        period={period}
        onPeriodChange={setPeriod}
        childrenList={childrenList}
        classrooms={classrooms}
      />

      {/* 4. Printable Report Container Canvas */}
      <div className="flex-1 print:m-0">
        <ReportViewerCanvas
          isLoading={isLoading}
          activeReport={activeReport}
          childrenList={childrenList}
          classrooms={classrooms}
          selectedClassroomId={selectedClassroomId}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
          invoices={invoices}
          period={period}
          allergiesList={allergiesList}
          clinicVisits={clinicVisits}
        />
      </div>
    </div>
  )
}
