import { useNavigate } from 'react-router-dom'
import type { BirthdaySoon } from '@/lib/api/types'

interface UrgentAttentionBannerProps {
  overdueInvoicesCount: number
  birthdays: BirthdaySoon[]
}

export function UrgentAttentionBanner({ overdueInvoicesCount, birthdays }: UrgentAttentionBannerProps) {
  const navigate = useNavigate()

  const pendingItemsCount = (overdueInvoicesCount > 0 ? 1 : 0) + (birthdays.length > 0 ? birthdays.length : 0)
  const nextBirthday = birthdays[0]

  return (
    <div className="rounded-xl bg-surface-container-low p-space-md shadow-xs select-none">
      <div className="flex items-center justify-between mb-space-sm px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-lg">assignment_late</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            تحتاج انتباهك اليوم
          </h2>
          <span
            className={`px-2 py-0.5 rounded-full font-caption text-caption font-bold ${
              pendingItemsCount > 0
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {pendingItemsCount > 0 ? `${pendingItemsCount} تنبيهات نشطة` : 'لا توجد تنبيهات عاجلة'}
          </span>
        </div>
        <span className="font-caption text-caption text-on-surface-variant">
          معالجة سريعة وإشعارات الإدارة المباشرة
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-sm">
        {/* Task 1: Invoices Due / Overdue */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow ring-1 ring-secondary-container/60">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                overdueInvoicesCount > 0 ? 'bg-amber-50 text-amber-800' : 'bg-surface-container text-outline'
              }`}
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                {overdueInvoicesCount > 0
                  ? `${overdueInvoicesCount} فواتير متأخرة السداد`
                  : 'كل الفواتير مسددة'}
              </p>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                {overdueInvoicesCount > 0
                  ? 'مستحقات معلقة تحتاج متابعة الأولياء'
                  : 'لا توجد فواتير متأخرة حالياً'}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span
              className={`font-caption text-caption font-semibold ${
                overdueInvoicesCount > 0 ? 'text-amber-800' : 'text-emerald-700'
              }`}
            >
              {overdueInvoicesCount > 0 ? 'تحتاج تحصيل' : 'حالة سليمة'}
            </span>
            <button
              onClick={() => navigate('/finance')}
              className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold hover:bg-secondary-fixed transition-colors shadow-2xs"
              type="button"
            >
              عرض الفواتير
            </button>
          </div>
        </div>

        {/* Task 2: Birthdays Coming Soon */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                nextBirthday ? 'bg-rose-50 text-rose-600' : 'bg-surface-container text-outline'
              }`}
            >
              <span className="material-symbols-outlined text-base">cake</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                {nextBirthday
                  ? nextBirthday.daysUntil === 0
                    ? `عيد ميلاد اليوم 🎂`
                    : nextBirthday.daysUntil === 1
                      ? `عيد ميلاد غداً 🎂`
                      : `عيد ميلاد بعد ${nextBirthday.daysUntil} أيام`
                  : 'لا أعياد ميلاد قريبة'}
              </p>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                {nextBirthday
                  ? `${nextBirthday.firstName} ${nextBirthday.lastName} (${nextBirthday.classroomName ?? 'غير مسكّن'})`
                  : 'خلال الأيام الـ 7 القادمة'}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span className="font-caption text-caption text-rose-600 font-semibold">
              {nextBirthday ? `يتم ${nextBirthday.turnsAge} سنوات` : '—'}
            </span>
            <button
              onClick={() => navigate('/children')}
              className="px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors"
              type="button"
            >
              قائمة الأطفال
            </button>
          </div>
        </div>

        {/* Task 3: Attendance shortcut */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">how_to_reg</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                تسجيل حضور اليوم
              </p>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                وضع الفصل التفاعلي السريع للمعلمات
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span className="font-caption text-caption text-emerald-700 font-semibold">تسجيل سريع</span>
            <button
              onClick={() => navigate('/attendance')}
              className="px-2.5 py-1 rounded-md bg-surface-container text-primary font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-colors"
              type="button"
            >
              فتح الحضور
            </button>
          </div>
        </div>

        {/* Task 4: Safe Pickup Gate */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">sensor_door</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                بوابة الاستلام الآمن
              </p>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                التحقق من المخولين وقراءة الباركود
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant font-mono">حماية 100%</span>
            <button
              onClick={() => navigate('/safe-pickup')}
              className="px-2.5 py-1 rounded-md bg-surface-container text-primary font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-colors"
              type="button"
            >
              شاشة البوابة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
