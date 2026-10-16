import { PrinterSettings } from '../types'
import { ThermalPrinterCard } from './ThermalPrinterCard'
import { DocumentPrinterCard } from './DocumentPrinterCard'
import { PvcCardPrinterCard } from './PvcCardPrinterCard'

interface HardwarePrintersTabProps {
  settings: PrinterSettings
  onChange: (fields: Partial<PrinterSettings>) => void
  onTestPrint: (printerName: string) => void
}

export function HardwarePrintersTab({
  settings,
  onChange,
  onTestPrint
}: HardwarePrintersTabProps) {
  return (
    <div className="flex flex-col gap-space-lg w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg w-full">
        <ThermalPrinterCard
          settings={settings}
          onChange={onChange}
          onTestPrint={onTestPrint}
        />
        <DocumentPrinterCard
          settings={settings}
          onChange={onChange}
          onTestPrint={onTestPrint}
        />
      </div>

      <PvcCardPrinterCard
        settings={settings}
        onChange={onChange}
        onTestPrint={onTestPrint}
      />
    </div>
  )
}
