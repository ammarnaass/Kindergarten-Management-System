import type { StaffMember } from '@/lib/api/types'

interface StaffCardModalProps {
  isOpen: boolean
  onClose: () => void
  staff: StaffMember | null
  kindergartenName?: string
}

export function StaffCardModal({
  isOpen,
  onClose,
  staff,
  kindergartenName = 'روضتي النموذجية'
}: StaffCardModalProps) {
  if (!isOpen || !staff) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in select-none">
      <div
        className="w-full max-w-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-surface-container-low/80 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">بطاقة عمل الكادر (CR80)</h2>
              <p className="text-body-sm text-on-surface-variant">معاينة وطباعة بطاقة التعريف الرسمية للموظف</p>
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
          {/* CR80 Card Preview Container (Standard 85.6mm x 54mm aspect ratio) */}
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
                  <h4 className="text-label-md font-bold text-on-surface leading-tight">{kindergartenName}</h4>
                  <span className="text-[10px] text-on-surface-variant block">بطاقة كادر تعليمي وإداري</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                1446-1447 هـ
              </span>
            </div>

            {/* Card Body */}
            <div className="flex items-center gap-3 my-auto">
              {/* Photo / Avatar */}
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center border border-primary/20 shadow-xs shrink-0">
                {staff.firstName.charAt(0)}.{staff.lastName.charAt(0)}
              </div>

              {/* Info column */}
              <div className="flex-1 min-w-0 space-y-1">
                <div>
                  <span className="text-label-md font-bold text-on-surface truncate block">
                    {staff.firstName} {staff.lastName}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container text-[11px] font-bold mt-0.5">
                    {staff.role}
                  </span>
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span>الهاتف:</span>
                    <span className="dir-ltr text-on-surface font-semibold">{staff.phone || '---'}</span>
                  </div>
                  <div>
                    <span>كود الموظف:</span>{' '}
                    <span className="font-semibold text-primary">STF-{staff.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Mini Barcode Graphic */}
              <div className="w-14 h-14 rounded-lg bg-white p-1 border border-outline-variant/30 flex flex-col items-center justify-center shrink-0">
                <div className="grid grid-cols-4 gap-0.5 w-full h-full p-0.5 bg-slate-100 rounded">
                  <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-900 rounded-xs col-span-2" />
                  <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
                </div>
                <span className="text-[7px] font-mono text-slate-600 mt-0.5">VERIFIED</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                على رأس العمل
              </span>
              <span className="font-mono text-caption">تاريخ المباشرة: {staff.hiredAt || '1446 هـ'}</span>
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
              <span>طباعة البطاقة (Ctrl+P)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
