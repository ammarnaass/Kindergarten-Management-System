import { useState } from 'react'

interface BroadcastModalProps {
  isOpen: boolean
  onClose: () => void
  totalGuardians: number
}

const TEMPLATES = [
  {
    title: 'تنبيه انصراف مبكر',
    text: 'السادة أولياء الأمور الكرام، نود إحاطتكم بأن انصراف أطفال روضتي سيكون استثنائياً اليوم في تمام الساعة 12:00 ظهراً. نرجو التكرم بالالتزام بموعد الاستلام عبر بوابات الروضة. شاكرين تعاونكم.',
  },
  {
    title: 'تذكير فعاليات الروضة',
    text: 'يسر روضتي دعوتكم لحضور مهرجان الأنشطة والابتكار يوم الخميس القادم من الساعة 09:00 صباحاً. حضوركم يسعد أطفالنا ويدعم مواهبهم.',
  },
  {
    title: 'تنبيه صحي أو طقس',
    text: 'نظراً للحالة الجوية الحالية وحرصاً على سلامة أبنائنا، نرجو تدفئة الأطفال وتجنب التأخر عند استلامهم من بوابة الروضة.',
  },
]

export function BroadcastModal({ isOpen, onClose, totalGuardians }: BroadcastModalProps) {
  const [target, setTarget] = useState('all')
  const [message, setMessage] = useState(TEMPLATES[0].text)
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  if (!isOpen) return null

  const handleSend = () => {
    if (!message.trim()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSentSuccess(true)
      setTimeout(() => {
        setSentSuccess(false)
        onClose()
      }, 1500)
    }, 800)
  }

  const charCount = message.length
  const smsSegments = Math.max(1, Math.ceil(charCount / 70))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-surface-container-low/80 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">إرسال تعميم فوري (GSM)</h2>
              <p className="text-body-sm text-on-surface-variant">
                بث رسائل نصية SMS لأولياء الأمور عبر المودم المحلي بدون إنترنت
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {sentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="text-headline-md font-bold text-on-surface">تم الإرسال بنجاح!</h3>
              <p className="text-body-md text-on-surface-variant">
                تم ضخ التعميم إلى طابور مودم الروضة (GSM Modem COM4) بنجاح.
              </p>
            </div>
          ) : (
            <>
              {/* Target Selector */}
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">
                  الفئة المستهدفة بالتعميم
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTarget('all')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold transition-all border ${
                      target === 'all'
                        ? 'bg-primary-container text-on-primary-container border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    الكل ({totalGuardians} مستلم)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarget('emergency')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold transition-all border ${
                      target === 'emergency'
                        ? 'bg-primary-container text-on-primary-container border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    جهات الطوارئ فقط
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarget('primary')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold transition-all border ${
                      target === 'primary'
                        ? 'bg-primary-container text-on-primary-container border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    الأولياء الأساسيين
                  </button>
                </div>
              </div>

              {/* Quick Template Chips */}
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1.5">
                  نماذج سريعة جاهزة
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(tmpl.text)}
                      className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant hover:text-on-surface text-caption font-medium transition-colors"
                    >
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">
                  نص التعميم <span className="text-error">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md"
                  placeholder="اكتب نص التعميم هنا..."
                />
                <div className="flex items-center justify-between text-caption text-on-surface-variant mt-1.5">
                  <span>
                    عدد الحروف: <span className="font-mono font-bold text-on-surface">{charCount}</span> (
                    {smsSegments} رسالة SMS مجزأة)
                  </span>
                  <span className="text-primary font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    المودم متصل وجاهز
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-caption text-on-surface-variant">
                  التكلفة: 0.00 ر.س (شريحة محلية أعمال)
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={sending}
                    className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-label-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                    className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-lg font-medium shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {sending && (
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>إرسال التعميم الآن</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
