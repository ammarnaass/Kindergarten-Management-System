import { PaymentFormState } from './PaymentEntryForm'
import { numberToWordsArabic } from './numberToWordsArabic'
import type { InvoiceItem } from '@/lib/api/types'

interface ReceiptPaperViewProps {
  form: PaymentFormState
  receiptNumber: string
  receiptDate: string
  format: '80mm' | 'a5' | 'a4'
  selectedInvoice?: InvoiceItem | null
}

export function ReceiptPaperView({
  form,
  receiptNumber,
  receiptDate,
  format,
  selectedInvoice,
}: ReceiptPaperViewProps) {
  const words = numberToWordsArabic(form.amount)

  const getMethodText = (method: string) => {
    switch (method) {
      case 'cash':
        return 'نقداً (Cash)'
      case 'cheque':
        return 'صك بنكي (Cheque)'
      case 'transfer':
        return 'تحويل بنكي / BaridiMob'
      case 'card':
        return 'بطاقة بنكية CIB / الذهبية'
      default:
        return 'نقداً'
    }
  }

  const items = selectedInvoice?.items && selectedInvoice.items.length > 0
    ? selectedInvoice.items
    : [
        {
          id: '1',
          label: form.note || selectedInvoice?.period || 'رسوم التمدرس والخدمات المقررة',
          quantity: 1,
          unitCents: form.amount * 100,
        },
      ]

  return (
    <div
      className={`receipt-printable relative mx-auto bg-white text-slate-900 border border-slate-200 shadow-md rounded-lg overflow-hidden transition-all ${
        format === '80mm' ? 'max-w-[340px] p-4 text-xs' : 'max-w-[480px] p-6 text-sm'
      }`}
    >
      {/* Official Kindergarten Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">
            ر
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900 leading-tight">
              روضة براعم الياسمين النموذجية
            </h4>
            <span className="text-[11px] text-slate-500 block">
              نظام روضتي لإدارة رياض الأطفال • وصل رسمي
            </span>
          </div>
        </div>
        <div className="text-left font-mono text-[11px] text-slate-600">
          <span className="block font-bold text-slate-900">{receiptNumber}</span>
          <span>{receiptDate}</span>
        </div>
      </div>

      {/* Status Banner */}
      <div className="text-center my-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-bold text-sm tracking-wide">
        وصل قبض وسداد رسمي — مبرأ للذمة
      </div>

      {/* Child & Guardian Metadata */}
      <div className="bg-slate-50 rounded-lg p-3 my-3 space-y-1.5 text-xs text-slate-700">
        <div className="flex justify-between">
          <span className="text-slate-500">اسم الطفل الكامل:</span>
          <span className="font-bold text-slate-900">{form.childName || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">الفصل الدراسي:</span>
          <span className="font-semibold">{form.classroom || 'غير محدد'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">ولي الأمر المستلم:</span>
          <span className="font-semibold">{form.guardianName || 'ولي الأمر'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">وسيلة الدفع:</span>
          <span className="font-semibold text-primary">{getMethodText(form.paymentMethod)}</span>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full text-right my-3 text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-1">البيان والخدمة</th>
            <th className="py-1 text-left">المبلغ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-2">{item.label}</td>
              <td className="py-2 text-left font-bold">
                {((item.unitCents * (item.quantity || 1)) / 100).toLocaleString('ar-DZ')} دج
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Box */}
      <div className="border-t-2 border-slate-900 pt-3 flex items-baseline justify-between">
        <span className="font-bold text-sm text-slate-900">المجموع المدفوع:</span>
        <span className="font-mono text-lg font-bold text-primary">
          {form.amount.toLocaleString('ar-DZ')} دج
        </span>
      </div>

      {/* Words */}
      <div className="mt-2 p-2 bg-slate-50 rounded text-[11px] text-slate-700 leading-snug">
        <span className="font-bold">فقط وقدره: </span>
        <span>{words}</span>
      </div>

      {/* Signatures & Stamp */}
      <div className="flex justify-between items-end mt-6 pt-4 border-t border-dashed border-slate-300 text-[11px] text-slate-500">
        <div className="text-center">
          <span>توقيع ولي الأمر</span>
          <div className="h-8 border-b border-slate-300 w-24 mt-2" />
        </div>
        <div className="text-center">
          <span>ختم الإدارة وأمين الصندوق</span>
          <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary font-bold text-[9px] -rotate-12 mx-auto mt-1">
            روضتي
            <br />
            تم القبض
          </div>
        </div>
      </div>
    </div>
  )
}
