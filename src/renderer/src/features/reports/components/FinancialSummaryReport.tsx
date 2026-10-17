import { useMemo } from 'react'
import type { InvoiceItem } from '@/lib/api/types'

interface FinancialSummaryReportProps {
  invoices: InvoiceItem[]
  period: string
  kindergartenName: string
  branchName: string
  academicYear: string
}

export function FinancialSummaryReport({
  invoices,
  period,
  kindergartenName,
  branchName,
  academicYear
}: FinancialSummaryReportProps) {
  // Aggregate financial metrics
  const totals = useMemo(() => {
    let invoicedCents = 0
    let paidCents = 0
    let remainingCents = 0

    for (const inv of invoices) {
      const total = inv.totalCents - (inv.discountCents || 0)
      const paid = inv.paidCents || (inv.status === 'paid' ? total : 0)
      const rem = inv.remainingCents !== undefined ? inv.remainingCents : Math.max(0, total - paid)

      invoicedCents += total
      paidCents += paid
      remainingCents += rem
    }

    const rate = invoicedCents > 0 ? Math.round((paidCents / invoicedCents) * 100) : 0

    return {
      invoicedCents,
      paidCents,
      remainingCents,
      rate
    }
  }, [invoices])

  const formatSar = (cents: number) => {
    return (cents / 100).toLocaleString('ar-SA')
  }

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-xs print:border-none print:shadow-none print:p-0 text-on-surface">
      {/* Official Kindergarten Report Header */}
      <div className="border-b-2 border-primary/20 pb-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-2xs">
            <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
          </div>
          <div>
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
              {kindergartenName || 'روضتي النموذجية'}
            </h1>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              {branchName || 'الفرع الرئيسي'} • العام الدراسي {academicYear || '1446-1447هـ'}
            </p>
          </div>
        </div>

        <div className="text-left font-mono text-body-sm space-y-1">
          <div className="px-3 py-1 bg-surface-container-low rounded-lg text-primary font-semibold text-caption inline-block">
            كشف مسير الرسوم والتحصيل المالي
          </div>
          <div className="text-caption text-on-surface-variant">
            فترة الكشف: {period || 'الشهر الحالي'}
          </div>
        </div>
      </div>

      {/* Financial Summary Bento Box */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
          <span className="text-caption text-on-surface-variant font-semibold block">إجمالي الرسوم المفوترة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-headline-md font-bold text-on-surface font-mono">{formatSar(totals.invoicedCents)}</span>
            <span className="text-caption text-on-surface-variant">ر.س</span>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <span className="text-caption text-emerald-800 font-semibold block">إجمالي المبالغ المحصلة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-headline-md font-bold text-emerald-800 font-mono">{formatSar(totals.paidCents)}</span>
            <span className="text-caption text-emerald-700">ر.س</span>
          </div>
        </div>

        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
          <span className="text-caption text-rose-800 font-semibold block">المتأخرات والذمم المتبقية</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-headline-md font-bold text-rose-800 font-mono">{formatSar(totals.remainingCents)}</span>
            <span className="text-caption text-rose-700">ر.س</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
          <span className="text-caption text-on-surface-variant font-semibold block">نسبة التحصيل</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-headline-md font-bold text-primary font-mono">{totals.rate}%</span>
            <span className="text-caption text-on-surface-variant">من الإجمالي</span>
          </div>
        </div>
      </div>

      {/* Invoices Detailed Ledger */}
      {invoices.length === 0 ? (
        <div className="py-16 text-center text-on-surface-variant bg-surface-container-low/30 rounded-xl">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">receipt_long</span>
          <p className="text-body-md font-semibold text-on-surface">لا توجد فواتير أو رسوم مسجلة لهذه الفترة</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
          <table className="w-full text-right border-collapse text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-4">رقم الفاتورة</th>
                <th className="py-3 px-4">اسم الطفل</th>
                <th className="py-3 px-4">الفصل</th>
                <th className="py-3 px-4 text-left">قيمة الفاتورة</th>
                <th className="py-3 px-4 text-left">المسدد</th>
                <th className="py-3 px-4 text-left">المتبقي</th>
                <th className="py-3 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {invoices.map((inv, idx) => {
                const total = inv.totalCents - (inv.discountCents || 0)
                const paid = inv.paidCents || (inv.status === 'paid' ? total : 0)
                const remaining = inv.remainingCents !== undefined ? inv.remainingCents : Math.max(0, total - paid)

                return (
                  <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-caption text-outline">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-primary">
                      {inv.number}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-on-surface">
                      {inv.childFirstName} {inv.childLastName}
                    </td>
                    <td className="py-2.5 px-4 text-on-surface-variant text-caption">
                      {inv.classroomName || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-left font-mono font-semibold">
                      {formatSar(total)} ر.س
                    </td>
                    <td className="py-2.5 px-4 text-left font-mono text-emerald-700">
                      {formatSar(paid)} ر.س
                    </td>
                    <td className="py-2.5 px-4 text-left font-mono text-rose-700">
                      {formatSar(remaining)} ر.س
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        {inv.status === 'paid' ? 'مسددة بالكامل' : inv.status === 'partial' ? 'سداد جزئي' : 'مستحقة'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Official Signatures & Seal Section */}
      <div className="mt-12 pt-8 border-t border-outline-variant/30 grid grid-cols-3 gap-6 text-center text-body-sm">
        <div className="space-y-8">
          <span className="text-on-surface-variant font-semibold block">المحاسب المالي:</span>
          <div className="border-b border-dashed border-outline-variant/60 w-3/4 mx-auto"></div>
          <span className="text-caption text-outline font-mono block">التوقيع والتاريخ</span>
        </div>

        <div className="space-y-4">
          <span className="text-on-surface-variant font-semibold block">ختم الإدارة المالية:</span>
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-outline-variant/50 mx-auto flex items-center justify-center text-outline text-caption">
            الختم الرسمي
          </div>
        </div>

        <div className="space-y-8">
          <span className="text-on-surface-variant font-semibold block">مديرة الروضة:</span>
          <div className="border-b border-dashed border-outline-variant/60 w-3/4 mx-auto"></div>
          <span className="text-caption text-outline font-mono block">الاعتماد الرسمي</span>
        </div>
      </div>
    </div>
  )
}
