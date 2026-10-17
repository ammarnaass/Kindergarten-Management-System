import { useNavigate } from 'react-router-dom'
import type { RecentPayment } from '@/lib/api/types'

interface RecentTransactionsSectionProps {
  payments: RecentPayment[]
}

function formatCents(cents: number): string {
  if (cents === 0) return '0 دج'
  return `${(cents / 100).toLocaleString('ar-DZ')} دج`
}

function formatTime(val: Date | number | string): string {
  try {
    const d = new Date(val)
    return d.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'اليوم'
  }
}

function getMethodLabel(method: string): string {
  switch (method) {
    case 'cash':
      return 'نقداً'
    case 'transfer':
      return 'تحويل بنكي'
    case 'check':
      return 'شيك'
    case 'card':
      return 'بطاقة'
    default:
      return method || 'نقداً'
  }
}

export function RecentTransactionsSection({ payments }: RecentTransactionsSectionProps) {
  const navigate = useNavigate()

  const totalCents = payments.reduce((acc, p) => acc + (p.amountCents ?? 0), 0)

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">receipt</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              آخر المدفوعات المسجلة
            </h2>
            <p className="font-caption text-caption text-on-surface-variant">
              حفظ فوري في دفتر المعاملات المحلي
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/finance')}
          className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-0.5"
          type="button"
        >
          <span>سجل المعاملات</span>
          <span className="material-symbols-outlined text-xs">arrow_back</span>
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="p-8 text-center bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">payments</span>
          <p className="text-on-surface font-semibold text-sm">لا توجد مدفوعات مسجلة اليوم</p>
          <p className="text-on-surface-variant text-xs mt-1">
            يمكنك تسجيل دفعات أولياء الأمور بسهولة من شاشة المالية
          </p>
          <button
            onClick={() => navigate('/finance')}
            className="mt-3 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity"
            type="button"
          >
            تسجيل دفعة جديدة
          </button>
        </div>
      ) : (
        <div className="space-y-space-sm">
          {payments.map((tx) => (
            <div
              key={tx.id}
              className="rounded-lg bg-surface-container-low p-space-sm hover:bg-surface-container transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                  <span className="material-symbols-outlined text-sm">payments</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                      {tx.childFirstName} {tx.childLastName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption">
                      {getMethodLabel(tx.method)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant mt-0.5 font-mono">
                    <span>{tx.receiptNumber}</span>
                    <span>•</span>
                    <span>{formatTime(tx.paidAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-left font-mono">
                  <div className="font-label-md text-label-md font-bold text-on-surface">
                    {formatCents(tx.amountCents)}
                  </div>
                  <div className="font-caption text-caption text-emerald-700 font-sans">
                    تم الاستلام
                  </div>
                </div>
                <button
                  onClick={() => navigate('/finance')}
                  className="w-7 h-7 rounded bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-surface transition-colors flex items-center justify-center shadow-2xs"
                  title="عرض التفاصيل في المالية"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
        <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
          <span className="material-symbols-outlined text-base text-primary">point_of_sale</span>
          <span>مجموع المدفوعات المعروضة:</span>
        </div>
        <span className="font-label-md text-label-md font-bold font-mono text-primary">
          {formatCents(totalCents)}
        </span>
      </div>
    </div>
  )
}
