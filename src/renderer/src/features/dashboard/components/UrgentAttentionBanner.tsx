import { useNavigate } from 'react-router-dom'

export function UrgentAttentionBanner() {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl bg-surface-container-low p-space-md shadow-xs select-none">
      <div className="flex items-center justify-between mb-space-sm px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-lg">assignment_late</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            تحتاج انتباهك اليوم
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-bold">
            4 مهام معلقة
          </span>
        </div>
        <span className="font-caption text-caption text-on-surface-variant">
          معالجة فورية دون مغادرة لوحة التحكم
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-sm">
        {/* Task 1: Waiting Lobby */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow ring-1 ring-secondary-container/60">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base animate-pulse">sensor_door</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                8 أطفال في بهو الانتظار
              </p>
              <p className="font-caption text-caption text-amber-800">بانتظار وصول الأولياء بالبوابة</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant font-mono">منذ 16:30</span>
            <button
              onClick={() => navigate('/safe-pickup')}
              className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold hover:bg-secondary-fixed transition-colors shadow-2xs"
              type="button"
            >
              شاشة البوابة
            </button>
          </div>
        </div>

        {/* Task 2: Emergency Authorization */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">verified_user</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                تفويض استثنائي معتمد
              </p>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                ريان الصالح (سند #8925)
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span className="font-caption text-caption text-emerald-700 font-semibold">موثّق وموقّع</span>
            <button
              onClick={() => navigate('/safe-pickup')}
              className="px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors"
              type="button"
            >
              عرض السند
            </button>
          </div>
        </div>

        {/* Task 3: Upcoming Invoices */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">receipt_long</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                5 فواتير تستحق السداد
              </p>
              <p className="font-caption text-caption text-on-surface-variant">تستحق خلال 3 أيام قادمة</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex justify-end">
            <button
              onClick={() => navigate('/finance')}
              className="px-2.5 py-1 rounded-md bg-surface-container text-primary font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-colors"
              type="button"
            >
              عرض الفواتير
            </button>
          </div>
        </div>

        {/* Task 4: Birthday Tomorrow */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">cake</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                عيد ميلاد غداً 🎂
              </p>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                يوسف بن خالد (فصل النجوم)
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 flex items-center justify-between">
            <span className="font-caption text-caption text-rose-600 font-semibold">يتم 5 سنوات</span>
            <button
              onClick={() => navigate('/children')}
              className="px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors"
              type="button"
            >
              تجهيز بطاقة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
