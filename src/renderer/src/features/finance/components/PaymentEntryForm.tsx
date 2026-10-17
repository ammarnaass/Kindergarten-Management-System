import { StudentSelectorStep } from './StudentSelectorStep'
import { InvoicesSelectionStep } from './InvoicesSelectionStep'
import { PaymentMethodStep } from './PaymentMethodStep'
import type { InvoiceItem } from '@/lib/api/types'

export interface PaymentFormState {
  childId?: string
  childName: string
  classroom: string
  guardianName: string
  guardianPhone: string
  amount: number
  paymentMethod: 'cash' | 'cheque' | 'transfer' | 'card'
  reference: string
  note: string
  selectedInvoiceId: string | null
}

interface PaymentEntryFormProps {
  form: PaymentFormState
  invoices: InvoiceItem[]
  dueBalance: string
  onChange: (updated: Partial<PaymentFormState>) => void
  onSaveAndPrint: () => void
  onSaveOnly: () => void
  onCancel: () => void
  onSelectChildModal: () => void
  onQuickCreateInvoice?: () => void
  isCreatingInvoice?: boolean
  isSubmitting?: boolean
}

export function PaymentEntryForm({
  form,
  invoices,
  dueBalance,
  onChange,
  onSaveAndPrint,
  onSaveOnly,
  onCancel,
  onSelectChildModal,
  onQuickCreateInvoice,
  isCreatingInvoice = false,
  isSubmitting = false,
}: PaymentEntryFormProps) {
  const handleSelectInvoice = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId)
    const remaining = inv ? (inv.remainingCents ?? (inv.totalCents - inv.discountCents)) / 100 : form.amount
    onChange({
      selectedInvoiceId: invoiceId,
      amount: remaining > 0 ? remaining : form.amount,
      note: inv?.period ? `سداد ${inv.period}` : form.note,
    })
  }

  const canSubmit = Boolean(form.childId && form.selectedInvoiceId && form.amount > 0)

  return (
    <div className="flex flex-col gap-space-md select-none">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
        <StudentSelectorStep
          childName={form.childName}
          classroom={form.classroom}
          guardianName={form.guardianName}
          guardianPhone={form.guardianPhone}
          dueBalance={dueBalance}
          onSelectChildModal={onSelectChildModal}
        />

        <InvoicesSelectionStep
          invoices={invoices}
          selectedInvoiceId={form.selectedInvoiceId}
          onSelectInvoice={handleSelectInvoice}
          onQuickCreateInvoice={onQuickCreateInvoice}
          isCreatingInvoice={isCreatingInvoice}
          childSelected={Boolean(form.childId)}
        />

        <PaymentMethodStep
          amount={form.amount}
          paymentMethod={form.paymentMethod}
          reference={form.reference}
          note={form.note}
          onAmountChange={(amt) => onChange({ amount: amt })}
          onMethodChange={(method) => onChange({ paymentMethod: method })}
          onReferenceChange={(ref) => onChange({ reference: ref })}
          onNoteChange={(note) => onChange({ note })}
        />

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm pt-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-xs">
            <button
              onClick={onCancel}
              className="px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors"
              type="button"
            >
              إلغاء وتفريغ النموذج
            </button>
            <button
              onClick={onSaveOnly}
              disabled={isSubmitting || !canSubmit}
              className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors disabled:opacity-40 disabled:pointer-events-none"
              type="button"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ دون طباعة'}
            </button>
          </div>

          <button
            onClick={onSaveAndPrint}
            disabled={isSubmitting || !canSubmit}
            className="flex items-center justify-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:pointer-events-none"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">print</span>
            <span>{isSubmitting ? 'جاري المعالجة...' : 'حفظ وطباعة السند فوراً [F10]'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
