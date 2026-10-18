import React from 'react'
import type { PickupAlertItem } from '../../types'

interface ClassroomPickupAlertsProps {
  isOpen: boolean
  onClose: () => void
  alerts: PickupAlertItem[]
  onDismissAlert: (id: string) => void
}

export const ClassroomPickupAlerts: React.FC<ClassroomPickupAlertsProps> = ({
  isOpen,
  onClose,
  alerts,
  onDismissAlert
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high bg-surface-container-low/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  نداءات الاستلام عند البوابة
                </h3>
                {alerts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-caption font-bold text-[11px] animate-pulse">
                    {alerts.length} نداء نشط
                  </span>
                )}
              </div>
              <p className="font-caption text-caption text-on-surface-variant">
                وصول أولياء الأمور وتوثيق الباركود عند البوابة الرئيسية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-container-high flex items-center justify-center text-outline mb-2.5">
                <span className="material-symbols-outlined text-2xl">notifications_paused</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                لا توجد نداءات استلام حالياً
              </h4>
              <p className="font-caption text-caption text-on-surface-variant mt-1">
                عند مسح باركود الولي عند بوابة الروضة، سيظهر تنبيه فوري هنا لتجهيز الطفل.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-surface-container-low border border-primary/20 flex items-center justify-between gap-3 shadow-2xs animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-lg shadow-2xs">
                    {alert.childName[0]}
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {alert.childName}
                    </h4>
                    <div className="text-caption text-on-surface-variant flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-primary">{alert.guardianName}</span>
                      <span>•</span>
                      <span>{alert.guardianRelation}</span>
                      <span>•</span>
                      <span className="font-mono text-outline">{alert.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDismissAlert(alert.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-all active:scale-95 shadow-2xs"
                >
                  تم التجهيز
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low/50 border-t border-surface-container-high flex items-center justify-between">
          <span className="font-caption text-caption text-on-surface-variant">
            مرتبط بنظام الاستلام الآمن عند البوابة
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-md text-label-md transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
