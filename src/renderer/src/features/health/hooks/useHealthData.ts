import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  HealthTab,
  HealthStats,
  ClinicVisitItem,
  IncidentItem,
  MedicationLogItem,
  CriticalAllergyChild
} from '../types'
import { printComprehensiveReport } from '../utils/printComprehensiveReport'

export function useHealthData() {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const [activeTab, setActiveTab] = useState<HealthTab>('visits')
  const [clinicModalOpen, setClinicModalOpen] = useState(false)
  const [incidentModalOpen, setIncidentModalOpen] = useState(false)
  const [medicationModalOpen, setMedicationModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  // 1. Stats from SQLite
  const { data: stats } = useQuery<HealthStats>({
    queryKey: ['health:stats', todayStr],
    queryFn: () => api.health.stats(todayStr)
  })

  // 2. Clinic Visits
  const { data: clinicVisits = [], isLoading: visitsLoading } = useQuery<ClinicVisitItem[]>({
    queryKey: ['health:clinicVisits'],
    queryFn: () => api.health.clinicVisits(),
    enabled: activeTab === 'visits'
  })

  // 3. Critical Allergies
  const { data: criticalAllergies = [], isLoading: allergiesLoading } = useQuery<CriticalAllergyChild[]>({
    queryKey: ['health:criticalAllergies'],
    queryFn: () => api.health.criticalAllergies(),
    enabled: activeTab === 'allergies'
  })

  // 4. Medications
  const { data: medications = [], isLoading: medicationsLoading } = useQuery<MedicationLogItem[]>({
    queryKey: ['health:medications'],
    queryFn: () => api.health.medications(),
    enabled: activeTab === 'medications'
  })

  // 5. Incidents
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<IncidentItem[]>({
    queryKey: ['health:incidents'],
    queryFn: () => api.health.incidents(),
    enabled: activeTab === 'incidents'
  })

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        setClinicModalOpen(true)
      } else if (e.key === 'F3') {
        e.preventDefault()
        setMedicationModalOpen(true)
      } else if (e.key === 'F6') {
        e.preventDefault()
        setIncidentModalOpen(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        window.print()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handlePrint = useCallback(() => {
    printComprehensiveReport({
      date: todayStr,
      stats,
      clinicVisits
    })
  }, [todayStr, stats, clinicVisits])

  // Filtered queries
  const filteredVisits = useMemo(() => {
    if (!search) return clinicVisits
    return clinicVisits.filter(
      (v) =>
        `${v.childFirstName} ${v.childLastName}`.includes(search) ||
        v.detail.includes(search) ||
        v.kind.includes(search)
    )
  }, [clinicVisits, search])

  const filteredAllergies = useMemo(() => {
    if (!search) return criticalAllergies
    return criticalAllergies.filter(
      (a) =>
        `${a.firstName} ${a.lastName}`.includes(search) ||
        a.allergies.includes(search) ||
        (a.medicalNotes && a.medicalNotes.includes(search))
    )
  }, [criticalAllergies, search])

  const filteredMedications = useMemo(() => {
    if (!search) return medications
    return medications.filter(
      (m) =>
        `${m.childFirstName} ${m.childLastName}`.includes(search) ||
        m.medicine.includes(search) ||
        (m.dose && m.dose.includes(search))
    )
  }, [medications, search])

  const filteredIncidents = useMemo(() => {
    if (!search) return incidents
    return incidents.filter(
      (i) =>
        `${i.childFirstName} ${i.childLastName}`.includes(search) ||
        i.description.includes(search) ||
        (i.actionTaken && i.actionTaken.includes(search))
    )
  }, [incidents, search])

  return {
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
  }
}
