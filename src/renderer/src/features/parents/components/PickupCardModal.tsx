import { type GuardianItem } from '@/lib/api'

interface PickupCardModalProps {
  isOpen: boolean
  onClose: () => void
  guardian: GuardianItem | null
}

export function PickupCardModal({ isOpen, onClose, guardian }: PickupCardModalProps) {
  if (!isOpen || !guardian) return null

  const handlePrint = () => {
    window.print()
  }

  const primaryChild = guardian.children[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-surface-container-low/80 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">بطاقة الاستلام الذكية (CR80)</h2>
              <p className="text-body-sm text-on-surface-variant">معاينة وتصدير بطاقة الاستلام المشفرة للبوابة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* CR80 Card Preview Container */}
          <div className="mx-auto w-[340px] h-[215px] rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary/5 border-2 border-primary/30 p-4 shadow-lg flex flex-col justify-between relative overflow-hidden select-none">
            {/* Top decorative stripe */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-primary-container to-secondary-container" />

            {/* Card Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <div>
                  <h4 className="text-label-md font-bold text-on-surface leading-tight">روضتي OS</h4>
                  <span className="text-[10px] text-on-surface-variant block">بطاقة استلام مصرح بها</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                1446-1447 هـ
              </span>
            </div>

            {/* Card Body */}
            <div className="flex items-center gap-3 my-auto">
              {/* QR Code Container */}
              <div className="w-20 h-20 rounded-xl bg-white p-1.5 shadow-inner border border-outline-variant/40 flex flex-col items-center justify-center">
                <div className="grid grid-cols-5 gap-0.5 w-full h-full p-1 bg-surface-container-highest/20 rounded">
                  {/* Simulated high-density QR Matrix */}
                  <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-900 rounded-xs col-span-2" />
                  <div className="bg-slate-900 rounded-xs col-span-3" />
                  <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
                </div>
                <span className="text-[8px] font-mono text-slate-600 mt-0.5">AUTH-GATE</span>
              </div>

              {/* Info column */}
              <div className="flex-1 min-w-0 space-y-1">
                <div>
                  <span className="text-[10px] text-on-surface-variant block leading-tight">ولي الأمر / المستلم:</span>
                  <span className="text-label-md font-bold text-primary truncate block">
                    {guardian.firstName} {guardian.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block leading-tight">الطفل المكفول:</span>
                  <span className="text-body-sm font-semibold text-on-surface truncate block">
                    {primaryChild?.childName || 'طالب مسجل'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono">
                  <span>هوية: {guardian.nationalId || '---'}</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1 text-primary font-semibold">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                تصريح أمني معتمد
              </span>
              <span className="font-mono">{guardian.phone}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-label-lg"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-lg font-medium shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة فورية (Ctrl+P)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
