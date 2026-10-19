import React from 'react'
import type { BackupItem } from '../types'

interface RestoreConfirmationModalProps {
  item: BackupItem | null
  onClose: () => void
  onConfirm: () => void
}

export const RestoreConfirmationModal: React.FC<RestoreConfirmationModalProps> = ({
  item,
  onClose,
  onConfirm
}) => {
  if (!item) return null

  return (
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
            {item.date} ({item.time})
          </strong>
          .
        </p>
        <div className="flex items-center justify-end gap-space-sm pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md"
            type="button"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-error text-on-error hover:bg-on-error-container font-label-md text-label-md font-bold shadow-xs"
            type="button"
          >
            متابعة الاستعادة الآن
          </button>
        </div>
      </div>
    </div>
  )
}
