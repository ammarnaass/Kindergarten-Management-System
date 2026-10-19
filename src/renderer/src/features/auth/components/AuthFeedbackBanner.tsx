import React from 'react'
import type { AuthStationFeedback } from '../types'

interface AuthFeedbackBannerProps {
  feedback: AuthStationFeedback | null
}

export const AuthFeedbackBanner: React.FC<AuthFeedbackBannerProps> = ({ feedback }) => {
  if (!feedback) return null

  return (
    <div
      className={`p-3 rounded-xl font-medium text-label-md flex items-center gap-2.5 transition-all animate-in fade-in mt-4 ${
        feedback.type === 'error'
          ? 'bg-error-container text-on-error-container'
          : feedback.type === 'success'
          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30'
          : 'bg-primary-container text-on-primary-container'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {feedback.type === 'error' ? 'error' : feedback.type === 'success' ? 'check_circle' : 'info'}
      </span>
      <span>{feedback.message}</span>
    </div>
  )
}
