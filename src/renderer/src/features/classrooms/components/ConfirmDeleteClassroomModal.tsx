import React from 'react'

interface ConfirmDeleteClassroomModalProps {
  isOpen: boolean
  classroomName: string
  classroomId?: string
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export const ConfirmDeleteClassroomModal: React.FC<ConfirmDeleteClassroomModalProps> = ({
  isOpen,
  classroomName,
  isDeleting = false,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
        <div className="p-6">
          <div className="w-14 h-14 rounded-2xl bg-error-container/40 text-error flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">meeting_room</span>
          </div>

          <h3 className="text-headline-sm font-bold text-on-surface mb-2">
            تأكيد حذف الفصل الدراسي
          </h3>

          <p className="text-body-sm text-on-surface-variant leading-relaxed mb-4">
            هل أنتِ متأكدة من رغبتك في حذف فصل{' '}
            <strong className="text-on-surface font-semibold">«{classroomName}»</strong>؟
          </p>

          <div className="p-3 bg-error-container/20 rounded-xl border border-error/20 flex items-start gap-2.5 text-caption text-error mb-6">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">warning</span>
            <span>
              سيتم فك ارتباط أي أطفال مسكنين بهذا الفصل تلقائياً ليصبحوا غير مسكنين في قاعات، مع إزالة تعيين المعلمة المشرفة.
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
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              )}
              <span>{isDeleting ? 'جاري الحذف...' : 'نعم، حذف الفصل'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
