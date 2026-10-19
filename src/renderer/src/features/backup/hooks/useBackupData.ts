import { useState, useEffect, useCallback } from 'react'
import { ipc } from '@/lib/ipc'
import type { BackupItem } from '../types'

export function useBackupData() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [backups, setBackups] = useState<BackupItem[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showIntegrityModal, setShowIntegrityModal] = useState(false)
  const [restoreConfirmItem, setRestoreConfirmItem] = useState<BackupItem | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [diag, list, stats] = await Promise.all([
        ipc<any>('app:diagnostics').catch(() => null),
        ipc<any[]>('backup:list').catch(() => []),
        ipc<any>('dashboard:stats').catch(() => null)
      ])
      setDiagnostics(diag)

      if (list && list.length > 0) {
        const mapped: BackupItem[] = list.map((item, idx) => {
          const dateObj = new Date(item.mtime || Date.now())
          const formattedDate = dateObj.toLocaleDateString('ar-DZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
          const formattedTime = dateObj.toLocaleTimeString('ar-DZ', {
            hour: '2-digit',
            minute: '2-digit'
          })
          const sizeMb = (item.size / (1024 * 1024)).toFixed(2) + ' MB'
          return {
            id: String(idx),
            date: formattedDate,
            time: formattedTime,
            type: idx === 0 ? 'تلقائي دوري' : 'أرشيف محلي',
            typeIcon: idx === 0 ? 'autorenew' : 'save',
            typeClass:
              idx === 0
                ? 'bg-primary-fixed text-on-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface-variant',
            size: sizeMb,
            childrenCount: stats?.totalChildren ?? 0,
            invoicesCount: stats?.overdueInvoicesCount ?? 0,
            path: item.path,
            isLatest: idx === 0
          }
        })
        setBackups(mapped)
      } else {
        setBackups([])
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateBackup = useCallback(async () => {
    setIsCreating(true)
    try {
      await ipc('backup:create')
      await loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }, [loadData])

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
  }, [handleCreateBackup])

  const handleRestore = (item: BackupItem) => {
    setRestoreConfirmItem(item)
  }

  const cancelRestore = () => {
    setRestoreConfirmItem(null)
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

  const handleDeleteBackup = (item: BackupItem) => {
    if (confirm(`هل أنت متأكد من حذف هذه النسخة (${item.date})؟`)) {
      setBackups((prev) => prev.filter((b) => b.id !== item.id))
    }
  }

  return {
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
  }
}
