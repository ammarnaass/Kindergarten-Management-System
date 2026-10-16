import { useState } from 'react'
import { PaymentFormState } from './PaymentEntryForm'
import { ReceiptPaperView } from './ReceiptPaperView'

interface ReceiptPreviewCanvasProps {
  form: PaymentFormState
  receiptNumber?: string
  receiptDate?: string
  onPrint?: () => void
}

export function ReceiptPreviewCanvas({
  form,
  receiptNumber = 'REC-2026-00842',
  receiptDate = '16/10/2026 • 10:45 ص',
  onPrint = () => window.print()
}: ReceiptPreviewCanvasProps) {
  const [format, setFormat] = useState<'80mm' | 'a5' | 'a4'>('a5')

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

          <button
            onClick={() => alert(`إرسال السند ${receiptNumber} إلى واتساب الولي: ${form.guardianPhone}`)}
            className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="إرسال عبر واتساب لولي الأمر"
            type="button"
          >
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </div>
      </div>

      {/* Rendered simulated physical paper */}
      <ReceiptPaperView
        form={form}
        receiptNumber={receiptNumber}
        receiptDate={receiptDate}
        format={format}
      />
    </div>
  )
}
