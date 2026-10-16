interface GateHeaderStatusProps {
  completedPickups?: number
  remainingPickups?: number
}

export function GateHeaderStatus({
  completedPickups = 35,
  remainingPickups = 13
}: GateHeaderStatusProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xs select-none">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
          <span>الرئيسية</span>
          <span className="text-outline-variant">/</span>
          <span>الحضور والانصراف</span>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-semibold">بوابة الاستقبال والاستلام الآمن</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
          بوابة الاستلام الآمن والتحقق بالباركود (Gate Secure Pickup)
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          تحقق فوري من هوية المستلم والمخوّلين عبر مسح بطاقة الطفل دون إنترنت (Offline-First)
        </p>
      </div>

      {/* Live Status Indicators */}
      <div className="flex flex-wrap items-center gap-space-xs">
        <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="material-symbols-outlined text-base text-primary">barcode_reader</span>
          <span>قارئ USB: متصل (HID)</span>
        </div>

        <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="material-symbols-outlined text-base text-primary">videocam</span>
          <span>كاميرا البوابة: نشطة HD</span>
        </div>

        <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-base">schedule</span>
          <span>دوام مسائي: انصراف (15:30 - 17:00)</span>
        </div>

        <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
          <span className="material-symbols-outlined text-base">how_to_reg</span>
          <span>
            تسليم {completedPickups} طفلاً • متبقي {remainingPickups} طفلاً
          </span>
        </div>
      </div>
    </div>
  )
}
