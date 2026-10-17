import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { RecordClinicVisitModal } from './components/RecordClinicVisitModal'
import { RecordIncidentModal } from './components/RecordIncidentModal'
import { RecordMedicationModal } from './components/RecordMedicationModal'
import type { HealthStats, ClinicVisitItem, IncidentItem, MedicationLogItem, CriticalAllergyChild } from '@/lib/api/types'

type HealthTab = 'visits' | 'allergies' | 'medications' | 'incidents'

export default function HealthPage() {
  const todayStr = new Date().toISOString().slice(0, 10)

  const [activeTab, setActiveTab] = useState<HealthTab>('visits')
  const [clinicModalOpen, setClinicModalOpen] = useState(false)
  const [incidentModalOpen, setIncidentModalOpen] = useState(false)
  const [medicationModalOpen, setMedicationModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  // 1. مؤشرات العيادة الحقيقية من SQLite
  const { data: stats } = useQuery<HealthStats>({
    queryKey: ['health:stats', todayStr],
    queryFn: () => api.health.stats(todayStr)
  })

  // 2. مراجعات العيادة
  const { data: clinicVisits = [], isLoading: visitsLoading } = useQuery<ClinicVisitItem[]>({
    queryKey: ['health:clinicVisits'],
    queryFn: () => api.health.clinicVisits(),
    enabled: activeTab === 'visits'
  })

  // 3. الحالات الحرجة والحساسية
  const { data: criticalAllergies = [], isLoading: allergiesLoading } = useQuery<CriticalAllergyChild[]>({
    queryKey: ['health:criticalAllergies'],
    queryFn: () => api.health.criticalAllergies(),
    enabled: activeTab === 'allergies'
  })

  // 4. جدول الأدوية
  const { data: medications = [], isLoading: medicationsLoading } = useQuery<MedicationLogItem[]>({
    queryKey: ['health:medications'],
    queryFn: () => api.health.medications(),
    enabled: activeTab === 'medications'
  })

  // 5. سجل الحوادث
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<IncidentItem[]>({
    queryKey: ['health:incidents'],
    queryFn: () => api.health.incidents(),
    enabled: activeTab === 'incidents'
  })

  // اختصارات لوحة المفاتيح
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

  // طباعة السجل الصحي الشامل محلياً
  const handlePrintComprehensiveReport = () => {
    const printWin = window.open('', '_blank', 'width=800,height=600')
    if (!printWin) return

    printWin.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>سجل الصحة والسلامة المدرسية — ${todayStr}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; direction: rtl; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 20px; font-weight: bold; color: #0059ba; margin: 0; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
            .stat-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; }
            .stat-val { font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; }
            th { background: #f1f5f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">روضتي — سجل الصحة المدرسية والعيادة اليومي</h1>
            <p>تاريخ التقرير: ${todayStr} • تقرير معتمد من العيادة المدرسية</p>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <div>حالات الحساسية النشطة</div>
              <div class="stat-val" style="color:#ba1a1a;">${stats?.criticalAllergiesCount ?? 0}</div>
            </div>
            <div class="stat-box">
              <div>جرعات الأدوية الموثقة</div>
              <div class="stat-val" style="color:#825500;">${stats?.medicationsTodayCount ?? 0}</div>
            </div>
            <div class="stat-box">
              <div>مراجعات العيادة</div>
              <div class="stat-val" style="color:#0059ba;">${stats?.clinicVisitsTodayCount ?? 0}</div>
            </div>
            <div class="stat-box">
              <div>الحوادث المسجلة</div>
              <div class="stat-val" style="color:#727784;">${stats?.incidentsTodayCount ?? 0}</div>
            </div>
          </div>

          <h3>مراجعات العيادة المسجلة:</h3>
          <table>
            <thead>
              <tr>
                <th>الطفل</th>
                <th>الفصل</th>
                <th>النوع</th>
                <th>التفاصيل والإجراء</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              ${clinicVisits.length === 0 ? '<tr><td colspan="5" style="text-align:center;">لا توجد مراجعات مسجلة</td></tr>' : clinicVisits.map(v => `
                <tr>
                  <td>${v.childFirstName} ${v.childLastName}</td>
                  <td>${v.classroomName || '—'}</td>
                  <td>${v.kind}</td>
                  <td>${v.detail}</td>
                  <td>${v.recordedOn}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>نظام روضتي المكتبي • تقرير رسمي مستخرج محلياً</p>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `)
    printWin.document.close()
  }

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-24">
      {/* 1. ترويسة الصفحة وشريط الإجراءات السريعة */}
      <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-outline-variant/60">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-xs">
              <span className="material-symbols-outlined text-[28px]">medical_services</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm">
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  الصحة والسلامة المدرسية والعيادة
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-bold">
                  سجلات صحية مشفرة محلياً 100%
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                <span className="flex items-center gap-1 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                  <span>{todayStr}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">stethoscope</span>
                  <span>المناوبة الصحية: <strong>ممرضة الروضة المعتمدة</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات السريعة باختصارات المفاتيح */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setClinicModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>تسجيل مراجعة عيادة</span>
              <kbd className="px-1.5 py-0.5 rounded bg-on-primary/20 text-on-primary font-caption text-caption font-mono">
                F2
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIncidentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">emergency</span>
              <span>تسجيل حادث / واقعة</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-caption text-caption font-mono">
                F6
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setMedicationModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">medication</span>
              <span>جدول الأدوية</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-caption text-caption font-mono">
                F3
              </kbd>
            </button>

            <button
              type="button"
              onClick={handlePrintComprehensiveReport}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold shadow-2xs transition-all"
              title="طباعة التقرير الشامل"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>طباعة</span>
              <kbd className="px-1 py-0.5 rounded bg-surface-container-lowest text-2xs font-mono">
                Ctrl+P
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* 2. بطاقات المؤشرات الإكلينيكية الأربعة (Bento KPI Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* KPI 1: Critical Allergies */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">حالات حرجة ومزمنة</span>
              <span className="font-bold text-sm text-on-surface">تنبيهات الحساسية</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg font-bold text-rose-600">
                {stats?.criticalAllergiesCount ?? 0}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">أطفال مسجلين</span>
            </div>
            <span className="font-caption text-2xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
              مطبخ الروضة مفعّل
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: '100%' }} />
          </div>
          <span className="font-caption text-2xs text-on-surface-variant mt-1.5 truncate">
            متابعة فورية لقوائم الوجبات المدرسية
          </span>
        </div>

        {/* KPI 2: Medication Dispensing */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">إعطاء الأدوية بتفويض</span>
              <span className="font-bold text-sm text-on-surface">جرعات اليوم الموثقة</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">medication_liquid</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg font-bold text-on-surface">
                {stats?.medicationsTodayCount ?? 0}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">جرعات مسجلة</span>
            </div>
            <span className="font-label-sm text-2xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
              بتفويض معتمد
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '85%' }} />
          </div>
          <span className="font-caption text-2xs text-amber-800 mt-1.5 truncate flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-xs">alarm</span>
            توثيق دقيق للاسم والجرعة
          </span>
        </div>

        {/* KPI 3: Clinic Visits Today */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">حركة الاستقبال والعلاج</span>
              <span className="font-bold text-sm text-on-surface">مراجعات العيادة اليوم</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">airline_seat_recline_normal</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg font-bold text-primary">
                {stats?.clinicVisitsTodayCount ?? 0}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">حالات مفحوصة</span>
            </div>
            <span className="font-label-sm text-2xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-md font-semibold">
              مستقرة
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }} />
          </div>
          <span className="font-caption text-2xs text-on-surface-variant mt-1.5 truncate">
            قياس حرارة • إسعاف أولي • فحص
          </span>
        </div>

        {/* KPI 4: First Aid Readiness */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">حقيبة الطوارئ والإسعاف</span>
              <span className="font-bold text-sm text-on-surface">جاهزية العيادة</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">health_and_safety</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="font-display-lg text-display-lg font-bold text-emerald-600">98%</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">جاهزية كاملة</span>
            </div>
            <span className="font-caption text-2xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              جاهز
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '98%' }} />
          </div>
          <span className="font-caption text-2xs text-on-surface-variant mt-1.5 truncate">
            الأدوية والمطهرات متوفرة بالعيادة
          </span>
        </div>
      </section>

      {/* 3. تبويبات السجلات الصحية الأربعة */}
      <div className="flex flex-col gap-4">
        {/* شريط اختيار التبويب والبحث */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/60">
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            {(
              [
                { id: 'visits', label: 'مراجعات العيادة', icon: 'medical_services' },
                { id: 'allergies', label: 'الحالات الحرجة والحساسية', icon: 'warning' },
                { id: 'medications', label: 'سجل إعطاء الأدوية', icon: 'medication' },
                { id: 'incidents', label: 'سجل الحوادث والإصابات', icon: 'emergency' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-base">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-base text-outline">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في السجلات..."
              className="w-full h-9 pr-8 pl-3 rounded-xl bg-surface-container border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* محتوى الجداول التفاعلية */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
          {/* تبويب 1: مراجعات العيادة */}
          {activeTab === 'visits' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
                    <th className="py-3 px-4">الطفل</th>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">نوع الفحص</th>
                    <th className="py-3 px-4">الأعراض والإجراء المتخذ</th>
                    <th className="py-3 px-4">تاريخ المراجعة</th>
                    <th className="py-3 px-4">الحساسية المسجلة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {visitsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                        <p>جاري جلب سجل مراجعات العيادة...</p>
                      </td>
                    </tr>
                  ) : clinicVisits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-3xl text-outline mb-1">verified</span>
                        <p className="font-bold text-on-surface">لا توجد مراجعات مسجلة في العيادة</p>
                        <p className="text-2xs mt-1">اضغط F2 لتسجيل كشف طبي أو قياس حرارة</p>
                      </td>
                    </tr>
                  ) : (
                    clinicVisits
                      .filter(
                        (v) =>
                          !search ||
                          `${v.childFirstName} ${v.childLastName} ${v.detail}`
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((v) => (
                        <tr key={v.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-on-surface">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-2xs">
                                {v.childFirstName[0]}
                              </div>
                              <span>{v.childFirstName} {v.childLastName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">{v.classroomName || '—'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-2xs">
                              {v.kind === 'clinic_visit'
                                ? 'كشف عام'
                                : v.kind === 'temperature_check'
                                  ? 'قياس حرارة'
                                  : v.kind === 'first_aid'
                                    ? 'إسعاف أولي'
                                    : v.kind}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-on-surface max-w-xs">{v.detail}</td>
                          <td className="py-3 px-4 font-mono text-on-surface-variant">{v.recordedOn}</td>
                          <td className="py-3 px-4">
                            {v.allergies ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 font-bold text-2xs">
                                {v.allergies}
                              </span>
                            ) : (
                              <span className="text-on-surface-variant">سليم</span>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* تبويب 2: الحالات الحرجة والحساسية النشطة */}
          {activeTab === 'allergies' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
                    <th className="py-3 px-4">اسم الطفل</th>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">تاريخ الميلاد</th>
                    <th className="py-3 px-4">نوع الحساسية المسجلة</th>
                    <th className="py-3 px-4">ملاحظات طبية وإجراءات الطوارئ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {allergiesLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                        <p>جاري فحص سجلات الحساسية...</p>
                      </td>
                    </tr>
                  ) : criticalAllergies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                        <p className="font-bold text-on-surface">لا توجد حالات حساسية حرجة مسجلة</p>
                      </td>
                    </tr>
                  ) : (
                    criticalAllergies
                      .filter(
                        (c) =>
                          !search ||
                          `${c.firstName} ${c.lastName} ${c.allergies}`
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-rose-50/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-on-surface">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-2xs">
                                !
                              </div>
                              <span>{c.firstName} {c.lastName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">{c.classroomName || '—'}</td>
                          <td className="py-3 px-4 font-mono text-on-surface-variant">{c.birthDate}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-700 font-bold text-2xs">
                              {c.allergies}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-on-surface max-w-sm">
                            {c.medicalNotes || 'اتخاذ الحيطة في الوجبات والتواصل الفوري مع ولي الأمر عند ظهور أعراض'}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* تبويب 3: سجل إعطاء الأدوية بتفويض */}
          {activeTab === 'medications' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
                    <th className="py-3 px-4">الطفل</th>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">الدواء المعطى</th>
                    <th className="py-3 px-4">الجرعة</th>
                    <th className="py-3 px-4">وقت الإعطاء</th>
                    <th className="py-3 px-4">المسؤول عن الإعطاء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {medicationsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                        <p>جاري جلب سجل الأدوية...</p>
                      </td>
                    </tr>
                  ) : medications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-3xl text-outline mb-1">medication</span>
                        <p className="font-bold text-on-surface">لا توجد جرعات أدوية مسجلة اليوم</p>
                        <p className="text-2xs mt-1">اضغط F3 لتوثيق إعطاء دواء بتفويض</p>
                      </td>
                    </tr>
                  ) : (
                    medications
                      .filter(
                        (m) =>
                          !search ||
                          `${m.childFirstName} ${m.childLastName} ${m.medicine}`
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-on-surface">
                            {m.childFirstName} {m.childLastName}
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">{m.classroomName || '—'}</td>
                          <td className="py-3 px-4 font-bold text-secondary">{m.medicine}</td>
                          <td className="py-3 px-4 font-semibold text-on-surface">{m.dose || '—'}</td>
                          <td className="py-3 px-4 font-mono text-on-surface-variant">{m.givenAt}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{m.givenBy || 'ممرضة الروضة'}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* تبويب 4: سجل الحوادث والإصابات */}
          {activeTab === 'incidents' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/60 font-bold text-on-surface-variant">
                    <th className="py-3 px-4">الطفل</th>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">وقت الحادث</th>
                    <th className="py-3 px-4">وصف الواقعة</th>
                    <th className="py-3 px-4">الإسعاف الأولي المتخذ</th>
                    <th className="py-3 px-4">إشعار ولي الأمر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {incidentsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                        <p>جاري جلب سجل الحوادث...</p>
                      </td>
                    </tr>
                  ) : incidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-3xl text-emerald-600 mb-1">sentiment_very_satisfied</span>
                        <p className="font-bold text-on-surface">الحمد لله، لم تُسجل أي حوادث أو إصابات</p>
                        <p className="text-2xs mt-1">يوم آمن وخالٍ من الإصابات في الروضة</p>
                      </td>
                    </tr>
                  ) : (
                    incidents
                      .filter(
                        (inc) =>
                          !search ||
                          `${inc.childFirstName} ${inc.childLastName} ${inc.description}`
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((inc) => (
                        <tr key={inc.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-on-surface">
                            {inc.childFirstName} {inc.childLastName}
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">{inc.classroomName || '—'}</td>
                          <td className="py-3 px-4 font-mono text-on-surface-variant">{inc.happenedAt}</td>
                          <td className="py-3 px-4 text-on-surface max-w-xs">{inc.description}</td>
                          <td className="py-3 px-4 text-on-surface max-w-xs">{inc.actionTaken || '—'}</td>
                          <td className="py-3 px-4">
                            {inc.notifiedGuardian ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-2xs">
                                تم الإشعار هاتفياً
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-2xs">
                                لم يُشعر بعد
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* نوافذ الإجراءات السريعة */}
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
