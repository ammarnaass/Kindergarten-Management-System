import React from 'react'
import { useHealthData } from './hooks/useHealthData'
import { HealthHeaderBanner } from './components/HealthHeaderBanner'
import { HealthStatsCards } from './components/HealthStatsCards'
import { HealthNavigationTabs } from './components/HealthNavigationTabs'
import { ClinicVisitsTab } from './components/ClinicVisitsTab'
import { CriticalAllergiesTab } from './components/CriticalAllergiesTab'
import { MedicationsLogTab } from './components/MedicationsLogTab'
import { IncidentsLogTab } from './components/IncidentsLogTab'
import { RecordClinicVisitModal } from './components/RecordClinicVisitModal'
import { RecordIncidentModal } from './components/RecordIncidentModal'
import { RecordMedicationModal } from './components/RecordMedicationModal'

export default function HealthPage() {
  const {
    todayStr,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    clinicModalOpen,
    setClinicModalOpen,
    incidentModalOpen,
    setIncidentModalOpen,
    medicationModalOpen,
    setMedicationModalOpen,
    stats,
    filteredVisits,
    visitsLoading,
    filteredAllergies,
    allergiesLoading,
    filteredMedications,
    medicationsLoading,
    filteredIncidents,
    incidentsLoading,
    handlePrint
  } = useHealthData()

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-24">
      {/* 1. Header Banner */}
      <HealthHeaderBanner
        todayStr={todayStr}
        onOpenClinicModal={() => setClinicModalOpen(true)}
        onOpenIncidentModal={() => setIncidentModalOpen(true)}
        onOpenMedicationModal={() => setMedicationModalOpen(true)}
        onPrint={handlePrint}
      />

      {/* 2. KPI Metrics Stats */}
      <HealthStatsCards stats={stats} />

      {/* 3. Navigation Tabs and Content */}
      <div className="flex flex-col gap-4">
        <HealthNavigationTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
          {activeTab === 'visits' && (
            <ClinicVisitsTab visits={filteredVisits} isLoading={visitsLoading} />
          )}

          {activeTab === 'allergies' && (
            <CriticalAllergiesTab allergies={filteredAllergies} isLoading={allergiesLoading} />
          )}

          {activeTab === 'medications' && (
            <MedicationsLogTab medications={filteredMedications} isLoading={medicationsLoading} />
          )}

          {activeTab === 'incidents' && (
            <IncidentsLogTab incidents={filteredIncidents} isLoading={incidentsLoading} />
          )}
        </div>
      </div>

      {/* 4. Action Modals */}
      <RecordClinicVisitModal
        isOpen={clinicModalOpen}
        onClose={() => setClinicModalOpen(false)}
      />

      <RecordIncidentModal
        isOpen={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
      />

      <RecordMedicationModal
        isOpen={medicationModalOpen}
        onClose={() => setMedicationModalOpen(false)}
      />
    </div>
  )
}
