import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <span className="text-caption text-on-surface-variant font-medium">إجمالي الرسوم المعتمدة</span>
          <div className="text-headline-md font-bold text-on-surface font-mono mt-2">
            {(stats.totalInvoiced / 100).toLocaleString('ar-DZ')}{' '}
            <span className="text-body-sm font-normal">دج</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <span className="text-caption text-emerald-700 font-medium">إجمالي المبالغ المسددة</span>
          <div className="text-headline-md font-bold text-emerald-700 font-mono mt-2">
            {(stats.totalPaid / 100).toLocaleString('ar-DZ')}{' '}
            <span className="text-body-sm font-normal">دج</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <span className="text-caption text-on-surface-variant font-medium">الرصيد المتبقي المستحق</span>
          <div
            className={`text-headline-md font-bold font-mono mt-2 ${
              stats.isSettled ? 'text-emerald-700' : 'text-error'
            }`}
          >
            {(stats.totalDue / 100).toLocaleString('ar-DZ')}{' '}
            <span className="text-body-sm font-normal">دج</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <span className="text-caption text-on-surface-variant font-medium">حالة الحساب المالي</span>
          <div className="mt-2">
            <span
              className={`px-3 py-1 rounded-xl text-label-sm font-bold inline-block ${
                stats.isSettled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              {stats.isSettled ? 'منتظم ومسوى بالكامل' : 'توجد مستحقات معلقة'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Invoices List Table */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs space-y-space-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
            <div>
              <h3 className="font-bold text-on-surface text-label-lg">سجل الفواتير والمطالبات المالية</h3>
              <p className="text-caption text-on-surface-variant">كشف الحساب المالي المعتمد للطفل</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/finance')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>تسجيل دفعة في المالية</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-on-surface-variant font-body-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-primary text-xl">progress_activity</span>
            <span>جاري استرجاع الفواتير المالية...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-14 text-center text-on-surface-variant bg-surface-container-low/30 rounded-xl space-y-2">
            <span className="material-symbols-outlined text-[44px] text-outline mb-1 block">receipt_long</span>
            <p className="font-bold text-on-surface text-body-md">لا توجد فواتير أو رسوم مسجلة للطفل «{childName}»</p>
            <p className="text-caption max-w-sm mx-auto text-on-surface-variant">
              يمكنك إصدار فاتورة رسوم دراسية أو تسجيل دفعة جديدة مباشرة من قسم المالية.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-right border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                  <th className="py-3 px-4">رقم الفاتورة</th>
                  <th className="py-3 px-3">تاريخ الاستحقاق</th>
                  <th className="py-3 px-3 text-center">الإجمالي</th>
                  <th className="py-3 px-3 text-center">الخصم</th>
                  <th className="py-3 px-3 text-center">المدفوع</th>
                  <th className="py-3 px-3 text-center">المتبقي</th>
                  <th className="py-3 px-3 text-center">الحالة</th>
                  <th className="py-3 px-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono">
                {invoices.map((inv: any) => {
                  const total = inv.totalCents ?? 0
                  const discount = inv.discountCents ?? 0
                  const paid = inv.paidCents ?? 0
                  const remaining = inv.remainingCents ?? Math.max(0, total - discount - paid)

                  return (
                    <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-on-surface font-sans">
                        #{inv.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant">{inv.dueDate || '—'}</td>
                      <td className="py-3 px-3 text-center">{(total / 100).toLocaleString('ar-DZ')} دج</td>
                      <td className="py-3 px-3 text-center text-on-surface-variant">
                        {(discount / 100).toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-700 font-semibold">
                        {(paid / 100).toLocaleString('ar-DZ')} دج
                      </td>
                      <td
                        className={`py-3 px-3 text-center font-bold ${
                          remaining > 0 ? 'text-error' : 'text-emerald-700'
                        }`}
                      >
                        {(remaining / 100).toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-3 text-center font-sans">
                        {getStatusBadge(inv.status, remaining)}
                      </td>
                      <td className="py-3 px-4 text-left font-sans">
                        <button
                          onClick={() => navigate('/finance')}
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-caption font-semibold hover:bg-surface-container-high transition-colors"
                          type="button"
                        >
                          سداد دفعة
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
