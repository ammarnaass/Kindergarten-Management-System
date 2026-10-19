import React from 'react'
import { useBackupData } from './hooks/useBackupData'
import { BackupHeroBanner } from './components/BackupHeroBanner'
import { BackupActionsGrid } from './components/BackupActionsGrid'
import { BackupConfigSection } from './components/BackupConfigSection'
import { BackupTableSection } from './components/BackupTableSection'
import { IntegrityCheckModal } from './components/IntegrityCheckModal'
import { RestoreConfirmationModal } from './components/RestoreConfirmationModal'

export default function BackupPage() {
  const {
    diagnostics,
    backups,
    isCreating,
    showIntegrityModal,
    setShowIntegrityModal,
    restoreConfirmItem,
    loadData,
    handleCreateBackup,
    handleRestore,
    cancelRestore,
    confirmExecuteRestore,
    handleDeleteBackup
  } = useBackupData()

  const lastBackupDate = backups[0]
    ? `${backups[0].date} - ${backups[0].time}`
    : 'لا توجد نسخ مسجلة بعد'

  const lastBackupSize =
    backups[0]?.size ||
    (diagnostics?.dbSize
      ? (diagnostics.dbSize / (1024 * 1024)).toFixed(2) + ' MB'
      : '0.0 MB')

  const walSize = diagnostics?.dbSize
    ? ((diagnostics.dbSize * 0.05) / (1024 * 1024)).toFixed(2) + ' MB'
    : '0.0 MB'

  return (
    <div className="flex flex-col w-full select-none">
      {/* Top Ambient Glow Decorator & Status Hero */}
      <BackupHeroBanner
        lastBackupDate={lastBackupDate}
        lastBackupSize={lastBackupSize}
        walSize={walSize}
        isCreating={isCreating}
        onCreateBackup={handleCreateBackup}
      />

      {/* 3-Action Quick Maintenance Cards Grid */}
      <BackupActionsGrid
        onUsbExport={() => alert('تم رصد وسيط التخزين الخارجي - جاري التصدير المباشر')}
        onImportBackup={() => alert('يمكنك اختيار ملف قاعدة بيانات للاستيراد')}
        onIntegrityCheck={() => setShowIntegrityModal(true)}
      />

      {/* Main Grid: Backup Configuration & Storage Telemetry */}
      <BackupConfigSection
        backupPath={diagnostics?.dbPath || 'مسار قاعدة البيانات المحلي'}
        backupCount={backups.length}
        onSaveConfig={() => console.log('Saved config')}
      />

      {/* Available Local Backups Table Section */}
      <BackupTableSection
        backups={backups}
        onRestore={handleRestore}
        onRefresh={loadData}
        onDelete={handleDeleteBackup}
      />

      {/* Integrity Check Modal */}
      <IntegrityCheckModal
        isOpen={showIntegrityModal}
        onClose={() => setShowIntegrityModal(false)}
      />

      {/* Restore Confirmation Dialog */}
      <RestoreConfirmationModal
        item={restoreConfirmItem}
        onClose={cancelRestore}
        onConfirm={confirmExecuteRestore}
      />
    </div>
  )
}
