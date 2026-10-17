import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { ClassroomItem, DailyClassroomChild } from '@/lib/api/types'

type MoodType = 'happy' | 'calm' | 'active' | 'tired' | 'fussy'
type FoodValue = 'full' | 'half' | 'none'
type NapValue = 'good_sleep' | 'rested' | 'restless'

export default function DailyReportPage() {
  const queryClient = useQueryClient()
  const todayStr = new Date().toISOString().slice(0, 10)

  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('')
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [childSearch, setChildSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'absent' | 'allergy'>('all')

  // حقول نموذج التقرير اليومي للطفل النشط
  const [mood, setMood] = useState<MoodType | null>('happy')
  const [breakfastValue, setBreakfastValue] = useState<FoodValue | null>('full')
  const [breakfastNote, setBreakfastNote] = useState('تناول وجبته كاملة')
  const [lunchValue, setLunchValue] = useState<FoodValue | null>('full')
  const [lunchNote, setLunchNote] = useState('تناول وجبة الغداء كاملة')
  const [snackNote, setSnackNote] = useState('تناول فاكهة وعصير طبيعي')
  const [napValue, setNapValue] = useState<NapValue | null>('good_sleep')
  const [napTime, setNapTime] = useState('12:45 م - 01:45 م')
  const [activities, setActivities] = useState('رسم وتلوين، حفظ قصار السور، ألعاب حركية')
  const [teacherNote, setTeacherNote] = useState('مشاركة ممتازة وتفاعل رائع مع الأقران طوال اليوم.')
  const [guardianNotice, setGuardianNotice] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // 1. جلب الفصول
  const { data: classrooms = [] } = useQuery<ClassroomItem[]>({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list()
  })

  // تحديد أول فصل افتراضياً
  useEffect(() => {
    if (classrooms.length > 0 && !selectedClassroomId) {
      setSelectedClassroomId(classrooms[0].id)
    }
  }, [classrooms, selectedClassroomId])

  // 2. جلب أطفال الفصل وحالة تقاريرهم لهذا التاريخ
  const { data: classroomChildren = [], isLoading: childrenLoading, refetch: refetchClassroom } = useQuery<DailyClassroomChild[]>({
    queryKey: ['daily:listByClassroom', selectedClassroomId, selectedDate],
    queryFn: () =>
      selectedClassroomId
        ? api.daily.listByClassroom(selectedClassroomId, selectedDate)
        : Promise.resolve([]),
    enabled: Boolean(selectedClassroomId)
  })

  // تحديد الطفل الأول تلقائياً عند تغيير الفصل أو التاريخ
  useEffect(() => {
    if (classroomChildren.length > 0) {
      if (!selectedChildId || !classroomChildren.some((c) => c.id === selectedChildId)) {
        setSelectedChildId(classroomChildren[0].id)
      }
    } else {
      setSelectedChildId(null)
    }
  }, [classroomChildren, selectedChildId])

  // الطفل المحدد حالياً
  const activeChild = useMemo(() => {
    if (!selectedChildId) return null
    return classroomChildren.find((c) => c.id === selectedChildId) ?? null
  }, [classroomChildren, selectedChildId])

  // 3. جلب التقرير الفعلي المخزن للطفل المحدد
  const { data: currentReport, isLoading: reportLoading } = useQuery({
    queryKey: ['daily:get', selectedChildId, selectedDate],
    queryFn: () =>
      selectedChildId ? api.daily.get(selectedChildId, selectedDate) : Promise.resolve(null),
    enabled: Boolean(selectedChildId)
  })

  // تعبئة النموذج من البيانات المحفوظة في SQLite أو الافتراضية
  useEffect(() => {
    if (currentReport) {
      setMood((currentReport.mood as MoodType) || 'happy')
      setTeacherNote(currentReport.summary || '')

      const bItem = currentReport.items?.find((i) => i.category === 'breakfast')
      if (bItem) {
        setBreakfastValue((bItem.value as FoodValue) || 'full')
        setBreakfastNote(bItem.note || '')
      }

      const lItem = currentReport.items?.find((i) => i.category === 'lunch')
      if (lItem) {
        setLunchValue((lItem.value as FoodValue) || 'full')
        setLunchNote(lItem.note || '')
      }

      const sItem = currentReport.items?.find((i) => i.category === 'snack')
      if (sItem) setSnackNote(sItem.note || '')

      const nItem = currentReport.items?.find((i) => i.category === 'nap')
      if (nItem) {
        setNapValue((nItem.value as NapValue) || 'good_sleep')
        setNapTime(nItem.note || '12:45 م - 01:45 م')
      }

      const aItem = currentReport.items?.find((i) => i.category === 'activities')
      if (aItem) setActivities(aItem.note || '')

      const gItem = currentReport.items?.find((i) => i.category === 'guardian_notice')
      if (gItem) setGuardianNotice(gItem.note || '')

      setIsSaved(true)
    } else {
      // إعدادات افتراضية لطيفة للطفل
      setMood('happy')
      setBreakfastValue('full')
      setBreakfastNote('تناول وجبته كاملة بنشاط')
      setLunchValue('full')
      setLunchNote('تناول وجبة الغداء بالكامل')
      setSnackNote('تناول فاكهة وعصير طبيعي')
      setNapValue('good_sleep')
      setNapTime('12:45 م - 01:45 م')
      setActivities('رسم وتلوين، حفظ قصار السور، ألعاب حركية')
      setTeacherNote('مشاركة ممتازة وتفاعل إيجابي مع أقرانه.')
      setGuardianNotice('')
      setIsSaved(false)
    }
  }, [currentReport, selectedChildId])

  // حفظ التقرير
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedChildId) throw new Error('يرجى اختيار طفل')
      return api.daily.save({
        childId: selectedChildId,
        date: selectedDate,
        mood,
        summary: teacherNote,
        items: [
          { category: 'breakfast', value: breakfastValue, note: breakfastNote },
          { category: 'lunch', value: lunchValue, note: lunchNote },
          { category: 'snack', value: 'snack', note: snackNote },
          { category: 'nap', value: napValue, note: napTime },
          { category: 'activities', value: 'educational', note: activities },
          { category: 'guardian_notice', value: 'notice', note: guardianNotice }
        ]
      })
    },
    onSuccess: () => {
      setIsSaved(true)
      queryClient.invalidateQueries({ queryKey: ['daily:listByClassroom'] })
      queryClient.invalidateQueries({ queryKey: ['daily:get', selectedChildId, selectedDate] })
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم حفظ التقرير اليومي للطفل في قاعدة البيانات المحلية`
      })
    },
    onError: (err: any) => {
      toast({
        title: 'فشل الحفظ',
        description: err.message || 'حدث خطأ أثناء حفظ التقرير',
        variant: 'destructive'
      })
    }
  })

  // إحصائيات سريعة للفصل
  const stats = useMemo(() => {
    const total = classroomChildren.length
    const completed = classroomChildren.filter((c) => c.reportStatus === 'completed').length
    const absent = classroomChildren.filter((c) => c.reportStatus === 'absent').length
    const withAllergies = classroomChildren.filter((c) => Boolean(c.allergies)).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, absent, withAllergies, percent }
  }, [classroomChildren])

  // تصفية قائمة الأطفال
  const filteredChildren = useMemo(() => {
    return classroomChildren.filter((c) => {
      const matchName =
        !childSearch ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(childSearch.toLowerCase())

      if (!matchName) return false

      if (filterStatus === 'completed') return c.reportStatus === 'completed'
      if (filterStatus === 'pending') return c.reportStatus === 'pending' || c.reportStatus === 'in_progress'
      if (filterStatus === 'absent') return c.reportStatus === 'absent'
      if (filterStatus === 'allergy') return Boolean(c.allergies)
      return true
    })
  }, [classroomChildren, childSearch, filterStatus])

  // طباعة تقرير فردي أنيق A5 لولي الأمر
  const handlePrintSingleReport = () => {
    if (!activeChild) return
    const activeClassroom = classrooms.find((c) => c.id === selectedClassroomId)

    const printWin = window.open('', '_blank', 'width=800,height=600')
    if (!printWin) return

    const moodArabic = {
      happy: '😊 سعيد ومبتهج',
      calm: '😌 هادئ ومستقر',
      active: '⚡ نشيط وحيوي',
      tired: '😴 متعب / قليل النوم',
      fussy: '😢 متقلب المزاج'
    }[mood || 'happy']

    const foodArabic = (v: FoodValue | null) =>
      v === 'full' ? 'أكلها كاملة 💯' : v === 'half' ? 'نصف الوجبة 🥣' : 'لم يرغب بالأكل ❌'

    const napArabic = (v: NapValue | null) =>
      v === 'good_sleep' ? 'نام بهدوء وعمق 🛌' : v === 'rested' ? 'استرخاء وهدوء 📖' : 'قلق أو لم ينم ⚠️'

    printWin.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>التقرير اليومي — ${activeChild.firstName} ${activeChild.lastName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; direction: rtl; color: #1e293b; background: #fff; }
            .card { border: 2px solid #0059ba; border-radius: 16px; padding: 20px; max-width: 650px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 20px; font-weight: bold; color: #0059ba; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; background: #f8faff; padding: 10px; border-radius: 10px; margin-bottom: 16px; }
            .section { margin-bottom: 14px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
            .section-title { font-size: 13px; font-weight: bold; color: #0059ba; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
            .item-row { font-size: 12px; margin-bottom: 4px; }
            .notice-box { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; border-radius: 8px; padding: 8px; font-size: 12px; margin-top: 10px; }
            .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="title">روضتي — التقرير اليومي للطفل</h1>
              <p class="subtitle">يومية الملاحظات والأنشطة والرعاية المدرسية</p>
            </div>

            <div class="info-grid">
              <div><strong>اسم الطفل:</strong> ${activeChild.firstName} ${activeChild.lastName}</div>
              <div><strong>التاريخ:</strong> ${selectedDate}</div>
              <div><strong>الفصل:</strong> ${activeClassroom?.name || '—'}</div>
              <div><strong>الحالة المزاجية:</strong> ${moodArabic}</div>
            </div>

            <div class="section">
              <div class="section-title">🥣 التغذية والوجبات</div>
              <div class="item-row"><strong>وجبة الإفطار:</strong> ${foodArabic(breakfastValue)} — ${breakfastNote}</div>
              <div class="item-row"><strong>وجبة الغداء:</strong> ${foodArabic(lunchValue)} — ${lunchNote}</div>
              <div class="item-row"><strong>سناك العصر:</strong> ${snackNote}</div>
            </div>

            <div class="section">
              <div class="section-title">🛌 فترة القيلولة والراحة</div>
              <div class="item-row"><strong>الحالة:</strong> ${napArabic(napValue)} (${napTime})</div>
            </div>

            <div class="section">
              <div class="section-title">🎨 الأنشطة التعليمية والتربوية</div>
              <div class="item-row">${activities}</div>
              <div class="item-row" style="margin-top:6px;"><strong>ملاحظة المعلمة:</strong> ${teacherNote}</div>
            </div>

            ${guardianNotice ? `
              <div class="notice-box">
                <strong>تنبيه لولي الأمر:</strong> ${guardianNotice}
              </div>
            ` : ''}

            <div class="footer">
              <p>نظام روضتي المكتبي • تم استخراج هذا التقرير بتاريخ ${new Date().toLocaleDateString('ar-DZ')}</p>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `)
    printWin.document.close()
  }

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-24">
      {/* 1. ترويسة الصفحة واختيار التاريخ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-outline-variant/60">
        <div className="flex items-center gap-space-md">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-2xs">
            <span className="material-symbols-outlined text-[26px]">summarize</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                التقرير اليومي والملاحظات التربوية
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-caption text-caption font-bold">
                حفظ محلي SQLite 100%
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              توثيق شامل للوجبات، القيلولة، السلوكيات، والتواصل المباشر مع أولياء الأمور
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* محدد التاريخ */}
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/60">
            <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-on-surface focus:outline-none"
            />
          </div>

          {/* زر طباعة التقرير */}
          <button
            type="button"
            onClick={handlePrintSingleReport}
            disabled={!activeChild}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold shadow-2xs transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base text-secondary">print</span>
            <span>طباعة تقرير A5 (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* 2. شريط مبدل الفصول */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {classrooms.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setSelectedClassroomId(c.id)
              setSelectedChildId(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedClassroomId === c.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">meeting_room</span>
            <span>{c.name}</span>
            {c.room && <span className="opacity-70 font-mono">({c.room})</span>}
          </button>
        ))}
      </div>

      {/* 3. بطاقات المؤشرات اليومية لهذا الفصل */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
          <div>
            <span className="font-caption text-caption text-outline">اكتمال التقارير</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display-md text-display-md font-bold text-on-surface">
                {stats.percent}%
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                ({stats.completed} / {stats.total} طفلاً)
              </span>
            </div>
            <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">pie_chart</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
          <div>
            <span className="font-caption text-caption text-outline">تقارير بانتظار الإدخال</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display-md text-display-md font-bold text-secondary">
                {Math.max(0, stats.total - stats.completed - stats.absent)}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">أطفال حاضرون</span>
            </div>
            <span className="font-caption text-caption text-outline mt-1 block">جاهزون للتوثيق اليومي</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
          <div>
            <span className="font-caption text-caption text-outline">تنبيهات الحساسية الطبية</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display-md text-display-md font-bold text-rose-600">
                {stats.withAllergies}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">أطفال بالفصل</span>
            </div>
            <span className="font-caption text-caption text-rose-600 mt-1 block">مراعاة خاصة للوجبات</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-2xl">medical_services</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xs">
          <div>
            <span className="font-caption text-caption text-outline">الأطفال الغائبون اليوم</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display-md text-display-md font-bold text-on-surface-variant">
                {stats.absent}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">غائب</span>
            </div>
            <span className="font-caption text-caption text-outline mt-1 block">معفى من التقرير</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-2xl">person_off</span>
          </div>
        </div>
      </div>

      {/* 4. مساحة العمل الرئيسية (35% قائمة الأطفال، 65% المحرر التفاعلي) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* العمود الأيمن (قائمة أطفال الفصل) */}
        <div className="lg:col-span-4 flex flex-col gap-3 bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-on-surface text-sm">
              <span>أطفال الفصل</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs">
                {filteredChildren.length}
              </span>
            </div>
            <span className="text-2xs text-on-surface-variant">اختر طفلاً للتحرير</span>
          </div>

          {/* حقل البحث */}
          <div className="relative">
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-base text-outline">
              search
            </span>
            <input
              type="text"
              value={childSearch}
              onChange={(e) => setChildSearch(e.target.value)}
              placeholder="بحث باسم الطفل..."
              className="w-full h-8 pr-8 pl-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* فلاتر الحالات */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 'pending', label: 'بانتظار' },
                { id: 'completed', label: 'مكتمل' },
                { id: 'absent', label: 'غائب' },
                { id: 'allergy', label: 'حساسية' }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === f.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* قائمة الأطفال */}
          <div className="flex flex-col gap-1.5 max-h-[calc(100vh-380px)] overflow-y-auto pr-0.5">
            {childrenLoading ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                <p className="text-xs">جاري جلب أطفال الفصل...</p>
              </div>
            ) : filteredChildren.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-low rounded-xl text-xs text-on-surface-variant">
                لا يوجد أطفال يطابقون خيارات الفلترة
              </div>
            ) : (
              filteredChildren.map((child) => {
                const isSelected = child.id === selectedChildId
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setSelectedChildId(child.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-right transition-all border ${
                      isSelected
                        ? 'bg-primary-fixed/40 border-primary shadow-xs'
                        : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-2xs">
                          {child.firstName[0]}
                        </div>
                        {child.allergies && (
                          <span
                            className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold"
                            title={`حساسية: ${child.allergies}`}
                          >
                            !
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-on-surface truncate">
                          {child.firstName} {child.lastName}
                        </span>
                        <div className="flex items-center gap-1.5 text-2xs text-on-surface-variant">
                          {child.allergies ? (
                            <span className="text-rose-600 font-semibold truncate">
                              {child.allergies}
                            </span>
                          ) : (
                            <span>حالة صحية طبيعية</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {child.reportStatus === 'completed' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-2xs">
                          مكتمل
                        </span>
                      ) : child.reportStatus === 'absent' ? (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-outline font-bold text-2xs">
                          غائب
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-2xs">
                          بانتظار
                        </span>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* العمود الأيسر (محرر التقرير اليومي التفاعلي) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {!activeChild ? (
            <div className="p-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">child_care</span>
              <p className="font-bold text-on-surface text-base">اختر طفلاً من القائمة لبدء التقرير اليومي</p>
              <p className="text-xs text-on-surface-variant mt-1">
                يمكنك توثيق الوجبات والقيلولة والملاحظات وحفظها فوراً في قاعدة البيانات المحلية
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* شريط معلومات الطفل النشط */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-xs">
                    {activeChild.firstName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-on-surface text-base">
                        {activeChild.firstName} {activeChild.lastName}
                      </h2>
                      {isSaved && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-2xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check</span>
                          محفوظ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                      <span>الفصل: <strong>روضتي</strong></span>
                      <span>•</span>
                      <span>التاريخ: <strong>{selectedDate}</strong></span>
                      {activeChild.allergies && (
                        <>
                          <span>•</span>
                          <span className="text-rose-600 font-bold">
                            حساسية: {activeChild.allergies}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* زر الحفظ المباشر */}
                <button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      <span>حفظ التقرير (F10)</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. الحالة المزاجية العامة */}
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface">الحالة المزاجية للطفل اليوم</span>
                  <span className="text-2xs text-on-surface-variant">انطباع المعلمة والمشرفة</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(
                    [
                      { id: 'happy', icon: 'sentiment_very_satisfied', label: 'سعيد ومبتهج', color: 'text-emerald-600' },
                      { id: 'calm', icon: 'sentiment_satisfied', label: 'هادئ ومستقر', color: 'text-blue-600' },
                      { id: 'active', icon: 'bolt', label: 'نشيط ومتحمس', color: 'text-amber-600' },
                      { id: 'tired', icon: 'bedtime', label: 'متعب / نعسان', color: 'text-indigo-600' },
                      { id: 'fussy', icon: 'sentiment_dissatisfied', label: 'متقلب المزاج', color: 'text-rose-600' }
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMood(m.id)
                        setIsSaved(false)
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                        mood === m.id
                          ? 'bg-primary-fixed/40 border-primary shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl ${m.color} mb-1`}>
                        {m.icon}
                      </span>
                      <span className="font-bold text-2xs text-on-surface">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. سجل الوجبات والتغذية */}
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="material-symbols-outlined text-lg">restaurant</span>
                  <span>سجل الوجبات والتغذية المدرسية</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* وجبة الإفطار */}
                  <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2">
                    <span className="font-bold text-xs text-on-surface">وجبة الإفطار (09:00 ص)</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { id: 'full', label: 'كاملة 💯' },
                          { id: 'half', label: 'نصفها 🥣' },
                          { id: 'none', label: 'لم يرغب ❌' }
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setBreakfastValue(opt.id)
                            setIsSaved(false)
                          }}
                          className={`py-1 px-1.5 rounded-lg text-2xs font-bold transition-all ${
                            breakfastValue === opt.id
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={breakfastNote}
                      onChange={(e) => {
                        setBreakfastNote(e.target.value)
                        setIsSaved(false)
                      }}
                      placeholder="ملاحظة حول الإفطار..."
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* وجبة الغداء */}
                  <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2">
                    <span className="font-bold text-xs text-on-surface">وجبة الغداء (12:00 م)</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { id: 'full', label: 'كاملة 💯' },
                          { id: 'half', label: 'نصفها 🥣' },
                          { id: 'none', label: 'لم يرغب ❌' }
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setLunchValue(opt.id)
                            setIsSaved(false)
                          }}
                          className={`py-1 px-1.5 rounded-lg text-2xs font-bold transition-all ${
                            lunchValue === opt.id
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={lunchNote}
                      onChange={(e) => {
                        setLunchNote(e.target.value)
                        setIsSaved(false)
                      }}
                      placeholder="ملاحظة حول الغداء..."
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* سناك العصر */}
                <div className="flex items-center gap-2 bg-surface-container-low p-2.5 rounded-xl">
                  <span className="material-symbols-outlined text-base text-secondary">lunch_dining</span>
                  <span className="font-bold text-xs text-on-surface whitespace-nowrap">سناك العصر:</span>
                  <input
                    type="text"
                    value={snackNote}
                    onChange={(e) => {
                      setSnackNote(e.target.value)
                      setIsSaved(false)
                    }}
                    placeholder="مثال: تفاح طازج وعصير طبيعي..."
                    className="w-full h-7 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 3. فترة القيلولة والراحة */}
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <span className="material-symbols-outlined text-lg">hotel</span>
                    <span>فترة القيلولة والراحة اليومية</span>
                  </div>
                  <input
                    type="text"
                    value={napTime}
                    onChange={(e) => {
                      setNapTime(e.target.value)
                      setIsSaved(false)
                    }}
                    className="w-40 h-7 px-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-2xs font-mono text-on-surface text-center focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'good_sleep', icon: 'bedtime', label: 'نام بهدوء وعمق 🛌' },
                      { id: 'rested', icon: 'menu_book', label: 'استرخاء وهدوء 📖' },
                      { id: 'restless', icon: 'warning', label: 'قلق أو لم ينم ⚠️' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setNapValue(opt.id)
                        setIsSaved(false)
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        napValue === opt.id
                          ? 'bg-primary-fixed/40 border-primary text-primary shadow-2xs'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. الأنشطة التعليمية وتوصيات ولي الأمر */}
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="material-symbols-outlined text-lg">palette</span>
                  <span>الأنشطة الإبداعية وملاحظات المعلمة وولي الأمر</span>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-on-surface-variant mb-1">
                    الأنشطة المنجزة اليوم
                  </label>
                  <input
                    type="text"
                    value={activities}
                    onChange={(e) => {
                      setActivities(e.target.value)
                      setIsSaved(false)
                    }}
                    placeholder="رسم، أناشيد، ألعاب، حفظ..."
                    className="w-full h-8 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-on-surface-variant mb-1">
                    ملاحظات المعلمة التربوية والسلوكية
                  </label>
                  <textarea
                    rows={2}
                    value={teacherNote}
                    onChange={(e) => {
                      setTeacherNote(e.target.value)
                      setIsSaved(false)
                    }}
                    placeholder="انطباع عام وتطور مهارات الطفل..."
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-rose-600 mb-1">
                    تنبيه خاص لولي الأمر (يُطبع ويُبرز في التقرير)
                  </label>
                  <input
                    type="text"
                    value={guardianNotice}
                    onChange={(e) => {
                      setGuardianNotice(e.target.value)
                      setIsSaved(false)
                    }}
                    placeholder="مثال: يرجى إحضار ملابس تبديل إضافية ليوم الغد..."
                    className="w-full h-8 px-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-rose-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
