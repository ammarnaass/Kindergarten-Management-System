import type { InvoiceItem } from '@/lib/api/types'

interface InvoicesSelectionStepProps {
  invoices: InvoiceItem[]
  selectedInvoiceId: string | null
  onSelectInvoice: (invoiceId: string) => void
  onQuickCreateInvoice?: () => void
  isCreatingInvoice?: boolean
  childSelected: boolean
}

function formatCents(cents: number): string {
  if (cents === 0) return '0 دج'
  return `${(cents / 100).toLocaleString('ar-DZ')} دج`
}

function getStatusBadge(status: string, dueDate: string) {
  const today = new Date().toISOString().slice(0, 10)
  const isOverdue = dueDate < today && (status === 'issued' || status === 'partial')

  if (status === 'paid') {
    return { label: 'مسددة بالكامل', bg: 'bg-emerald-100 text-emerald-800' }
  }
  if (isOverdue) {
    return { label: 'متأخرة السداد', bg: 'bg-error-container text-on-error-container' }
  }
  if (status === 'partial') {
    return { label: 'مسددة جزئياً', bg: 'bg-amber-100 text-amber-800' }
  }
  if (status === 'issued') {
    return { label: 'مستحقة للدفع', bg: 'bg-primary-fixed text-on-primary-fixed font-semibold' }
  }
  return { label: 'مسودة', bg: 'bg-surface-container-highest text-on-surface-variant' }
}

export function InvoicesSelectionStep({
  invoices,
  selectedInvoiceId,
  onSelectInvoice,
  onQuickCreateInvoice,
  isCreatingInvoice = false,
  childSelected,
}: InvoicesSelectionStepProps) {
  return (
    <div className="flex flex-col gap-space-xs pt-1 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-caption flex items-center justify-center font-bold">
            2
          </span>
          <span className="font-label-lg text-label-lg font-bold text-on-surface">
            الفاتورة المستهدفة بالسداد
          </span>
        </div>
        {invoices.length > 0 && (
          <span className="font-caption text-caption text-outline">
            {selectedInvoiceId ? 'تم تحديد فاتورة للسداد' : `متاح (${invoices.length}) فواتير`}
          </span>
        )}
      </div>

      {!childSelected ? (
        <div className="p-6 text-center bg-surface-container-low rounded-xl text-on-surface-variant text-sm">
          يرجى اختيار الطفل أولاً لعرض الفواتير المستحقة عليه
        </div>
      ) : invoices.length === 0 ? (
        <div className="p-6 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant/60 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-outline">receipt_long</span>
          <p className="text-on-surface font-semibold text-sm">لا توجد فواتير مسجلة لهذا الطفل حالياً</p>
          <p className="text-on-surface-variant text-xs">
            يمكنك إصدار فاتورة شهرية جديدة فوراً وتسجيل دفعتها مباشرة
          </p>
          {onQuickCreateInvoice && (
            <button
              onClick={onQuickCreateInvoice}
              disabled={isCreatingInvoice}
              className="mt-2 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>{isCreatingInvoice ? 'جاري إصدار الفاتورة...' : 'إصدار فاتورة تمدرس لهذا الشهر'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {invoices.map((inv) => {
            const isSelected = selectedInvoiceId === inv.id
            const badge = getStatusBadge(inv.status, inv.dueDate)
            const remaining = inv.remainingCents ?? Math.max(0, inv.totalCents - inv.discountCents - (inv.paidCents ?? 0))
            const itemsSummary = inv.items?.map((i) => i.label).join(' + ') || inv.period || 'رسوم دراسية'

            return (
              <label
                key={inv.id}
                htmlFor={`inv-${inv.id}`}
                className={`flex items-center justify-between p-space-md rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-surface-container-high ring-1 ring-primary'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    id={`inv-${inv.id}`}
                    type="radio"
                    name="selected-invoice"
                    checked={isSelected}
                    onChange={() => onSelectInvoice(inv.id)}
                    className="w-4 h-4 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md font-bold text-on-surface font-mono">
                        {inv.number}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-caption text-caption font-semibold ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                      {itemsSummary}
                    </span>
                    <span className="font-caption text-caption text-outline font-mono block">
                      تاريخ الاستحقاق: {inv.dueDate}
                    </span>
                  </div>
                </div>
                <div className="text-left font-mono">
                  <span className="font-label-lg text-label-lg font-bold text-primary block">
                    {formatCents(inv.totalCents - inv.discountCents)}
                  </span>
                  <span className="font-caption text-caption text-error font-semibold block">
                    {remaining > 0 ? `المتبقي: ${formatCents(remaining)}` : 'مدفوعة'}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
