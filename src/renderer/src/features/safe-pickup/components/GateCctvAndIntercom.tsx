interface GateCctvAndIntercomProps {
  onIntercomCall?: () => void
}

export function GateCctvAndIntercom({ onIntercomCall }: GateCctvAndIntercomProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md select-none">
      {/* Live CCTV Graphic Card (Offline-first, no external dependencies) */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center gap-space-md border border-outline-variant/40">
        <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center text-slate-400 border border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-emerald-400">videocam</span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase mt-0.5">
              CAM 01 • HD
            </span>
          </div>
          <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-error text-on-error font-mono text-[9px] font-bold flex items-center gap-0.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            LIVE
          </span>
        </div>
        <div>
          <div className="font-label-md text-label-md font-bold text-on-surface">
            لقطة كاميرا البوابة اللحظية
          </div>
          <div className="font-caption text-caption text-on-surface-variant mt-0.5">
            زاوية الدخول الرئيسية 01 (متصلة ومباشرة)
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
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center justify-between border border-outline-variant/40">
        <div>
          <div className="font-label-md text-label-md font-bold text-on-surface">
            نداء الفصل الداخلي (Intercom)
          </div>
          <div className="font-caption text-caption text-on-surface-variant mt-0.5">
            تنبيه المعلمة لتجهيز الطفل إلى البوابة فوراً
          </div>
          <div className="mt-1 flex items-center gap-1 text-emerald-700 font-caption text-caption font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>نظام النداء الداخلي متصل</span>
          </div>
        </div>
        <button
          onClick={
            onIntercomCall || (() => alert('تم بث النداء الصوتي داخل الفصل'))
          }
          className="px-3 py-2 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          <span>بث النداء</span>
        </button>
      </div>
    </div>
  )
}
