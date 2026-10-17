import { useState } from 'react'
import { useTimetable } from './hooks/useTimetable'
import { useCurrentPeriod } from './hooks/useCurrentPeriod'
import { CurrentPeriodHeroCard } from './components/CurrentPeriodHeroCard'
import { TimetableTimelineView } from './components/TimetableTimelineView'
import { PeriodEditModal } from './components/PeriodEditModal'
import { StaffDutyRosterSection } from './components/StaffDutyRosterSection'
import { DutyEditModal } from './components/DutyEditModal'
import { PrintableTimetableSheet } from './components/PrintableTimetableSheet'
import type { TimetablePeriod, StaffDuty } from './types'

export function TimetablePage() {
  const {
    periods,
    duties,
    classrooms,
    staffList,
    loading,
    selectedClassroomId,
    setSelectedClassroomId,
    selectedDayOfWeek,
    setSelectedDayOfWeek,
    savePeriod,
    deletePeriod,
    saveDuty,
    deleteDuty
  } = useTimetable()

  const periodStatus = useCurrentPeriod(periods)

  const [activeTab, setActiveTab] = useState<'master' | 'classrooms' | 'duties'>('master')

  // Modals state
  const [periodModalOpen, setPeriodModalOpen] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<TimetablePeriod | null>(null)

  const [dutyModalOpen, setDutyModalOpen] = useState(false)
  const [editingDuty, setEditingDuty] = useState<StaffDuty | null>(null)

  const [printSheetOpen, setPrintSheetOpen] = useState(false)

  const handleOpenNewPeriod = () => {
    setEditingPeriod(null)
    setPeriodModalOpen(true)
  }

  const handleEditPeriod = (period: TimetablePeriod) => {
    setEditingPeriod(period)
    setPeriodModalOpen(true)
  }

  const handleOpenNewDuty = () => {
    setEditingDuty(null)
    setDutyModalOpen(true)
  }

  const handleEditDuty = (duty: StaffDuty) => {
    setEditingDuty(duty)
    setDutyModalOpen(true)
  }

  const currentClassroomName = classrooms.find((c) => c.id === selectedClassroomId)?.name || null

  return (
    <div className="space-y-space-md select-none">
      {/* 1. Page Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[28px]">schedule</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
              توقيت الروضة والجدول الزمني اليومي
            </h1>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            إدارة فترات اليوم الدراسي، الحصص، الوجبات، اللعب الحر، ومناوبات الكادر التعليمي.
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center p-1 bg-surface-container rounded-xl border border-outline-variant/30 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('master')
              setSelectedClassroomId(null)
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-label-md flex items-center gap-1.5 transition-all ${
              activeTab === 'master'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-base">view_timeline</span>
            <span>الجدول العام المعتمد</span>
          </button>

          <button
            onClick={() => setActiveTab('classrooms')}
            className={`px-3 py-1.5 rounded-lg font-bold text-label-md flex items-center gap-1.5 transition-all ${
              activeTab === 'classrooms'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-base">meeting_room</span>
            <span>جداول الفصول</span>
          </button>

          <button
            onClick={() => setActiveTab('duties')}
            className={`px-3 py-1.5 rounded-lg font-bold text-label-md flex items-center gap-1.5 transition-all ${
              activeTab === 'duties'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>مناوبات الكادر والإشراف</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Period Tracker Hero Card (Active across all tabs) */}
      <CurrentPeriodHeroCard
        status={periodStatus}
        onOpenNewPeriod={handleOpenNewPeriod}
        onPrint={() => setPrintSheetOpen(true)}
      />

      {/* 3. Classrooms Sub-Filter (Visible on classrooms tab) */}
      {activeTab === 'classrooms' && (
        <div className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-2xs">
          <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
          <span className="text-label-md font-semibold text-on-surface">اختر الفصل لعرض جدوله المخصص:</span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedClassroomId(null)}
              className={`px-3 py-1.5 rounded-xl font-bold text-label-sm transition-all whitespace-nowrap ${
                selectedClassroomId === null
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
              type="button"
            >
              كافة الفصول (الافتراضي)
            </button>

            {classrooms.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClassroomId(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-label-sm transition-all whitespace-nowrap ${
                  selectedClassroomId === c.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
                type="button"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Main Body Content Based on Active Tab */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary mb-2">progress_activity</span>
          <span className="text-body-sm text-on-surface-variant">جاري تحميل وتحديث فترات الجدول الزمني...</span>
        </div>
      ) : activeTab === 'duties' ? (
        <StaffDutyRosterSection
          duties={duties}
          selectedDay={selectedDayOfWeek}
          onSelectDay={setSelectedDayOfWeek}
          onAddDuty={handleOpenNewDuty}
          onEditDuty={handleEditDuty}
          onDeleteDuty={deleteDuty}
        />
      ) : (
        <TimetableTimelineView
          periods={periods}
          activePeriodId={periodStatus.currentPeriod?.id || null}
          onEdit={handleEditPeriod}
          onDelete={deletePeriod}
        />
      )}

      {/* 5. Period Edit/Create Modal */}
      <PeriodEditModal
        isOpen={periodModalOpen}
        onClose={() => setPeriodModalOpen(false)}
        onSave={savePeriod}
        initialPeriod={editingPeriod}
        staffList={staffList}
        classrooms={classrooms}
        defaultClassroomId={selectedClassroomId}
      />

      {/* 6. Staff Duty Edit/Create Modal */}
      <DutyEditModal
        isOpen={dutyModalOpen}
        onClose={() => setDutyModalOpen(false)}
        onSave={saveDuty}
        initialDuty={editingDuty}
        staffList={staffList}
        defaultDayOfWeek={selectedDayOfWeek}
      />

      {/* 7. Printable A4 Sheet Modal */}
      {printSheetOpen && (
        <PrintableTimetableSheet
          periods={periods}
          classroomName={currentClassroomName}
          kindergartenName="روضتي الأهلية النموذجية"
          academicYear="1446-1447هـ"
          onClose={() => setPrintSheetOpen(false)}
        />
      )}
    </div>
  )
}

export default TimetablePage
