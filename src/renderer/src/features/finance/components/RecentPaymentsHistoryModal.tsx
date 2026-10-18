import React from 'react'
import type { RecentPayment } from '../types'

interface RecentPaymentsHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  recentPayments: RecentPayment[]
}

export const RecentPaymentsHistoryModal: React.FC<RecentPaymentsHistoryModalProps> = ({
  isOpen,
  onClose,
  recentPayments
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">history</span>
            <span className="font-headline-sm font-bold text-on-surface">
              سجل إيصالات اليوم المسجلة
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {recentPayments.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">receipt</span>
              <p className="text-on-surface font-semibold text-sm">لا توجد إيصالات مسجلة اليوم</p>
              <p className="text-on-surface-variant text-xs mt-1">
                أي دفعة يتم تحصيلها واعتمادها ستظهر هنا فوراً
              </p>
            </div>
          ) : (
            recentPayments.map((p) => {
              const dateVal = p.paidAt instanceof Date ? p.paidAt : new Date(p.paidAt)
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-base">payments</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-md font-bold text-on-surface">
                          {p.childFirstName} {p.childLastName}
                        </span>
                        <span className="font-mono text-caption px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                          {p.receiptNumber}
                        </span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                        {p.method === 'cash'
                          ? 'نقداً'
                          : p.method === 'transfer'
                            ? 'تحويل'
                            : p.method === 'cheque'
                              ? 'شيك'
                              : 'بطاقة'}{' '}
                        • {dateVal.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="font-label-lg font-bold font-mono text-primary">
                    {((p.amountCents || 0) / 100).toLocaleString('ar-DZ')} دج
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
