import React from 'react'

interface RecoveryKeyCertificateProps {
  recoveryKey: string
  adminName: string
  username: string
  nationalId: string
  createdAt: string
  kindergartenName?: string
  onClose: () => void
}

export const RecoveryKeyCertificate: React.FC<RecoveryKeyCertificateProps> = ({
  recoveryKey,
  adminName,
  username,
  nationalId,
  createdAt,
  kindergartenName = 'روضتي الأهلية النموذجية',
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl p-6 border border-outline-variant/40 space-y-6 my-auto">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 print:hidden">
          <div className="flex items-center gap-2 text-primary font-bold text-headline-sm">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span>وثيقة شهادة الأمان ومفتاح الطوارئ (Emergency Certificate)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة الشهادة (Ctrl+P)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* ── Printable Certificate Canvas ──────────────── */}
        <div className="bg-white text-slate-900 p-8 rounded-xl border-2 border-slate-300 shadow-sm relative overflow-hidden font-sans">
          {/* Subtle Security Guilloche/Watermark */}
          <div className="absolute inset-0 border-8 border-double border-slate-200 pointer-events-none m-2" />

          {/* Certificate Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 relative z-10">
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-900">{kindergartenName}</h2>
              <p className="text-xs text-slate-500">نظام روضتي لإدارة رياض الأطفال — المحطة المكتبيّة المستقلة</p>
              <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                OFFLINE AIR-GAPPED SECURITY PROTOCOL
              </span>
            </div>

            <div className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center text-primary bg-slate-50">
              <span className="material-symbols-outlined text-[32px]">shield</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-6 relative z-10">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              شهادة الأمان ومفتاح الاسترداد الإداري الأعلى
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              MASTER RECOVERY ENVELOPE • HIGH CONFIDENTIALITY
            </p>
          </div>

          {/* Main Key Box */}
          <div className="my-4 p-5 bg-slate-50 border-2 border-dashed border-primary/40 rounded-xl text-center relative z-10">
            <span className="block text-xs font-semibold text-slate-500 mb-1">
              مفتاح الطوارئ المشفر (AES-256 MASTER KEY):
            </span>
            <span className="font-mono text-2xl font-extrabold text-primary tracking-widest select-all">
              {recoveryKey}
            </span>
            <p className="text-[11px] text-slate-400 mt-2">
              هذا المفتاح المشفر يُنشأ مرة واحدة فقط محلياً، ولا يُرفع إلى أي خادم سحابي، ويُعد الوسيلة الوحيدة لاستعادة النظام عند فقدان كلمة المرور.
            </p>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs mt-6 pt-4 border-t border-slate-200 relative z-10">
            <div>
              <span className="text-slate-400 block mb-0.5">اسم المسؤول الأعلى:</span>
              <span className="font-bold text-slate-800">{adminName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">اسم المستخدم (Username):</span>
              <span className="font-mono font-bold text-slate-800">{username}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">رقم الهوية الوطنية / الإقامة:</span>
              <span className="font-mono text-slate-800">{nationalId || 'غير محدد'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">تاريخ وتوقيت الإصدار:</span>
              <span className="font-mono text-slate-800">{createdAt}</span>
            </div>
          </div>

          {/* Warning & Pledges */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 relative z-10">
            <strong>تعليمات الحفظ الأمني:</strong> يُحفظ هذا المستند حصرياً في المغلف الأمني المختوم داخل خزينة إدارة الروضة. يمنع منعاً باتاً تصوير أو إرسال هذا المفتاح عبر تطبيقات المحادثة أو البريد غير المشفر.
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs mt-8 pt-6 border-t border-slate-200 relative z-10">
            <div>
              <span className="block text-slate-500 mb-6">توقيع المسؤول الأعلى المعتمد:</span>
              <div className="border-b border-slate-400 w-36 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400">التوقيع الحي</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-6">الختم الإداري الرسمي للروضة:</span>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 mx-auto flex items-center justify-center text-[10px] text-slate-300">
                موضع الختم
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
