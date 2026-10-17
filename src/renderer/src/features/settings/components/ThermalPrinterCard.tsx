import { PrinterSettings, SystemPrinter } from '../types'

interface ThermalPrinterCardProps {
  settings: PrinterSettings
  printersList?: SystemPrinter[]
  onChange: (fields: Partial<PrinterSettings>) => void
  onTestPrint: (printerName: string) => void
}

export function ThermalPrinterCard({
  settings,
  printersList = [],
  onChange,
  onTestPrint
}: ThermalPrinterCardProps) {
  const hasPrinters = printersList.length > 0

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                طابعة الإيصالات الحرارية السريعة (POS 80mm)
              </h3>
              <span className="font-caption text-caption text-outline">
                تُستخدم لإيصالات استلام وتسليم الأطفال وسندات القبض الفورية
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {settings.thermalPrinter ? 'طابعة مخصصة' : 'غير محددة'}
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          <label className="font-label-md text-label-md font-semibold text-on-surface">
            اختر طابعة الإيصالات من أجهزة النظام (USB / Network / COM)
          </label>
          <select
            value={settings.thermalPrinter}
            onChange={(e) => onChange({ thermalPrinter: e.target.value })}
            className="w-full px-3 py-2.5 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-transparent focus:border-primary/20"
          >
            <option value="">-- اختر طابعة إيصالات --</option>
            {hasPrinters ? (
              printersList.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.displayName || p.name} {p.isDefault ? '• (الافتراضية)' : ''}
                </option>
              ))
            ) : (
              <option value="Generic POS 80mm">طابعة حرارية افتراضية (Generic 80mm ESC/POS)</option>
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-surface-variant/30">
          <div>
            <span className="font-caption text-caption text-on-surface-variant">
              معدل الباود (Baud Rate)
            </span>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              {settings.thermalBaudRate}
            </div>
          </div>
          <div>
            <span className="font-caption text-caption text-on-surface-variant">
              عرض الورق الافتراضي
            </span>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              {settings.thermalPaperWidth}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoPrintAtGate}
              onChange={(e) => onChange({ autoPrintAtGate: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              طباعة إيصال استلام فوري تلقائياً عند مسح باركود الطفل عند البوابة
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoCutter}
              onChange={(e) => onChange({ autoCutter: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              قص الورق التلقائي (Auto Cutter) بعد كل عملية سداد أو انصراف
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.cashDrawerKick}
              onChange={(e) => onChange({ cashDrawerKick: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              فتح درج النقدية الإلكتروني الملحق (Cash Drawer Kick-pulse)
            </span>
          </label>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <button
          type="button"
          onClick={() => onTestPrint(settings.thermalPrinter || 'طابعة الإيصالات')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">print_connect</span>
          <span>طباعة إيصال اختباري (Test Slip)</span>
        </button>
        <span className="font-caption text-caption text-outline">
          {settings.thermalPrinter ? `المحددة: ${settings.thermalPrinter}` : 'جاهز للتهيئة'}
        </span>
      </div>
    </div>
  )
}
