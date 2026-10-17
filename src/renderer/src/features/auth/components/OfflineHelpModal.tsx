import React, { useEffect } from 'react'

interface OfflineHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const OfflineHelpModal: React.FC<OfflineHelpModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-outline-variant/40 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5 text-primary">
            <span className="material-symbols-outlined text-[26px]">help</span>
            <h3 className="font-bold text-headline-sm text-on-surface">
              المساعدة والدعم المحلي المستقل (Offline Support)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-body-md text-on-surface-variant leading-relaxed">
          نظام <strong>روضتي</strong> مصمم ليعمل بنسبة 100% دون الحاجة إلى الإنترنت لحماية خصوصية بيانات الأطفال وسجلات الروضة. في حال واجهت أي صعوبة في الدخول:
        </p>

        <div className="space-y-3">
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">key_vertical</span>
            <div>
              <h4 className="font-bold text-label-md text-on-surface mb-0.5">
                1. مفتاح الاسترداد الإداري (Master Recovery Key)
              </h4>
              <p className="text-caption text-on-surface-variant">
                متاح في شهادة الأمان الورقية المطبوعة والمحفوظة في خزينة إدارة الروضة. يتيح إعادة ضبط الحساب دون أي خادم خارجي.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">contactless</span>
            <div>
              <h4 className="font-bold text-label-md text-on-surface mb-0.5">
                2. بطاقة المعلمة الذكية (RFID / Barcode)
              </h4>
              <p className="text-caption text-on-surface-variant">
                يمكن تمرير بطاقة المعلمة أو مسح باركود الهوية للدخول الفوري السريع إلى وضع الفصل وتسجيل حضور وانصراف الأطفال.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-[22px] shrink-0 mt-0.5">database</span>
            <div>
              <h4 className="font-bold text-label-md text-on-surface mb-0.5">
                3. فحص سلامة قاعدة البيانات والنسخ الاحتياطي (F12)
              </h4>
              <p className="text-caption text-on-surface-variant">
                اضغط على زر <kbd className="bg-surface-container-high px-1.5 py-0.5 rounded font-mono text-[11px]">F12</kbd> للدخول إلى وضع الطوارئ والتحقق من سلامة ملف SQLite أو استرجاع نسخة احتياطية من وحدة USB.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-caption text-on-surface-variant font-mono">
            نظام روضتي • الإصدار 2.4.0 M3
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-xs"
          >
            فهمت ذلك، إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
