import { DatabaseSettings } from '../types'
import { SqliteWalHealthCard } from './SqliteWalHealthCard'
import { UsbAutoBackupCard } from './UsbAutoBackupCard'

interface DatabaseMaintenanceTabProps {
  settings: DatabaseSettings
  onChange: (fields: Partial<DatabaseSettings>) => void
  onOptimize: () => void
  onBackupNow: () => void
  onOpenDbFolder?: () => void
  onChooseBackupPath?: () => void
}

export function DatabaseMaintenanceTab({
  settings,
  onChange,
  onOptimize,
  onBackupNow,
  onOpenDbFolder,
  onChooseBackupPath
}: DatabaseMaintenanceTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full">
      <SqliteWalHealthCard
        settings={settings}
        onChange={onChange}
        onOptimize={onOptimize}
        onOpenFolder={onOpenDbFolder}
      />
      <UsbAutoBackupCard
        settings={settings}
        onChange={onChange}
        onBackupNow={onBackupNow}
        onChooseBackupPath={onChooseBackupPath}
      />
    </div>
  )
}
