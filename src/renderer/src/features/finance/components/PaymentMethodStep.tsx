import { numberToWordsArabic } from './numberToWordsArabic'

interface PaymentMethodStepProps {
  amount: number
  paymentMethod: 'cash' | 'cheque' | 'transfer' | 'card'
  reference: string
  note: string
  onAmountChange: (amt: number) => void
  onMethodChange: (method: 'cash' | 'cheque' | 'transfer' | 'card') => void
  onReferenceChange: (ref: string) => void
  onNoteChange: (note: string) => void
}

export function PaymentMethodStep({
  amount,
  paymentMethod,
  reference,
  note,
  onAmountChange,
  onMethodChange,
  onReferenceChange,
  onNoteChange
}: PaymentMethodStepProps) {
  const words = numberToWordsArabic(amount)

  return (
    <div className="flex flex-col gap-space-sm pt-2 select-none">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-caption flex items-center justify-center font-bold">
          3
        </span>
        <span className="font-label-lg text-label-lg font-bold text-on-surface">
          بيانات المبلغ ووسيلة الدفع
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm">
        {/* Amount Input */}
        <div className="md:col-span-7 flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
            <span>المبلغ المستلم فعلياً:</span>
            <span className="text-caption font-caption text-primary">المطابق تماماً للفاتورة</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              className="w-full h-11 pr-3 pl-14 rounded-lg bg-surface-container text-on-surface font-headline-md text-headline-md font-bold tracking-wider font-mono focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all"
              value={amount}
              onChange={(e) => onAmountChange(Number(e.target.value) || 0)}
            />
            <span className="absolute left-3 font-label-md text-label-md font-bold text-on-surface-variant pointer-events-none">
              دج
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-5 flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface font-semibold">
            تاريخ السند:
          </label>
          <div className="relative flex items-center">
            <input
              className="w-full h-11 pr-3 pl-8 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none cursor-default font-semibold shadow-xs"
              readOnly
              type="text"
              value="16 أكتوبر 2026"
            />
            <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant pointer-events-none text-base">
              calendar_today
            </span>
          </div>
        </div>
      </div>

      {/* Currency to Words Dynamic Box */}
      <div className="bg-secondary-fixed/30 rounded-lg p-2.5 flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-base">format_quote</span>
        <div className="flex-1">
          <span className="font-caption text-caption text-secondary block font-bold">
            المبلغ بالحروف (توليد محاسبي معتمد):
          </span>
          <span className="font-body-md text-body-md text-on-secondary-fixed font-semibold">
            {words}
          </span>
        </div>
      </div>

      {/* Payment Methods Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="font-label-md text-label-md text-on-surface font-semibold">
          طريقة السداد المستعملة:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onMethodChange('cash')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg shadow-xs transition-all ${
              paymentMethod === 'cash'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-xl">payments</span>
            <span className="font-label-sm text-label-sm font-bold mt-1">نقداً (Cash)</span>
          </button>

          <button
            type="button"
            onClick={() => onMethodChange('cheque')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg shadow-xs transition-all ${
              paymentMethod === 'cheque'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-xl">check_box</span>
            <span className="font-label-sm text-label-sm font-bold mt-1">صك بنكي / بريدي</span>
          </button>

          <button
            type="button"
            onClick={() => onMethodChange('transfer')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg shadow-xs transition-all ${
              paymentMethod === 'transfer'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-xl">account_balance</span>
            <span className="font-label-sm text-label-sm font-bold mt-1">تحويل BaridiMob</span>
          </button>

          <button
            type="button"
            onClick={() => onMethodChange('card')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg shadow-xs transition-all ${
              paymentMethod === 'card'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-xl">credit_card</span>
            <span className="font-label-sm text-label-sm font-bold mt-1">بطاقة بنكية CIB</span>
          </button>
        </div>
      </div>

      {/* Reference & Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-1">
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface font-semibold">
            رقم السند المرجعي أو رقم الشيك:
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/40"
            placeholder="مثال: CHQ-884920 أو رقم عملية BaridiMob"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface font-semibold">
            ملاحظات السداد المحاسبية:
          </label>
          <input
            type="text"
            className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/40"
            placeholder="مثال: خصم إخوة 10% مطبق أو تسديد جزئي"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
