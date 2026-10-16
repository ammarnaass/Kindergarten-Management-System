import { ScannerSettings } from '../types'
import { ScannerConfigCard } from './ScannerConfigCard'
import { ScannerLiveTestCard } from './ScannerLiveTestCard'

interface BarcodeScannerTabProps {
  settings: ScannerSettings
  scannedCodeFeedback: string | null
  onChange: (fields: Partial<ScannerSettings>) => void
  onScanCode: (code: string) => void
  onRescanPorts?: () => void
}

export function BarcodeScannerTab({
  settings,
  scannedCodeFeedback,
  onChange,
  onScanCode,
  onRescanPorts
}: BarcodeScannerTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full">
      <ScannerConfigCard
        settings={settings}
        onChange={onChange}
        onRescanPorts={onRescanPorts}
      />
      <ScannerLiveTestCard
        scannedCodeFeedback={scannedCodeFeedback}
        onScanCode={onScanCode}
      />
    </div>
  )
}
