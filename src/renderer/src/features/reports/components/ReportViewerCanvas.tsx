import React from 'react'
import { ClassroomRosterReport } from './ClassroomRosterReport'
import { StudentCardsReport } from './StudentCardsReport'
import { AttendanceAuditReport } from './AttendanceAuditReport'
import { FinancialSummaryReport } from './FinancialSummaryReport'
import { ClinicRegistryReport } from './ClinicRegistryReport'
import { RegistrationFormReport } from './RegistrationFormReport'
import { GateReceiptReport } from './GateReceiptReport'
import type {
  ReportType,
  ChildItem,
  ClassroomItem,
  InvoiceItem,
  CriticalAllergyChild,
  ClinicVisitItem
} from '../types'

interface ReportViewerCanvasProps {
  isLoading: boolean
  activeReport: ReportType
  childrenList: ChildItem[]
  classrooms: ClassroomItem[]
  selectedClassroomId: string
  kindergartenName: string
  branchName: string
  academicYear: string
  invoices: InvoiceItem[]
  period: string
  allergiesList: CriticalAllergyChild[]
  clinicVisits: ClinicVisitItem[]
}

export const ReportViewerCanvas: React.FC<ReportViewerCanvasProps> = ({
  isLoading,
  activeReport,
  childrenList,
  classrooms,
  selectedClassroomId,
  kindergartenName,
  branchName,
  academicYear,
  invoices,
  period,
  allergiesList,
  clinicVisits
}) => {
  if (isLoading) {
    return (
      <div className="py-24 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant gap-3">
        <span className="material-symbols-outlined text-[40px] animate-spin text-primary">
          progress_activity
        </span>
        <span className="text-body-md font-semibold">جاري تجهيز وتنسيق التقرير للطباعة...</span>
      </div>
    )
  }

  return (
    <>
      {activeReport === 'roster' && (
        <ClassroomRosterReport
          childrenList={childrenList}
          classrooms={classrooms}
          selectedClassroomId={selectedClassroomId}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
        />
      )}

      {activeReport === 'registration' && (
        <RegistrationFormReport
          childrenList={childrenList}
          classrooms={classrooms}
          selectedClassroomId={selectedClassroomId}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
        />
      )}

      {activeReport === 'cards' && (
        <StudentCardsReport
          childrenList={childrenList}
          classrooms={classrooms}
          selectedClassroomId={selectedClassroomId}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
        />
      )}

      {activeReport === 'receipt' && (
        <GateReceiptReport
          childrenList={childrenList}
          classrooms={classrooms}
          selectedClassroomId={selectedClassroomId}
          kindergartenName={kindergartenName}
          branchName={branchName}
        />
      )}

      {activeReport === 'attendance' && (
        <AttendanceAuditReport
          childrenList={childrenList}
          classrooms={classrooms}
          selectedClassroomId={selectedClassroomId}
          period={period}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
        />
      )}

      {activeReport === 'finance' && (
        <FinancialSummaryReport
          invoices={invoices}
          period={period}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
        />
      )}

      {activeReport === 'clinic' && (
        <ClinicRegistryReport
          allergiesList={allergiesList}
          clinicVisits={clinicVisits}
          kindergartenName={kindergartenName}
          branchName={branchName}
          academicYear={academicYear}
        />
      )}
    </>
  )
}
