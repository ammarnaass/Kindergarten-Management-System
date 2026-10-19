import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ChildFinanceKpiCards } from './ChildFinanceKpiCards'

interface ChildFinanceTabProps {
  childId: string
  childName: string
}

export function ChildFinanceTab({ childId, childName }: ChildFinanceTabProps) {
  const navigate = useNavigate()

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices:child', childId],
    queryFn: () => (childId ? api.finance.listByChild(childId) : Promise.resolve([])),
    enabled: Boolean(childId)
  })

  const stats = useMemo(() => {
    let totalInvoiced = 0
    let totalPaid = 0
    let totalDue = 0

    for (const inv of invoices) {
      const invTotal = inv.totalCents ?? 0
      const invDiscount = inv.discountCents ?? 0
      const invPaid = inv.paidCents ?? 0
      const invRemaining = inv.remainingCents ?? Math.max(0, invTotal - invDiscount - invPaid)

      totalInvoiced += invTotal - invDiscount
      totalPaid += invPaid
      totalDue += invRemaining
    }

    const isSettled = totalDue === 0
    return { totalInvoiced, totalPaid, totalDue, isSettled, count: invoices.length }
  }, [invoices])

  const getStatusBadge = (status: string, remainingCents: number) => {
    if (status === 'paid' || remainingCents === 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
          مسددة بالكامل
        </span>
      )
    }
    if (status === 'partial') {
      return (
        <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-amber-50 text-amber-800 border border-amber-200">
          سداد جزئي
        </span>
      )
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full font-bold text-caption font-mono bg-rose-50 text-rose-800 border border-rose-200">
        غير مسددة
      </span>
    )
  }

  return (
    <div className="space-y-space-lg select-none animate-in fade-in duration-200">
      {/* 1. Financial KPI Cards */}
      <ChildFinanceKpiCards stats={stats} />

      {/* 2. Invoices & Billing Table */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-outline-variant/30">
          <div>
            <h3 className="font-bold text-on-surface text-label-lg">سجل الفواتير والمستحقات للطفل</h3>
            <p className="text-caption text-on-surface-variant">
              كافة الرسوم الشهرية وفواتير الخدمات المسجلة باسم «{childName}»
            </p>
          </div>

          <button
            onClick={() => navigate('/finance')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>تسجيل دفعة أو فاتورة في المالية</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">
              progress_activity
            </span>
            <span className="text-body-sm text-on-surface-variant">جاري تحميل المعاملات المالية...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-3">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <h4 className="font-bold text-on-surface text-body-lg">لا توجد فواتير مسجلة للطفل</h4>
            <p className="text-caption text-on-surface-variant max-w-sm mt-1">
              لم يتم إصدار أي رسوم شهرية أو خدمات إضافية لهذا الطفل في السجلات المالية حتى الآن.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-caption font-bold border-b border-outline-variant/30">
                  <th className="py-3 px-4">رقم الفاتورة</th>
                  <th className="py-3 px-4">تاريخ الاستحقاق</th>
                  <th className="py-3 px-4">إجمالي الرسوم</th>
                  <th className="py-3 px-4">المدفوع</th>
                  <th className="py-3 px-4">المتبقي</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-body-sm">
                {invoices.map((inv) => {
                  const total = inv.totalCents ?? 0
                  const discount = inv.discountCents ?? 0
                  const paid = inv.paidCents ?? 0
                  const remaining = inv.remainingCents ?? Math.max(0, total - discount - paid)

                  return (
                    <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {inv.number || inv.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-on-surface font-mono">
                        {inv.dueDate || (inv.createdAt ? new Date(inv.createdAt).toISOString().slice(0, 10) : 'غير محدد')}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-on-surface">
                        {((total - discount) / 100).toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                        {(paid / 100).toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-error">
                        {(remaining / 100).toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(inv.status, remaining)}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate('/finance')}
                          className="px-3 py-1 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-caption font-semibold transition-colors inline-flex items-center gap-1"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>عرض</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
