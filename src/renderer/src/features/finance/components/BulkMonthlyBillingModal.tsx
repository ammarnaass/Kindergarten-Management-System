import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { ClassroomItem } from '@/lib/api/types'

interface BulkMonthlyBillingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function BulkMonthlyBillingModal({
  isOpen,
  onClose,
  onSuccess
}: BulkMonthlyBillingModalProps) {
  const queryClient = useQueryClient()
  const today = new Date()
  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const defaultDueDate = `${lastDayOfMonth.getFullYear()}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`

  const [period, setPeriod] = useState(currentYearMonth)
  const [dueDate, setDueDate] = useState(defaultDueDate)
  const [label, setLabel] = useState(`رسوم التمدرس لشهر ${period}`)
  const [amountDinar, setAmountDinar] = useState<number>(15000)
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('')
  const [resultSummary, setResultSummary] = useState<{
    generatedCount: number
    skippedCount: number
    totalCents: number
  } | null>(null)

  const { data: classrooms = [] } = useQuery<ClassroomItem[]>({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list(),
    enabled: isOpen
  })

  // جلب الأطفال النشطين لمعاينة العدد المستهدف
  const { data: activeChildrenData } = useQuery({
    queryKey: ['children:list', { status: 'active', classroomId: selectedClassroomId || undefined }],
    queryFn: () =>
      api.children.list({
        status: 'active',
        classroomId: selectedClassroomId || undefined,
        limit: 200,
        offset: 0
      }),
    enabled: isOpen
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const unitCents = Math.round(amountDinar * 100)
      return api.finance.generateMonthly({
        period,
        dueDate,
        label,
        unitCents,
        classroomId: selectedClassroomId || undefined
      })
    },
    onSuccess: (data) => {
      setResultSummary(data)
      queryClient.invalidateQueries({ queryKey: ['invoices:list'] })
      queryClient.invalidateQueries({ queryKey: ['invoices:child'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard:stats'] })
      toast({
        title: 'تم إنشاء الفواتير بنجاح',
        description: `تم إنشاء ${data.generatedCount} فاتورة شهرية بنجاح`
      })
      if (onSuccess) onSuccess()
    },
    onError: (err: any) => {
      toast({
        title: 'خطأ',
        description: err.message || 'فشل توليد الفواتير الشهرية',
        variant: 'destructive'
      })
    }
  })

  if (!isOpen) return null

  const handlePeriodChange = (val: string) => {
    setPeriod(val)
    setLabel(`رسوم التمدرس لشهر ${val}`)
    const [y, m] = val.split('-').map(Number)
    if (y && m) {
      const endD = new Date(y, m, 0)
      setDueDate(`${endD.getFullYear()}-${String(endD.getMonth() + 1).padStart(2, '0')}-${String(endD.getDate()).padStart(2, '0')}`)
    }
  }

  const eligibleCount = activeChildrenData?.items.length ?? 0

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط العنوان */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">auto_mode</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">توليد الاشتراكات الشهرية دفعة واحدة</h3>
              <p className="text-xs text-on-surface-variant">إصدار مطالبات التمدرس لجميع الأطفال النشطين</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {resultSummary ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h4 className="font-bold text-lg text-on-surface">اكتمل التوليد بنجاح</h4>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-sm">
              <div className="p-3 rounded-xl bg-surface-container-low">
                <p className="text-xs text-on-surface-variant">فواتير أُنشئت</p>
                <p className="text-xl font-bold text-emerald-600">{resultSummary.generatedCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low">
                <p className="text-xs text-on-surface-variant">تم تخطيها (موجودة سابقاً)</p>
                <p className="text-xl font-bold text-on-surface-variant">{resultSummary.skippedCount}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">
              إجمالي المبالغ المطلوبة:{' '}
              <span className="font-bold text-on-surface">
                {(resultSummary.totalCents / 100).toLocaleString('ar-DZ')} دج
              </span>
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary/90 transition-all"
              >
                إغلاق والعودة
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate()
            }}
            className="p-6 space-y-4"
          >
            {/* الشهر وتاريخ الاستحقاق */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">الشهر المالي (YYYY-MM)</label>
                <input
                  type="month"
                  required
                  value={period}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">تاريخ الاستحقاق الأخير</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                />
              </div>
            </div>

            {/* الفصل المستهدف */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">الفصل المستهدف</label>
              <select
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="">جميع الفصول (كل الأطفال النشطين)</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.room ? `(${c.room})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* بيان الفاتورة ومبلغ الرسم */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">بيان الرسم</label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">المبلغ المطلوب لكل طفل (بالدينار الجزائري)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={100}
                  step={100}
                  value={amountDinar || ''}
                  onChange={(e) => setAmountDinar(Number(e.target.value))}
                  className="w-full h-11 pl-12 pr-3 rounded-xl bg-surface-container-low border border-outline-variant text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                />
                <span className="absolute left-3 top-2.5 text-xs font-bold text-on-surface-variant">دج</span>
              </div>
            </div>

            {/* بطاقة معلومات سريعة */}
            <div className="p-3.5 rounded-xl bg-primary-fixed/20 border border-primary-fixed/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="material-symbols-outlined text-lg">info</span>
                <span>الأطفال النشطين المستهدفين:</span>
              </div>
              <span className="font-bold text-on-surface bg-surface-container-lowest px-2.5 py-1 rounded-lg shadow-2xs">
                {eligibleCount} أطفال
              </span>
            </div>

            {/* أزرار الإجراء */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
              <button
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || eligibleCount === 0 || amountDinar <= 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-sm font-bold shadow-md transition-all disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    <span>جاري التوليد...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    <span>بدء التوليد لـ {eligibleCount} طفل</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
