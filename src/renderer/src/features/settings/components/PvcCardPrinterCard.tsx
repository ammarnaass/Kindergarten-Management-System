import { PrinterSettings } from '../types'

interface PvcCardPrinterCardProps {
  settings: PrinterSettings
  onChange: (fields: Partial<PrinterSettings>) => void
  onTestPrint: (printerName: string) => void
}

export function PvcCardPrinterCard({
  settings,
  onChange,
  onTestPrint
}: PvcCardPrinterCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                طابعة بطاقات الطلاب الذكية (PVC / RFID)
              </h3>
              <span className="font-caption text-caption text-outline">
                تُستخدم لطباعة وتشفير بطاقات الهوية البلاستيكية وبطاقات الاستلام الآمن
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            متصلة (USB)
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          <label className="font-label-md text-label-md font-semibold text-on-surface">
            اختر طابعة البطاقات البلاستيكية المعتمدة
          </label>
          <select
            value={settings.pvcCardPrinter}
            onChange={(e) => onChange({ pvcCardPrinter: e.target.value })}
            className="w-full px-3 py-2.5 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-transparent focus:border-primary/20"
          >
            <option>Zebra ZC300 Dual-Sided ID Card Printer (USB)</option>
            <option>Fargo DTC1250e Plastic Card Printer (USB)</option>
            <option>Evolis Primacy 2 Dual-Sided PVC</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-surface-variant/30">
          <div>
            <span className="font-caption text-caption text-on-surface-variant">نوع البطاقات المدعومة</span>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              PVC CR-80 (85.6 × 54 mm)
            </div>
          </div>
          <div>
            <span className="font-caption text-caption text-on-surface-variant">ترميز الشريحة الذكية</span>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              Mifare Classic 1K / NFC
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pvcCardDualSided}
              onChange={(e) => onChange({ pvcCardDualSided: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              طباعة بطاقة الطالب والباركود الذكي على الوجهين تلقائياً (Dual-sided PVC)
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pvcSmartChipEncoding}
              onChange={(e) => onChange({ pvcSmartChipEncoding: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              تشفير وكتابة رقم هوية الطفل على شريحة الـ RFID/NFC المدمجة
            </span>
          </label>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <button
          type="button"
          onClick={() => onTestPrint('بطاقات PVC الذكية (Zebra)')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">credit_card</span>
          <span>طباعة بطاقة تجريبية (Sample PVC Badge)</span>
        </button>
        <span className="font-caption text-caption text-outline">مخزون البطاقات: 84 بطاقة</span>
      </div>
    </div>
  )
}
