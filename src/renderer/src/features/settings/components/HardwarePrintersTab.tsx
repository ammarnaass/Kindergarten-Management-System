import { PrinterSettings, SystemPrinter } from '../types'
import { ThermalPrinterCard } from './ThermalPrinterCard'
import { DocumentPrinterCard } from './DocumentPrinterCard'
import { PvcCardPrinterCard } from './PvcCardPrinterCard'

interface HardwarePrintersTabProps {
  settings: PrinterSettings
  printersList?: SystemPrinter[]
  onChange: (fields: Partial<PrinterSettings>) => void
  onTestPrint: (printerName: string) => void
  onRefreshPrinters?: () => void
}

export function HardwarePrintersTab({
  settings,
  printersList = [],
  onChange,
  onTestPrint,
  onRefreshPrinters
}: HardwarePrintersTabProps) {
  return (
    <div className="flex flex-col gap-space-lg w-full">
      {onRefreshPrinters && (
        <div className="flex items-center justify-between bg-surface-container-low px-space-md py-2.5 rounded-xl border border-surface-variant/30">
          <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">devices</span>
            <span>
              تم الكشف عن <strong>{printersList.length}</strong> طابعة مثبتة في نظام التشغيل
            </span>
          </div>
          <button
            type="button"
            onClick={onRefreshPrinters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-variant text-primary font-label-sm text-label-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>تحديث قائمة الطابعات</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg w-full">
        <ThermalPrinterCard
          settings={settings}
          printersList={printersList}
          onChange={onChange}
          onTestPrint={onTestPrint}
        />
        <DocumentPrinterCard
          settings={settings}
          printersList={printersList}
          onChange={onChange}
          onTestPrint={onTestPrint}
        />
      </div>

      <PvcCardPrinterCard
        settings={settings}
        printersList={printersList}
        onChange={onChange}
        onTestPrint={onTestPrint}
      />
    </div>
  )
}
