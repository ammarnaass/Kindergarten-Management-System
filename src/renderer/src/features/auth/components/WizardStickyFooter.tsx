import React from 'react'

interface WizardStickyFooterProps {
  loading: boolean
  isFormValid: boolean
  onOpenEmergency: () => void
  onCancel: () => void
}

export const WizardStickyFooter: React.FC<WizardStickyFooterProps> = ({
  loading,
  isFormValid,
  onOpenEmergency,
  onCancel
}) => {
  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
      <button
        type="button"
        onClick={onOpenEmergency}
        className="w-full md:w-auto px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-label-md flex items-center justify-center gap-2 transition-colors border border-outline-variant/20"
      >
        <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
        <span>استعادة نسخة احتياطية سابقة (F12)</span>
      </button>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          type="button"
          onClick={onCancel}
          className="w-full md:w-auto px-5 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-xl font-semibold text-label-md transition-colors"
        >
          العودة لمحطة الدخول
        </button>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full md:w-auto px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-label-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
          )}
          <span>حفظ واعتماد حساب المسؤول الأعلى والمتابعة</span>
        </button>
      </div>
    </div>
  )
}
