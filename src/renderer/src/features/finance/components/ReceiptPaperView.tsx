import { PaymentFormState } from './PaymentEntryForm'
import { numberToWordsArabic } from './numberToWordsArabic'

interface ReceiptPaperViewProps {
  form: PaymentFormState
  receiptNumber: string
  receiptDate: string
  format: '80mm' | 'a5' | 'a4'
}

export function ReceiptPaperView({
  form,
  receiptNumber,
  receiptDate,
  format
}: ReceiptPaperViewProps) {
  const words = numberToWordsArabic(form.amount)

  return (
    <div
      className={`relative mx-auto bg-white text-slate-900 border border-slate-200 shadow-md rounded-lg overflow-hidden transition-all ${
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
              رقم الاعتماد الوزاري: 14/2020 • بلدية الياسمين
            </span>
          </div>
        </div>
        <div className="text-left font-mono text-[11px] text-slate-600">
          <span className="block font-bold text-slate-900">{receiptNumber}</span>
          <span>{receiptDate}</span>
        </div>
      </div>

      {/* Watermark Status */}
      <div className="text-center my-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-bold text-sm tracking-wide">
        وصل قبض وسداد رسمي — مبرأ للذمة
      </div>

      {/* Child & Guardian Metadata */}
      <div className="bg-slate-50 rounded-lg p-3 my-3 space-y-1.5 text-xs text-slate-700">
        <div className="flex justify-between">
          <span className="text-slate-500">اسم الطفل الكامل:</span>
          <span className="font-bold text-slate-900">{form.childName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">الفصل الدراسي:</span>
          <span className="font-semibold">{form.classroom}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">ولي الأمر الحاضر:</span>
          <span className="font-semibold">{form.guardianName} (أب)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">وسيلة الدفع:</span>
          <span className="font-semibold text-primary">
            {form.paymentMethod === 'cash'
              ? 'نقداً (Cash)'
              : form.paymentMethod === 'cheque'
              ? 'صك بنكي'
              : form.paymentMethod === 'transfer'
              ? 'تحويل BaridiMob'
              : 'بطاقة CIB'}
          </span>
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
          <tr>
            <td className="py-2">اشتراك التمدرس (شهر نوفمبر 2026)</td>
            <td className="py-2 text-left font-bold">14,000.00 دج</td>
          </tr>
          <tr>
            <td className="py-2">اشتراك النقل المدرسي (ذهاب وإياب)</td>
            <td className="py-2 text-left font-bold">6,000.00 دج</td>
          </tr>
        </tbody>
      </table>

      {/* Total Box */}
      <div className="border-t-2 border-slate-900 pt-3 flex items-baseline justify-between">
        <span className="font-bold text-sm text-slate-900">المجموع المدفوع:</span>
        <span className="font-mono text-lg font-bold text-primary">
          {form.amount.toLocaleString()} دج
        </span>
      </div>

      {/* Words */}
      <div className="mt-2 p-2 bg-slate-50 rounded text-[11px] text-slate-700 leading-snug">
        <span className="font-bold">فقط وقدره: </span>
        <span>{words} لا غير.</span>
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
