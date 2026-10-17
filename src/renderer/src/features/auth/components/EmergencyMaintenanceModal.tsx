import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { IntegrityCheckResult } from '@/lib/api/types'

interface EmergencyMaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EmergencyMaintenanceModal: React.FC<EmergencyMaintenanceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IntegrityCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runCheck = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.system.integrityCheck()
      setResult(res)
    } catch (err: any) {
      setError(err.message || 'فشل فحص سلامة قاعدة البيانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      runCheck()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-outline-variant/40 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5 text-tertiary">
            <span className="material-symbols-outlined text-[26px]">build_circle</span>
            <h3 className="font-bold text-headline-sm text-on-surface">
              وضع الطوارئ والصيانة وفحص SQLite
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-body-sm text-on-surface-variant">
          يقوم هذا الإجراء بتشغيل أمر الفحص الشامل لسلامة جداول ومؤشرات قاعدة البيانات المحلية دون اتصال بأي خادم سحابي.
        </p>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
              progress_activity
            </span>
            <span className="text-body-sm font-semibold">
              جاري فحص سلامة الملف المحلي: PRAGMA integrity_check...
            </span>
          </div>
        ) : error ? (
          <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]">error</span>
            <span className="text-body-sm font-semibold">{error}</span>
          </div>
        ) : result ? (
          <div className="space-y-3 font-mono text-[12px]">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
              <span className="text-on-surface-variant">حالة الفحص الشامل:</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{result.ok ? 'قاعدة البيانات سليمة 100% (ok)' : result.result}</span>
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
              <span className="text-on-surface-variant">نمط اليومية المتزامن:</span>
              <span className="font-bold text-primary">{result.journalMode} (Write-Ahead Log)</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
              <span className="text-on-surface-variant">مستوى التشفير المحلي:</span>
              <span className="font-bold text-secondary">{result.encryption}</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col gap-1">
              <span className="text-on-surface-variant text-[11px]">مسار ملف قاعدة البيانات:</span>
              <span className="text-on-surface text-[11px] break-all select-all font-mono">
                {result.dbPath}
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={runCheck}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>إعادة الفحص الآن</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-xs"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  )
}
