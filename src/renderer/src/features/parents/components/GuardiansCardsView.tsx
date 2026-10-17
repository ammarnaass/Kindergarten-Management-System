import React from 'react'
import type { GuardianItem } from '../types'

interface GuardiansCardsViewProps {
  guardians: GuardianItem[]
  selectedGuardianId: string | null
  onSelectGuardian: (id: string) => void
  onOpenPickupCard: (guardian: GuardianItem) => void
}

export const GuardiansCardsView: React.FC<GuardiansCardsViewProps> = ({
  guardians,
  selectedGuardianId,
  onSelectGuardian,
  onOpenPickupCard
}) => {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}.${last.charAt(0)}`
  }

  return (
    <div className="p-space-md grid grid-cols-1 sm:grid-cols-2 gap-space-md">
      {guardians.map((g) => {
        const isSelected = g.id === selectedGuardianId
        const primaryChild = g.children[0]
        const canPickup = g.children.every((c) => c.canPickup)

        return (
          <div
            key={g.id}
            onClick={() => onSelectGuardian(g.id)}
            className={`p-space-md rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-xs'
                : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shadow-xs">
                  {getInitials(g.firstName, g.lastName)}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-label-lg">
                    {g.firstName} {g.lastName}
                  </h4>
                  <span className="text-caption text-on-surface-variant font-mono">
                    {g.nationalId || '---'}
                  </span>
                </div>
              </div>
              {canPickup ? (
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-semibold">
                  مصرح
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[11px] font-semibold">
                  محظور
                </span>
              )}
            </div>

            <div className="space-y-1 text-body-sm text-on-surface">
              <div className="flex items-center justify-between text-caption text-on-surface-variant">
                <span>القرابة:</span>
                <span className="font-medium text-on-surface">{primaryChild?.relation || 'ولي أمر'}</span>
              </div>
              <div className="flex items-center justify-between text-caption text-on-surface-variant">
                <span>الجوال:</span>
                <span className="font-mono text-on-surface dir-ltr">{g.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-caption text-primary flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">child_care</span>
                {primaryChild?.childName || 'طالب مسجل'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectGuardian(g.id)
                  onOpenPickupCard(g)
                }}
                className="text-secondary hover:text-on-secondary-container p-1 rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
