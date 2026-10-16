import { useNavigate } from 'react-router-dom'

interface MetricCardsGridProps {
  presentCount?: number
  totalCount?: number
  attendanceRate?: string
  deliveredCount?: number
  waitingCount?: number
  lastCheckoutName?: string
  tuitionPercent?: number
  collectedAmount?: string
  totalTargetAmount?: string
  overdueInvoicesCount?: number
  overdueAmount?: string
  backupTimeAgo?: string
}

export function MetricCardsGrid({
  presentCount = 47,
  totalCount = 52,
  attendanceRate = '90.4%',
  deliveredCount = 39,
  waitingCount = 8,
  lastCheckoutName = 'عبد الله القحطاني',
  tuitionPercent = 84,
  collectedAmount = '840,000 دج',
  totalTargetAmount = '1,000,000 دج',
  overdueInvoicesCount = 12,
  overdueAmount = '186,000 دج',
  backupTimeAgo = 'قبل 45 دقيقة',
}: MetricCardsGridProps) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
      {/* Card 1: Daily Attendance */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">حاضرون اليوم</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption font-medium">
                {totalCount - presentCount} غياب
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
                {presentCount} <span className="text-outline text-headline-lg font-normal">/ {totalCount}</span>
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">check</span>
                {attendanceRate}
              </span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant">
              حضور مسجل ومطابق مع البوابة
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">how_to_reg</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-surface-container">
          <div className="flex items-center justify-between font-caption text-caption mb-1.5">
            <span className="text-on-surface font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              تم التسليم: {deliveredCount} (83%)
            </span>
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
              بالانتظار: {waitingCount} (17%)
            </span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
            <div className="bg-emerald-500 h-2 transition-all duration-700" style={{ width: '83%' }} />
            <div className="bg-secondary-container h-2 transition-all duration-700" style={{ width: '17%' }} />
          </div>
          <div className="flex items-center justify-between mt-2 font-caption text-caption text-on-surface-variant">
            <span className="truncate">آخر انصراف: {lastCheckoutName}</span>
            <span className="font-mono text-outline">16:38:10</span>
          </div>
        </div>
      </div>

      {/* Card 2: Tuition Collection */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant">تحصيل الرسوم الشهرية</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight font-mono">
                {tuitionPercent}%
              </span>
              <span className="font-caption text-caption text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                مستقر
              </span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant font-mono">
              {collectedAmount} <span className="text-outline">من {totalTargetAmount}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between">
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-secondary-container h-2 rounded-full transition-all duration-700"
              style={{ width: `${tuitionPercent}%` }}
            />
          </div>
          <span className="font-mono text-caption text-secondary font-bold mr-3">{tuitionPercent}%</span>
        </div>
      </div>

      {/* Card 3: Overdue Invoices Alert */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant">فواتير متأخرة</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg text-error font-bold tracking-tight font-mono">
                {overdueInvoicesCount}
              </span>
              <span className="font-label-sm text-label-sm text-error font-semibold">فاتورة مستحقة</span>
            </div>
            <span className="font-caption text-caption text-error font-mono font-semibold">
              إجمالي: {overdueAmount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-xl">notification_important</span>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between">
          <span className="font-caption text-caption text-on-surface-variant">تأخر &gt; 15 يوماً</span>
          <button
            onClick={() => navigate('/finance')}
            className="text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-0.5"
            type="button"
          >
            <span>متابعة الأولياء</span>
            <span className="material-symbols-outlined text-xs">arrow_back</span>
          </button>
        </div>
      </div>

      {/* Card 4: Local System Offline Integrity */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant">سلامة النظام المحلي</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg text-emerald-600 font-bold tracking-tight">
                ممتازة
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant">
              نسخ احتياطي {backupTimeAgo}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">hard_drive</span>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between font-caption text-caption">
          <span className="text-outline font-mono">SQLite WAL نشط</span>
          <button
            onClick={() => navigate('/backup')}
            className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-semibold hover:underline"
          >
            سجل النسخ
          </button>
        </div>
      </div>
    </div>
  )
}
