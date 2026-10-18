import React from 'react'
import { PaymentEntryForm } from './PaymentEntryForm'
import { ReceiptPreviewCanvas } from './ReceiptPreviewCanvas'
import type { PaymentFormState, InvoiceItem } from '../types'

interface FinancePosSectionProps {
  form: PaymentFormState
  invoices: InvoiceItem[]
  dueBalance: string
  selectedInvoice: InvoiceItem | null
  lastReceiptNumber: string
  onChange: (updated: Partial<PaymentFormState>) => void
  onSaveAndPrint: () => void
  onSaveOnly: () => void
  onCancel: () => void
  onSelectChildModal: () => void
  onQuickCreateInvoice: () => void
  isCreatingInvoice: boolean
  isSubmitting: boolean
}

export const FinancePosSection: React.FC<FinancePosSectionProps> = ({
  form,
  invoices,
  dueBalance,
  selectedInvoice,
  lastReceiptNumber,
  onChange,
  onSaveAndPrint,
  onSaveOnly,
  onCancel,
  onSelectChildModal,
  onQuickCreateInvoice,
  isCreatingInvoice,
  isSubmitting,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      {/* نموذج تسجيل الدفعة واختيار الفاتورة */}
      <div className="lg:col-span-7 flex flex-col gap-space-md print:hidden">
        <PaymentEntryForm
          form={form}
          invoices={invoices}
          dueBalance={dueBalance}
          onChange={onChange}
          onSaveAndPrint={onSaveAndPrint}
          onSaveOnly={onSaveOnly}
          onCancel={onCancel}
          onSelectChildModal={onSelectChildModal}
          onQuickCreateInvoice={onQuickCreateInvoice}
          isCreatingInvoice={isCreatingInvoice}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* لوحة المعاينة الحية للوصل المطبوع */}
      <div className="lg:col-span-5 flex flex-col gap-space-md">
        <ReceiptPreviewCanvas
          form={form}
          receiptNumber={lastReceiptNumber || 'REC-2026-000001'}
          selectedInvoice={selectedInvoice}
          onPrint={() => window.print()}
        />
      </div>
    </div>
  )
}
