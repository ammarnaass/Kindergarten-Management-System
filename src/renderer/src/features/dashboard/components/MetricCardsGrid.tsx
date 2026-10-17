import { useNavigate } from 'react-router-dom'

function formatCents(cents: number): string {
  if (cents === 0) return '0 دج'
  if (cents >= 1_000_000) return `${(cents / 1_000_000).toFixed(1)} م.دج`
  if (cents >= 1_000) return `${Math.round(cents / 1_000).toLocaleString('ar-DZ')} د.دج`
  return `${cents} سنتيم`
}

interface MetricCardsGridProps {
  isLoading?: boolean
  totalChildren?: number
  presentCount?: number
  absentCount?: number
  lateCount?: number
  attendanceRate?: string
  tuitionPercent?: number
  collectedAmountCents?: number
  totalTargetAmountCents?: number
  overdueInvoicesCount?: number
  overdueAmountCents?: number
  dbSizeBytes?: number
  backupsCount?: number
}

export function MetricCardsGrid({
  isLoading = false,
  totalChildren = 0,
  presentCount = 0,
  absentCount = 0,
  lateCount = 0,
  attendanceRate = '—',
  tuitionPercent = 0,
  collectedAmountCents = 0,
  totalTargetAmountCents = 0,
  overdueInvoicesCount = 0,
  overdueAmountCents = 0,
  dbSizeBytes = 0,
  backupsCount = 0
}: MetricCardsGridProps) {
  const navigate = useNavigate()

  const markedToday = presentCount + absentCount + lateCount
  const deliveredPercent = markedToday > 0 ? Math.round((presentCount / markedToday) * 100) : 0
  const waitingPercent = markedToday > 0 ? Math.round(((absentCount + lateCount) / markedToday) * 100) : 0
  const dbSizeMb = (dbSizeBytes / (1024 * 1024)).toFixed(1)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm animate-pulse h-40" />
        ))}
      </div>
    )
  }

  const hasNoData = totalChildren === 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
      {/* البطاقة 1: الحضور اليومي */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant">حاضرون اليوم</span>
              {absentCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption font-medium">
                  {absentCount} غياب
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
                {hasNoData ? '—' : presentCount}{' '}
                <span className="text-outline text-headline-lg font-normal">/ {totalChildren}</span>
              </span>
              {!hasNoData && markedToday > 0 && (
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">check</span>
                  {attendanceRate}
                </span>
              )}
            </div>
            {hasNoData ? (
              <span className="font-caption text-caption text-on-surface-variant">لا يوجد أطفال مسجلون بعد</span>
            ) : markedToday === 0 ? (
              <span className="font-caption text-caption text-amber-700">لم يُسجَّل الحضور بعد اليوم</span>
            ) : (
              <span className="font-caption text-caption text-on-surface-variant">
                {lateCount > 0 && `${lateCount} متأخر • `}حضور مسجل ومطابق
              </span>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">how_to_reg</span>
          </div>
        </div>

        {!hasNoData && markedToday > 0 && (
          <div className="mt-3 pt-2.5 border-t border-surface-container">
            <div className="flex items-center justify-between font-caption text-caption mb-1.5">
              <span className="text-on-surface font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                حضور: {presentCount} ({deliveredPercent}%)
              </span>
              {(absentCount + lateCount) > 0 && (
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                  غياب/تأخر: {absentCount + lateCount} ({waitingPercent}%)
                </span>
              )}
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
              <div className="bg-emerald-500 h-2 transition-all duration-700" style={{ width: `${deliveredPercent}%` }} />
              <div className="bg-secondary-container h-2 transition-all duration-700" style={{ width: `${waitingPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* البطاقة 2: تحصيل الرسوم */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant">تحصيل رسوم الشهر</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight font-mono">
                {totalTargetAmountCents === 0 ? '—' : `${tuitionPercent}%`}
              </span>
              {tuitionPercent > 0 && (
                <span className={`font-caption text-caption px-1.5 py-0.5 rounded font-semibold ${tuitionPercent >= 80 ? 'text-emerald-700 bg-emerald-50' : tuitionPercent >= 50 ? 'text-amber-700 bg-amber-50' : 'text-error bg-error-container'}`}>
                  {tuitionPercent >= 80 ? 'مستقر' : tuitionPercent >= 50 ? 'متوسط' : 'يحتاج متابعة'}
                </span>
              )}
            </div>
            <span className="font-caption text-caption text-on-surface-variant font-mono">
              {totalTargetAmountCents === 0
                ? 'لا توجد فواتير مُصدرة للشهر الحالي'
                : `${formatCents(collectedAmountCents)} من ${formatCents(totalTargetAmountCents)}`
              }
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
        </div>
        {totalTargetAmountCents > 0 && (
          <div className="mt-4 pt-3 flex items-center justify-between">
            <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
              <div
                className="bg-secondary-container h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(tuitionPercent, 100)}%` }}
              />
            </div>
            <span className="font-mono text-caption text-secondary font-bold mr-3">{tuitionPercent}%</span>
          </div>
        )}
      </div>

      {/* البطاقة 3: الفواتير المتأخرة */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-surface-variant">فواتير متأخرة السداد</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`font-display-lg text-display-lg font-bold tracking-tight font-mono ${overdueInvoicesCount > 0 ? 'text-error' : 'text-emerald-600'}`}>
                {overdueInvoicesCount > 0 ? overdueInvoicesCount : '✓'}
              </span>
              {overdueInvoicesCount > 0 && (
                <span className="font-label-sm text-label-sm text-error font-semibold">فاتورة مستحقة</span>
              )}
            </div>
            <span className={`font-caption text-caption font-mono font-semibold ${overdueInvoicesCount > 0 ? 'text-error' : 'text-emerald-700'}`}>
              {overdueInvoicesCount > 0
                ? `إجمالي: ${formatCents(overdueAmountCents)}`
                : 'لا توجد فواتير متأخرة 🎉'
              }
            </span>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${overdueInvoicesCount > 0 ? 'bg-error-container text-error' : 'bg-emerald-100 text-emerald-700'}`}>
            <span className="material-symbols-outlined text-xl">
              {overdueInvoicesCount > 0 ? 'notification_important' : 'check_circle'}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between">
          <span className="font-caption text-caption text-on-surface-variant">
            {overdueInvoicesCount > 0 ? 'تأخر > 15 يوماً' : 'كل الفواتير مسددة'}
          </span>
          <button
            onClick={() => navigate('/finance')}
            className="text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-0.5"
            type="button"
          >
            <span>متابعة</span>
            <span className="material-symbols-outlined text-xs">arrow_back</span>
          </button>
        </div>
      </div>

      {/* البطاقة 4: سلامة النظام المحلي */}
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
              {dbSizeBytes > 0 ? `حجم القاعدة: ${dbSizeMb} ميجا` : 'قاعدة بيانات نظيفة'}
              {backupsCount > 0 && ` • ${backupsCount} نسخ احتياطية`}
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
