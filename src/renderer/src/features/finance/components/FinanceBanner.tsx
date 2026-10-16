interface FinanceBannerProps {
  printerName?: string
  printerOnline?: boolean
  onViewHistory?: () => void
}

export function FinanceBanner({
  printerName = 'Epson TM-T88VI (USB001)',
  printerOnline = true,
  onViewHistory
}: FinanceBannerProps) {
  return (
    <div className="flex items-center justify-between bg-surface-container-low px-space-lg py-space-sm rounded-xl shadow-sm select-none">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-2xl">point_of_sale</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              صندوق الاستقبال وتسجيل المقبوضات النقدية
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold">
              مباشر • POS Desk
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            تسجيل فوري، تحويل العملة بالحروف، ومعاينة حية للإيصال قبل الإرسال للطابعة المحلية
          </p>
        </div>
      </div>

      <div className="flex items-center gap-space-sm">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-xs">
          <span className="material-symbols-outlined text-base text-secondary">print</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">الطابعة المتصلة:</span>
          <span className="font-mono text-label-sm text-on-surface font-semibold">{printerName}</span>
          {printerOnline && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
        </div>

        <button
          onClick={onViewHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-base">history</span>
          <span>سجل إيصالات اليوم</span>
        </button>
      </div>
    </div>
  )
}
