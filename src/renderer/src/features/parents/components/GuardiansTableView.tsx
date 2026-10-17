import React from 'react'
import type { GuardianItem } from '../types'

interface GuardiansTableViewProps {
  guardians: GuardianItem[]
  selectedGuardianId: string | null
  onSelectGuardian: (id: string) => void
  onQuickDispatch: (text: string) => void
  onOpenPickupCard: (guardian: GuardianItem) => void
}

export const GuardiansTableView: React.FC<GuardiansTableViewProps> = ({
  guardians,
  selectedGuardianId,
  onSelectGuardian,
  onQuickDispatch,
  onOpenPickupCard
}) => {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}.${last.charAt(0)}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md select-none border-b border-outline-variant/10">
            <th className="py-3 px-space-md font-semibold">ولي الأمر / المستلم</th>
            <th className="py-3 px-space-sm font-semibold">صلة القرابة</th>
            <th className="py-3 px-space-sm font-semibold">الطفل والصف</th>
            <th className="py-3 px-space-sm font-semibold">أرقام التواصل</th>
            <th className="py-3 px-space-sm font-semibold">صلاحية الاستلام</th>
            <th className="py-3 px-space-md text-left font-semibold">إجراءات سريعة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm text-body-sm">
          {guardians.map((g) => {
            const isSelected = g.id === selectedGuardianId
            const primaryChild = g.children[0]
            const canPickup = g.children.every((c) => c.canPickup)

            return (
              <tr
                key={g.id}
                onClick={() => onSelectGuardian(g.id)}
                className={`transition-colors cursor-pointer relative group ${
                  isSelected
                    ? 'bg-primary/5 hover:bg-primary/10'
                    : !canPickup
                    ? 'bg-error-container/10 hover:bg-error-container/20'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                {/* Name and National ID */}
                <td className="py-3.5 px-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shadow-xs">
                        {getInitials(g.firstName, g.lastName)}
                      </div>
                      {primaryChild?.isPrimary && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full ring-2 ring-surface-container-lowest" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-headline-sm text-headline-sm truncate font-semibold ${
                            isSelected ? 'text-primary font-bold' : 'text-on-surface'
                          }`}
                        >
                          {g.firstName} {g.lastName}
                        </span>
                        {primaryChild?.isPrimary && (
                          <span
                            className="material-symbols-outlined text-[16px] text-primary"
                            title="ولي الأمر الرئيسي"
                          >
                            verified
                          </span>
                        )}
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant font-mono">
                        هوية: {g.nationalId || '---'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Relation */}
                <td className="py-3.5 px-space-sm">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                    {primaryChild?.relation || 'ولي أمر'}
                  </span>
                </td>

                {/* Linked Children */}
                <td className="py-3.5 px-space-sm">
                  <div className="flex flex-col gap-1">
                    {g.children.length > 0 ? (
                      g.children.map((c) => (
                        <span
                          key={c.childId}
                          className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded text-on-surface font-label-sm text-label-sm"
                        >
                          <span className="material-symbols-outlined text-[13px] text-primary">
                            child_care
                          </span>
                          <span>{c.childName}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-caption text-outline">غير مرتبط بطفل</span>
                    )}
                  </div>
                </td>

                {/* Phone */}
                <td className="py-3.5 px-space-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface dir-ltr text-right font-mono">
                      {g.phone}
                    </span>
                    <span className="font-caption text-caption text-primary flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      موثق SMS محلي
                    </span>
                  </div>
                </td>

                {/* Authorization status badge */}
                <td className="py-3.5 px-space-sm">
                  {canPickup ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-container text-on-primary-container font-label-sm text-label-sm font-medium">
                      <span className="material-symbols-outlined text-[14px]">key</span>
                      مصرح دائم
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-error text-on-error font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px]">do_not_disturb_on</span>
                      ممنوع من الاستلام
                    </span>
                  )}
                </td>

                {/* Quick Action buttons */}
                <td className="py-3.5 px-space-md text-left">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectGuardian(g.id)
                        onQuickDispatch('السادة أولياء الأمور، نرجو التكرم بالاستلام من بوابة الروضة.')
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
                      title="إرسال رسالة SMS عبر المودم"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">sms</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectGuardian(g.id)
                        onOpenPickupCard(g)
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-secondary flex items-center justify-center transition-colors"
                      title="معاينة وطباعة بطاقة الاستلام المشفرة"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code</span>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
