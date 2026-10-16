export function GrowthMetricsBento() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">vital_signs</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            مؤشرات النمو والتطور البدني
          </h3>
        </div>
        <span className="font-caption text-caption px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
          منحنى نمو طبيعي ممتاز
        </span>
      </div>

      <div className="grid grid-cols-2 gap-space-md">
        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
          <div>
            <span className="font-caption text-caption text-on-surface-variant">الطول الحالي</span>
            <div className="font-display-md text-display-md text-on-surface font-bold">
              102 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">سم</span>
            </div>
            <span className="font-caption text-caption text-emerald-600 flex items-center gap-0.5 pt-0.5 font-medium">
              <span className="material-symbols-outlined text-xs">trending_up</span> +3 سم آخر فحص
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">height</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between">
          <div>
            <span className="font-caption text-caption text-on-surface-variant">الوزن الحالي</span>
            <div className="font-display-md text-display-md text-on-surface font-bold">
              16.2 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">كغ</span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant flex items-center gap-0.5 pt-0.5">
              فئة المئين 65% (مثالي)
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-xl">scale</span>
          </div>
        </div>
      </div>

      {/* Inline SVG Growth Curve Sparkline */}
      <div className="bg-surface-container rounded-lg p-space-sm">
        <div className="flex items-center justify-between text-on-surface-variant font-caption text-caption mb-1">
          <span>منحنى الزيادة في الوزن والطول (آخر 6 أشهر)</span>
          <span className="font-mono text-primary font-bold">قياس 10 أكتوبر 2026</span>
        </div>
        <svg className="w-full h-12 text-primary" fill="none" viewBox="0 0 300 48">
          <path
            d="M0,40 Q40,35 75,32 T150,22 T225,14 T300,6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M0,40 Q40,35 75,32 T150,22 T225,14 T300,6 L300,48 L0,48 Z"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <circle cx="75" cy="32" fill="currentColor" r="3" />
          <circle cx="150" cy="22" fill="currentColor" r="3" />
          <circle cx="225" cy="14" fill="currentColor" r="3" />
          <circle className="animate-ping" cx="300" cy="6" fill="currentColor" r="4" />
          <circle cx="300" cy="6" fill="currentColor" r="3.5" />
        </svg>
      </div>
    </section>
  )
}
