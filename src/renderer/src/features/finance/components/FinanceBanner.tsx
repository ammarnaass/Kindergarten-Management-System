interface FinanceBannerProps {
  printerName?: string
  printerOnline?: boolean
  activeTab: 'pos' | 'ledger'
  onTabChange: (tab: 'pos' | 'ledger') => void
  onViewHistory?: () => void
  onOpenBulkBilling?: () => void
}

export function FinanceBanner({
  printerName = 'Epson TM-T88VI (USB001)',
  printerOnline = true,
  activeTab,
  onTabChange,
  onViewHistory,
  onOpenBulkBilling
}: FinanceBannerProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low px-space-lg py-space-sm rounded-2xl shadow-sm border border-outline-variant/50 select-none">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-2xl">
            {activeTab === 'pos' ? 'point_of_sale' : 'receipt_long'}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {activeTab === 'pos' ? 'صندوق الاستقبال وتسجيل المقبوضات' : 'دفتر الفواتير والمطالبات المالية'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold">
              {activeTab === 'pos' ? 'مباشر • POS Desk' : 'سجل المطالبات'}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {activeTab === 'pos'
              ? 'تسجيل فوري، تحويل العملة بالحروف، ومعاينة حية للإيصال قبل الطباعة'
              : 'متابعة الاستحقاقات، الفواتير المتأخرة، وتوليد الاشتراكات الشهرية لجميع الأطفال'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* مبدّل التبويبات */}
        <div className="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/60">
          <button
            type="button"
            onClick={() => onTabChange('pos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pos'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">point_of_sale</span>
            <span>نقطة القبض (POS)</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('ledger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ledger'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">receipt_long</span>
            <span>دفتر الفواتير</span>
          </button>
        </div>

        {activeTab === 'ledger' && onOpenBulkBilling && (
          <button
            type="button"
            onClick={onOpenBulkBilling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold shadow-xs hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-base">auto_mode</span>
            <span>توليد اشتراكات شهرية</span>
          </button>
        )}

        {activeTab === 'pos' && (
          <div className="hidden lg:flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-2xs border border-outline-variant/50">
            <span className="material-symbols-outlined text-base text-secondary">print</span>
            <span className="font-mono text-label-sm text-on-surface font-semibold">{printerName}</span>
            {printerOnline && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
        )}

        <button
          onClick={onViewHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-md text-xs font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-base">history</span>
          <span>إيصالات اليوم</span>
        </button>
      </div>
    </div>
  )
}
