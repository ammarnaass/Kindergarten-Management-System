import { useId } from 'react'

interface InvoicesSelectionStepProps {
  paidInvoices: string[]
  onToggleInvoice: (invoiceId: string) => void
}

export function InvoicesSelectionStep({
  paidInvoices,
  onToggleInvoice
}: InvoicesSelectionStepProps) {
  const inv1Id = useId()
  const inv2Id = useId()

  return (
    <div className="flex flex-col gap-space-xs pt-1 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-caption flex items-center justify-center font-bold">
            2
          </span>
          <span className="font-label-lg text-label-lg font-bold text-on-surface">
            الفواتير المعلقة المستهدفة بالسداد
          </span>
        </div>
        <span className="font-caption text-caption text-outline">
          تم تحديد ({paidInvoices.length}) فاتورة
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Invoice 1 */}
        <label
          htmlFor={inv1Id}
          className={`flex items-center justify-between p-space-md rounded-xl cursor-pointer transition-colors ${
            paidInvoices.includes('nov2026')
              ? 'bg-surface-container-high'
              : 'bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              id={inv1Id}
              type="checkbox"
              checked={paidInvoices.includes('nov2026')}
              onChange={() => onToggleInvoice('nov2026')}
              className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  فاتورة شهر نوفمبر 2026
                </span>
                <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-caption text-caption font-semibold">
                  مستحقة فوراً
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                رسوم التمدرس الأساسية + اشتراك النقل المدرسي
              </span>
            </div>
          </div>
          <div className="text-left">
            <span className="font-label-lg text-label-lg font-bold text-primary font-mono">
              20,000.00 دج
            </span>
            <span className="font-caption text-caption text-outline block">المتبقي: 20,000 دج</span>
          </div>
        </label>

        {/* Invoice 2 */}
        <label
          htmlFor={inv2Id}
          className={`flex items-center justify-between p-space-md rounded-xl cursor-pointer transition-colors ${
            paidInvoices.includes('dec2026')
              ? 'bg-surface-container-high'
              : 'bg-surface-container-low hover:bg-surface-container opacity-75'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              id={inv2Id}
              type="checkbox"
              checked={paidInvoices.includes('dec2026')}
              onChange={() => onToggleInvoice('dec2026')}
              className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md font-medium text-on-surface">
                  فاتورة شهر ديسمبر 2026
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption">
                  مستقبلية
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                رسوم التمدرس فقط (بدون إطعام ونقل)
              </span>
            </div>
          </div>
          <div className="text-left">
            <span className="font-label-lg text-label-lg font-medium text-on-surface font-mono">
              16,000.00 دج
            </span>
            <span className="font-caption text-caption text-outline block">
              تستحق في: 01/12/2026
            </span>
          </div>
        </label>
      </div>
    </div>
  )
}
