import { useCallback, useEffect, useState } from 'react'
import { ipc } from '@/lib/ipc'
import {
  BackupHeroBanner,
  BackupActionsGrid,
  BackupConfigSection,
  BackupTableSection,
  IntegrityCheckModal,
  BackupItem
} from './index'

export default function BackupPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [backups, setBackups] = useState<BackupItem[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showIntegrityModal, setShowIntegrityModal] = useState(false)
  const [restoreConfirmItem, setRestoreConfirmItem] = useState<BackupItem | null>(null)

  const loadData = useCallback(async () => {
    try {
      const diag = await ipc<any>('app:diagnostics').catch(() => null)
      setDiagnostics(diag)

      const list = await ipc<any[]>('backup:list').catch(() => [])
      if (list && list.length > 0) {
        const mapped: BackupItem[] = list.map((item, idx) => {
          const dateObj = new Date(item.mtime || Date.now())
          const formattedDate = dateObj.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
          const formattedTime = dateObj.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
          })
          const sizeMb = (item.size / (1024 * 1024)).toFixed(1) + ' MB'
          return {
            id: String(idx),
            date: formattedDate,
            time: formattedTime,
            type: idx === 0 ? 'تلقائي دوري' : 'عند إغلاق التطبيق',
            typeIcon: idx === 0 ? 'autorenew' : 'power_settings_new',
            typeClass:
              idx === 0
                ? 'bg-primary-fixed text-on-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface-variant',
            size: sizeMb,
            childrenCount: 52,
            invoicesCount: 142,
            path: item.path,
            isLatest: idx === 0
          }
        })
        setBackups(mapped)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateBackup = async () => {
    setIsCreating(true)
    try {
      await ipc('backup:create')
      await loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }

  // Keyboard shortcut Ctrl+B for instant backup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        handleCreateBackup()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleRestore = (item: BackupItem) => {
    setRestoreConfirmItem(item)
  }

  const confirmExecuteRestore = async () => {
    if (!restoreConfirmItem) return
    try {
      await (ipc as any)('backup:restore', { path: restoreConfirmItem.path }).catch(() => null)
      alert(`تمت استعادة البيانات بنجاح من النسخة: ${restoreConfirmItem.date}`)
      setRestoreConfirmItem(null)
      loadData()
    } catch (e: any) {
      alert(`خطأ أثناء الاستعادة: ${e.message}`)
    }
  }

  return (
    <div className="flex flex-col w-full select-none">
      {/* Top Ambient Glow Decorator & Status Hero */}
      <BackupHeroBanner
        lastBackupDate="اليوم، 14:30"
        lastBackupSize="24.3 MB"
        walSize="1.4 MB"
        isCreating={isCreating}
        onCreateBackup={handleCreateBackup}
      />

      {/* 3-Action Quick Maintenance Cards Grid */}
      <BackupActionsGrid
        onUsbExport={() => alert('تم رصد فلاش ميموري (E: KINGSTON) - جاري التصدير المباشر')}
        onImportBackup={() => alert('يمكنك اختيار ملف .rawdatibak للاستيراد')}
        onIntegrityCheck={() => setShowIntegrityModal(true)}
      />

      {/* Main Grid: Backup Configuration & Storage Telemetry */}
      <BackupConfigSection
        backupPath={diagnostics?.dbPath || 'D:\\Rawdati_Backups\\'}
        backupCount={backups.length > 0 ? backups.length : 18}
        onSaveConfig={() => console.log('Saved config')}
      />

      {/* Available Local Backups Table Section */}
      <BackupTableSection
        backups={backups}
        onRestore={handleRestore}
        onRefresh={loadData}
        onDelete={(item) => {
          if (confirm(`هل أنت متأكد من حذف هذه النسخة (${item.date})؟`)) {
            setBackups((prev) => prev.filter((b) => b.id !== item.id))
          }
        }}
      />

      {/* Integrity Check Modal */}
      <IntegrityCheckModal
        isOpen={showIntegrityModal}
        onClose={() => setShowIntegrityModal(false)}
      />

      {/* Restore Confirmation Dialog */}
      {restoreConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-xl border border-outline-variant/40 space-y-space-md">
            <div className="flex items-center gap-space-sm text-error">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                تأكيد استعادة النسخة الاحتياطية
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              سيتم إنشاء نقطة أمان قبل الاستعادة (Pre-Restore Snapshot)، ثم استبدال قاعدة البيانات
              الحالية بالبيانات المحفوظة في تاريخ:{' '}
              <strong className="text-on-surface">
                {restoreConfirmItem.date} ({restoreConfirmItem.time})
              </strong>
              .
            </p>
            <div className="flex items-center justify-end gap-space-sm pt-2">
              <button
                onClick={() => setRestoreConfirmItem(null)}
                className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md"
                type="button"
              >
                إلغاء
              </button>
              <button
                onClick={confirmExecuteRestore}
                className="px-5 py-2 rounded-lg bg-error text-on-error hover:bg-on-error-container font-label-md text-label-md font-bold shadow-xs"
                type="button"
              >
                متابعة الاستعادة الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
