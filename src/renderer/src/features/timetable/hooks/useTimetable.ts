import { useState, useEffect, useCallback } from 'react'
import { ipcApi } from '@/lib/api/ipc'
import type { TimetablePeriod, StaffDuty } from '../types'
import type { ClassroomItem, StaffMember } from '@/lib/api/types'

export function useTimetable() {
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null)
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(() => {
    const day = new Date().getDay()
    // Map JS day (0=Sunday ... 4=Thursday, 5=Friday, 6=Saturday) to 0..4
    if (day >= 0 && day <= 4) return day
    return 0 // default to Sunday
  })

  const [periods, setPeriods] = useState<TimetablePeriod[]>([])
  const [duties, setDuties] = useState<StaffDuty[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [periodsRes, dutiesRes, classRes, staffRes] = await Promise.all([
        ipcApi.timetable.listPeriods(selectedClassroomId),
        ipcApi.timetable.listDuties(selectedDayOfWeek),
        ipcApi.classrooms.list().catch(() => []),
        ipcApi.staff.list().catch(() => [])
      ])

      setPeriods(periodsRes || [])
      setDuties(dutiesRes || [])
      setClassrooms(classRes || [])
      setStaffList(staffRes || [])
    } catch (err) {
      console.error('Failed to load timetable data', err)
    } finally {
      setLoading(false)
    }
  }, [selectedClassroomId, selectedDayOfWeek])

  useEffect(() => {
    loadData()
  }, [loadData])

  const savePeriod = async (input: any) => {
    await ipcApi.timetable.savePeriod(input)
    await loadData()
  }

  const deletePeriod = async (id: string) => {
    await ipcApi.timetable.deletePeriod(id)
    await loadData()
  }

  const saveDuty = async (input: any) => {
    await ipcApi.timetable.saveDuty(input)
    await loadData()
  }

  const deleteDuty = async (id: string) => {
    await ipcApi.timetable.deleteDuty(id)
    await loadData()
  }

  return {
    periods,
    duties,
    classrooms,
    staffList,
    loading,
    selectedClassroomId,
    setSelectedClassroomId,
    selectedDayOfWeek,
    setSelectedDayOfWeek,
    refresh: loadData,
    savePeriod,
    deletePeriod,
    saveDuty,
    deleteDuty
  }
}
