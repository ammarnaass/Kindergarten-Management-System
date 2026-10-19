import React from 'react'
import type { StaffMember } from '../../../lib/api/types'

interface ConfirmDeleteStaffModalProps {
  isOpen: boolean
  staffMember: StaffMember | null
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export const ConfirmDeleteStaffModal: React.FC<ConfirmDeleteStaffModalProps> = ({
  isOpen,
  staffMember,
  isDeleting = false,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !staffMember) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
        <div className="p-6">
          <div className="w-14 h-14 rounded-2xl bg-error-container/40 text-error flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">delete_forever</span>
          </div>

          <h3 className="text-headline-sm font-bold text-on-surface mb-2">
            تأكيد حذف الموظف
          </h3>

          <p className="text-body-sm text-on-surface-variant leading-relaxed mb-4">
            هل أنت متأكد من رغبتك في حذف بيانات الموظف{' '}
            <strong className="text-on-surface font-semibold">
              «{staffMember.firstName} {staffMember.lastName}»
            </strong>{' '}
            ({staffMember.role}) نهائياً من كادر الروضة؟
          </p>

          <div className="p-3 bg-error-container/20 rounded-xl border border-error/20 flex items-start gap-2.5 text-caption text-error mb-6">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">warning</span>
            <span>
              سيتم إزالة ارتباط الموظف بأي فصول دراسية، وسجلات الحضور والإجازات المرتبطة به.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/30">
            <button
              onClick={onClose}
              disabled={isDeleting}
              type="button"
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-semibold hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              إلغاء الأمر
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              type="button"
              className="px-5 py-2 rounded-xl bg-error text-on-error font-label-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
            >
              {isDeleting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
