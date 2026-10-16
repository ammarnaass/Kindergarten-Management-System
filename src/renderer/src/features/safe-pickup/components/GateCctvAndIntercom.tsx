interface GateCctvAndIntercomProps {
  onIntercomCall?: () => void
}

export function GateCctvAndIntercom({ onIntercomCall }: GateCctvAndIntercomProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md select-none">
      {/* Live Snapshot Card */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center gap-space-md">
        <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-inverse-surface shrink-0">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=160&auto=format&fit=crop&q=80"
            alt="CCTV"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1 right-1 px-1 rounded bg-error text-on-error font-caption text-caption font-bold">
            REC
          </span>
        </div>
        <div>
          <div className="font-label-md text-label-md font-bold text-on-surface">
            لقطة كاميرا البوابة اللحظية
          </div>
          <div className="font-caption text-caption text-on-surface-variant mt-0.5">
            زاوية الدخول الرئيسية 01 (HD)
          </div>
          <button
            onClick={() => alert('تم حفظ لقطة أمنية في سجل الأرشفة المحلي')}
            className="mt-2 flex items-center gap-1.5 text-primary font-caption text-caption font-semibold hover:underline"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            <span>حفظ لقطة في سجل الأرشفة</span>
          </button>
        </div>
      </div>

      {/* Audio Alert & Child Readiness Call */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="font-label-md text-label-md font-bold text-on-surface">
            نداء الفصل الداخلي (Intercom)
          </div>
          <div className="font-caption text-caption text-on-surface-variant mt-0.5">
            تنبيه المعلمة لتجهيز الطفل إلى البوابة فوراً
          </div>
          <div className="mt-1 flex items-center gap-1 text-emerald-700 font-caption text-caption font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>الفصل متصل ومستعد</span>
          </div>
        </div>
        <button
          onClick={
            onIntercomCall || (() => alert('تم بث النداء الصوتي داخل الفصل: ريان إلى البوابة'))
          }
          className="px-3 py-2 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          <span>بث النداء</span>
        </button>
      </div>
    </div>
  )
}
