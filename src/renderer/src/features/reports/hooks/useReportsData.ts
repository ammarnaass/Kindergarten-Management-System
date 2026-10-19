import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import type {
  ReportType,
  ChildItem,
  ClassroomItem,
  InvoiceItem,
  CriticalAllergyChild,
  ClinicVisitItem,
  AttendanceRecordItem
} from '../types'

export function useReportsData() {
  const { toast } = useToast()
  const [activeReport, setActiveReport] = useState<ReportType>('roster')
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('ALL')
  const [period, setPeriod] = useState<string>(() => new Date().toISOString().slice(0, 7))

  // Data states
  const [childrenList, setChildrenList] = useState<ChildItem[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [allergiesList, setAllergiesList] = useState<CriticalAllergyChild[]>([])
  const [clinicVisits, setClinicVisits] = useState<ClinicVisitItem[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordItem[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [childRes, classRes, invRes, allergRes, visitRes, settRes, attendRes] = await Promise.all([
        api.children.list({ limit: 100, offset: 0 }),
        api.classrooms.list(),
        api.finance.list({ limit: 100, offset: 0, status: 'all' }),
        api.health.criticalAllergies(),
        api.health.clinicVisits(),
        api.settings.getAll(),
        api.attendance.list({})
      ])

      setChildrenList(childRes.items)
      setClassrooms(classRes)
      setInvoices(invRes.items)
      setAllergiesList(allergRes)
      setClinicVisits(visitRes)
      setSettings(settRes || {})
      setAttendanceRecords((attendRes as any[]) || [])
    } catch (err: any) {
      toast({
        title: 'خطأ أثناء تحميل بيانات التقارير',
        description: err.message || 'تعذر جلب السجلات من قاعدة البيانات المحلية.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const kindergartenName = settings['branch.kindergartenNameAr'] || 'روضتي الأهلية النموذجية'
  const branchName = settings['branch.branchName'] || 'الفرع الرئيسي'
  const academicYear = settings['appearance.activeAcademicYear'] || '1446-1447هـ (2024-2025م)'

  return {
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
    attendanceRecords,
    isLoading,
    loadData,
    kindergartenName,
    branchName,
    academicYear
  }
}
