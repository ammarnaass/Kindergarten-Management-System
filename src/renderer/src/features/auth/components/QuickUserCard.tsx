import React from 'react'
import type { LocalUserSummary } from '@/lib/api/types'

interface QuickUserCardProps {
  user: LocalUserSummary
  isSelected: boolean
  onSelect: (user: LocalUserSummary) => void
}

const ROLE_CONFIG: Record<string, { label: string; badgeClass: string; icon: string; avatarBg: string }> = {
  admin: {
    label: 'مدير النظام',
    badgeClass: 'bg-primary text-on-primary',
    icon: 'shield_person',
    avatarBg: 'bg-primary text-on-primary'
  },
  educator: {
    label: 'معلمة صف',
    badgeClass: 'bg-secondary-container text-on-secondary-container',
    icon: 'school',
    avatarBg: 'bg-secondary text-on-secondary'
  },
  staff: {
    label: 'استقبال وبوابة',
    badgeClass: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'badge',
    avatarBg: 'bg-tertiary text-on-tertiary'
  },
  accountant: {
    label: 'شؤون مالية',
    badgeClass: 'bg-surface-container-highest text-on-surface',
    icon: 'payments',
    avatarBg: 'bg-surface-dim text-on-surface'
  }
}

export const QuickUserCard: React.FC<QuickUserCardProps> = ({
  user,
  isSelected,
  onSelect
}) => {
  const config = ROLE_CONFIG[user.role] || {
    label: 'مستخدم محلي',
    badgeClass: 'bg-surface-container text-on-surface-variant',
    icon: user.avatarIcon || 'person',
    avatarBg: 'bg-primary text-on-primary'
  }

  const iconName = user.avatarIcon || config.icon

  return (
    <div
      onClick={() => onSelect(user)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(user)
        }
      }}
      className={`group cursor-pointer p-3 rounded-xl transition-all duration-150 flex items-center justify-between border ${
        isSelected
          ? 'bg-surface-container-high border-primary/40 shadow-sm'
          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-11 h-11 rounded-full ${config.avatarBg} flex items-center justify-center font-bold text-sm shadow-xs relative shrink-0`}>
          <span className="material-symbols-outlined text-[22px]">{iconName}</span>
          {isSelected && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-label-lg text-on-surface truncate">
              {user.displayName}
            </span>
            <span className={`font-caption text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${config.badgeClass}`}>
              {config.label}
            </span>
          </div>

          <span className="text-caption text-on-surface-variant truncate mt-0.5">
            {user.roleTitle || (user.hasPin ? 'محمي برمز PIN السريع' : 'كلمة المرور المحلية')}
          </span>
        </div>
      </div>

      <div className="shrink-0 mr-2">
        {isSelected ? (
          <span className="material-symbols-outlined text-primary text-[22px] transition-transform scale-110">
            check_circle
          </span>
        ) : (
          <span className="material-symbols-outlined text-outline-variant/60 group-hover:text-outline-variant text-[20px]">
            radio_button_unchecked
          </span>
        )}
      </div>
    </div>
  )
}
