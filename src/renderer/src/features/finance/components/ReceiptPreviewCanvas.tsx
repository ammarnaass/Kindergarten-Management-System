import { useState } from 'react'
import { PaymentFormState } from './PaymentEntryForm'
import { ReceiptPaperView } from './ReceiptPaperView'
import type { InvoiceItem } from '@/lib/api/types'

interface ReceiptPreviewCanvasProps {
  form: PaymentFormState
  receiptNumber?: string
  receiptDate?: string
  onPrint?: () => void
  selectedInvoice?: InvoiceItem | null
}

export function ReceiptPreviewCanvas({
  form,
  receiptNumber = 'REC-2026-000001',
  receiptDate,
  onPrint = () => window.print(),
  selectedInvoice = null,
}: ReceiptPreviewCanvasProps) {
  const [format, setFormat] = useState<'80mm' | 'a5' | 'a4'>('a5')

  const dateDisplay =
    receiptDate ||
    new Date().toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="flex flex-col gap-space-sm select-none">
      {/* Preview Header & Output Controls Bar */}
      <div className="bg-surface-container-lowest px-space-md py-2.5 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-space-sm">
        {/* Format Selector */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
          <button
            onClick={() => setFormat('80mm')}
            className={`px-2.5 py-1 rounded-md font-caption text-caption transition-all ${
              format === '80mm'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface font-semibold'
            }`}
            type="button"
          >
            حراري 80mm
          </button>
          <button
            onClick={() => setFormat('a5')}
            className={`px-2.5 py-1 rounded-md font-caption text-caption transition-all ${
              format === 'a5'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface font-semibold'
            }`}
            type="button"
          >
            صفحة A5 قياسية
          </button>
          <button
            onClick={() => setFormat('a4')}
            className={`px-2.5 py-1 rounded-md font-caption text-caption transition-all ${
              format === 'a4'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface font-semibold'
            }`}
            type="button"
          >
            A4 مزدوج
          </button>
        </div>

        {/* Direct Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold hover:bg-primary-fixed-dim transition-colors shadow-xs"
            title="طباعة فورية"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>طباعة سريعة</span>
          </button>

          <button
            onClick={onPrint}
            className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="تصدير كملف PDF"
            type="button"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
          </button>
        </div>
      </div>

      {/* Rendered simulated physical paper */}
      <ReceiptPaperView
        form={form}
        receiptNumber={receiptNumber}
        receiptDate={dateDisplay}
        format={format}
        selectedInvoice={selectedInvoice}
      />
    </div>
  )
}
