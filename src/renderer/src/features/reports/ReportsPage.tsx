import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import { ClassroomRosterReport } from './components/ClassroomRosterReport'
import { StudentCardsReport } from './components/StudentCardsReport'
import { AttendanceAuditReport } from './components/AttendanceAuditReport'
import { FinancialSummaryReport } from './components/FinancialSummaryReport'
import { ClinicRegistryReport } from './components/ClinicRegistryReport'
import { RegistrationFormReport } from './components/RegistrationFormReport'
import { GateReceiptReport } from './components/GateReceiptReport'
import type {
  ChildItem,
  ClassroomItem,
  InvoiceItem,
  CriticalAllergyChild,
  ClinicVisitItem
} from '@/lib/api/types'

type ReportType = 'roster' | 'cards' | 'attendance' | 'finance' | 'clinic' | 'registration' | 'receipt'

export default function ReportsPage() {
  const { toast } = useToast()
  const [activeReport, setActiveReport] = useState<ReportType>('roster')
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('ALL')
  const [period, setPeriod] = useState<string>(new Date().toISOString().slice(0, 7))

  // Data states
  const [childrenList, setChildrenList] = useState<ChildItem[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [allergiesList, setAllergiesList] = useState<CriticalAllergyChild[]>([])
  const [clinicVisits, setClinicVisits] = useState<ClinicVisitItem[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [childRes, classRes, invRes, allergRes, visitRes, settRes] = await Promise.all([
        api.children.list({ limit: 100, offset: 0 }),
        api.classrooms.list(),
        api.finance.list({ limit: 100, offset: 0, status: 'all' }),
        api.health.criticalAllergies(),
        api.health.clinicVisits(),
        api.settings.getAll()
      ])

      setChildrenList(childRes.items)
      setClassrooms(classRes)
      setInvoices(invRes.items)
      setAllergiesList(allergRes)
      setClinicVisits(visitRes)
      setSettings(settRes || {})
    } catch (err: any) {
      toast({
        title: 'خطأ أثناء تحميل بيانات التقارير',
        description: err.message || 'تعذر جلب السجلات من قاعدة البيانات المحلية.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const kindergartenName = settings['branch.kindergartenNameAr'] || 'روضتي الأهلية النموذجية'
  const branchName = settings['branch.branchName'] || 'الفرع الرئيسي'
  const academicYear = settings['appearance.activeAcademicYear'] || '1446-1447هـ (2024-2025م)'

  const REPORT_TABS = [
    { id: 'roster' as const, label: 'كشوفات قيد الفصول', icon: 'format_list_numbered', desc: 'قوائم الطلاب والبيانات الأساسية' },
    { id: 'registration' as const, label: 'استمارة التسجيل الرسمية', icon: 'description', desc: 'نموذج A4 للأرشيف والتوقيع' },
    { id: 'cards' as const, label: 'بطاقات الهوية والاستلام', icon: 'qr_code_scanner', desc: 'بطاقات PVC للبوابة بباركود مشفر' },
    { id: 'receipt' as const, label: 'سند الاستلام الأمني', icon: 'receipt_long', desc: 'إيصال 80mm حراري أو A5 للبوابة' },
    { id: 'attendance' as const, label: 'سجل الحضور والانضباط', icon: 'fact_check', desc: 'كشف الغياب والالتزام الشهري' },
    { id: 'finance' as const, label: 'مسير الرسوم والمالية', icon: 'account_balance_wallet', desc: 'ميزان المدفوعات والذمم المتبقية' },
    { id: 'clinic' as const, label: 'العيادة والحالات الحرجة', icon: 'medical_services', desc: 'الحساسيات وتنبيهات الطوارئ' }
  ]

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-140px)] bg-background">
      {/* ── Top Header & Actions ───────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[28px]">print</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-headline-md font-headline-md text-on-surface font-bold">
                مركز التقارير والمطبوعات الرسمية
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-caption text-caption font-semibold">
                نماذج A4 و A5 و 80mm و PVC معتمدة
              </span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              توليد وطباعة الوثائق الرسمية، استمارات التسجيل، بطاقات الطلاب، سندات البوابة، والتقارير بنقرة واحدة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            title="تحديث البيانات"
            className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            <span>طباعة المستند الحالي (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* ── Report Type Switcher Strip ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 print:hidden">
        {REPORT_TABS.map((tab) => {
          const isActive = activeReport === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveReport(tab.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-primary-container text-on-primary-container border-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-on-primary-container"></span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-label-md leading-tight">{tab.label}</h3>
                <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-on-primary-container/80' : 'text-on-surface-variant'}`}>
                  {tab.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Filter Toolbar ─────────────────────────────── */}
      <div className="bg-surface-container-lowest px-5 py-3 rounded-xl border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          {(activeReport === 'roster' || activeReport === 'cards' || activeReport === 'attendance' || activeReport === 'registration' || activeReport === 'receipt') && (
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
                الفصل الدراسي:
              </span>
              <select
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none"
              >
                <option value="ALL">جميع الفصول ({childrenList.length} أطفال)</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(activeReport === 'attendance' || activeReport === 'finance') && (
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
                فترة التقرير:
              </span>
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm font-body-sm text-on-surface focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="text-caption font-caption text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
          <span>جاهز للعرض والطباعة بدون إنترنت</span>
        </div>
      </div>

      {/* ── Printable Report Container Canvas ──────────── */}
      <div className="flex-1 print:m-0">
        {isLoading ? (
          <div className="py-24 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-[40px] animate-spin text-primary">
              progress_activity
            </span>
            <span className="text-body-md font-semibold">جاري تجهيز وتنسيق التقرير للطباعة...</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
