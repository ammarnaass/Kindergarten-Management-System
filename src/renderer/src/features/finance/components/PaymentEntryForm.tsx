import { StudentSelectorStep } from './StudentSelectorStep'
import { InvoicesSelectionStep } from './InvoicesSelectionStep'
import { PaymentMethodStep } from './PaymentMethodStep'

export interface PaymentFormState {
  childName: string
  classroom: string
  guardianName: string
  guardianPhone: string
  amount: number
  paymentMethod: 'cash' | 'cheque' | 'transfer' | 'card'
  reference: string
  note: string
  paidInvoices: string[]
}

interface PaymentEntryFormProps {
  form: PaymentFormState
  onChange: (updated: Partial<PaymentFormState>) => void
  onSaveAndPrint: () => void
  onSaveOnly: () => void
  onCancel: () => void
  onSelectChildModal: () => void
  isSubmitting?: boolean
}

export function PaymentEntryForm({
  form,
  onChange,
  onSaveAndPrint,
  onSaveOnly,
  onCancel,
  onSelectChildModal,
  isSubmitting = false
}: PaymentEntryFormProps) {
  const toggleInvoice = (inv: string) => {
    const exists = form.paidInvoices.includes(inv)
    const updated = exists
      ? form.paidInvoices.filter((i) => i !== inv)
      : [...form.paidInvoices, inv]
    onChange({ paidInvoices: updated })
  }

  return (
    <div className="flex flex-col gap-space-md select-none">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
        <StudentSelectorStep
          childName={form.childName}
          classroom={form.classroom}
          guardianName={form.guardianName}
          guardianPhone={form.guardianPhone}
          onSelectChildModal={onSelectChildModal}
        />

        <InvoicesSelectionStep
          paidInvoices={form.paidInvoices}
          onToggleInvoice={toggleInvoice}
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
              disabled={isSubmitting}
              className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors"
              type="button"
            >
              حفظ دون طباعة
            </button>
          </div>

          <button
            onClick={onSaveAndPrint}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">print</span>
            <span>حفظ وطباعة السند فوراً [F10]</span>
          </button>
        </div>
      </div>
    </div>
  )
}
