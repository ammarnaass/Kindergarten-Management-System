import { useNavigate } from 'react-router-dom'

interface TransactionItem {
  id: string
  code: string
  studentName: string
  method: string
  timeAgo: string
  amount: string
  note: string
  icon: string
  iconBg: string
  iconColor: string
}

const TRANSACTIONS: TransactionItem[] = [
  {
    id: '1',
    code: '#REC-8421',
    studentName: 'ريان بلحاج',
    method: 'نقداً',
    timeAgo: 'منذ 18 دقيقة',
    amount: '20,000 دج',
    note: 'قسط أكتوبر',
    icon: 'payments',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-800',
  },
  {
    id: '2',
    code: '#REC-8420',
    studentName: 'سيرين مزيان',
    method: 'تحويل',
    timeAgo: 'منذ ساعة',
    amount: '35,000 دج',
    note: 'رسوم دراسة + إطعام',
    icon: 'account_balance',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-on-primary-fixed-variant',
  },
  {
    id: '3',
    code: '#REC-8419',
    studentName: 'أمير شريف',
    method: 'شيك بنكي',
    timeAgo: 'اليوم 09:15',
    amount: '18,500 دج',
    note: 'قسط أكتوبر',
    icon: 'history_edu',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-800',
  },
  {
    id: '4',
    code: '#REC-8418',
    studentName: 'كنزة بن ناصر',
    method: 'نقداً',
    timeAgo: 'أمس 15:40',
    amount: '5,000 دج',
    note: 'نشاط السباحة',
    icon: 'payments',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-800',
  },
]

export function RecentTransactionsSection() {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">receipt</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              آخر المدفوعات المسجلة
            </h2>
            <p className="font-caption text-caption text-on-surface-variant">
              حفظ فوري في دفتر اليومية المحلي
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/finance')}
          className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-0.5"
          type="button"
        >
          <span>سجل المعاملات</span>
          <span className="material-symbols-outlined text-xs">arrow_back</span>
        </button>
      </div>

      {/* Transactions Compact Audit Table */}
      <div className="space-y-space-sm">
        {TRANSACTIONS.map((tx) => (
          <div
            key={tx.id}
            className="rounded-lg bg-surface-container-low p-space-sm hover:bg-surface-container transition-colors flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full ${tx.iconBg} ${tx.iconColor} flex items-center justify-center shrink-0 font-bold`}
              >
                <span className="material-symbols-outlined text-sm">{tx.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                    {tx.studentName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption">
                    {tx.method}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant mt-0.5 font-mono">
                  <span>{tx.code}</span>
                  <span>•</span>
                  <span>{tx.timeAgo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-left font-mono">
                <div className="font-label-md text-label-md font-bold text-on-surface">
                  {tx.amount}
                </div>
                <div className="font-caption text-caption text-emerald-700 font-sans">
                  {tx.note}
                </div>
              </div>
              <button
                onClick={() => navigate('/finance')}
                className="w-7 h-7 rounded bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-surface transition-colors flex items-center justify-center shadow-2xs"
                title="طباعة الإيصال فوراً"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">print</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Local Register Summary Footnote */}
      <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
        <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
          <span className="material-symbols-outlined text-base text-primary">point_of_sale</span>
          <span>مجموع صندوق اليوم:</span>
        </div>
        <span className="font-label-md text-label-md font-bold font-mono text-primary">
          78,500 دج
        </span>
      </div>
    </div>
  )
}
