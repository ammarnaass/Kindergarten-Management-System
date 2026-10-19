import React from 'react'
import type { LocalUserSummary } from '../types'

interface AuthSelectedUserBannerProps {
  user: LocalUserSummary
  onResetFields: () => void
}

export const AuthSelectedUserBanner: React.FC<AuthSelectedUserBannerProps> = ({
  user,
  onResetFields
}) => {
  return (
    <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl mb-6 border border-outline-variant/30">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-13 h-13 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs p-2.5">
          <span className="material-symbols-outlined text-[28px]">
            {user.avatarIcon || 'person'}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-headline-sm text-on-surface truncate">
              {user.displayName}
            </h2>
            <span className="bg-primary text-on-primary font-caption text-[11px] px-2 py-0.5 rounded-full font-bold">
              {user.role === 'admin'
                ? 'مدير النظام'
                : user.role === 'educator'
                ? 'معلمة صف'
                : user.role === 'accountant'
                ? 'محاسب مالي'
                : 'كادر الروضة'}
            </span>
          </div>
          <span className="text-body-sm text-on-surface-variant truncate mt-0.5">
            {user.roleTitle || user.username}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onResetFields}
        title="إعادة تعيين الحقول"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">refresh</span>
      </button>
    </div>
  )
}
