import React from 'react'

interface WizardRecoverySectionProps {
  recoveryKey: string
  onCopyMasterKey: () => void
  onShowCertificate: () => void
  q1: string
  onQ1Change: (val: string) => void
  a1: string
  onA1Change: (val: string) => void
  q2: string
  onQ2Change: (val: string) => void
  a2: string
  onA2Change: (val: string) => void
}

export const WizardRecoverySection: React.FC<WizardRecoverySectionProps> = ({
  recoveryKey,
  onCopyMasterKey,
  onShowCertificate,
  q1,
  onQ1Change,
  a1,
  onA1Change,
  q2,
  onQ2Change,
  a2,
  onA2Change
}) => {
  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[20px]">key_vertical</span>
          <h2 className="font-bold text-label-lg text-on-surface">
            القسم الثالث: بروتوكول استعادة الحساب بدون إنترنت (Offline Recovery)
          </h2>
        </div>
        <span className="font-caption text-caption bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold">
          مهم جداً للحفاظ على استمرارية المنشأة
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 flex flex-col gap-2.5">
          <p className="text-body-md text-on-surface leading-relaxed">
            نظراً لأن نظام <strong>روضتي</strong> يعمل محلياً بالكامل ومفصولاً عن خوادم الإنترنت السحابية لحماية خصوصية بيانات الأطفال وعائلاتهم، فإنه لا يمكن طلب &quot;إعادة تعيين كلمة المرور عبر البريد أو رسالة SMS&quot;.
          </p>
          <p className="text-body-sm text-on-surface-variant">
            هذا المفتاح المشفر أدناه هو الوسيلة الوحيدة لفتح قاعدة البيانات المشفرة إذا فُقدت كلمة المرور. احتفظ به في مكان آمن أو خزنة الروضة.
          </p>

          {/* Master Key Card */}
          <div className="bg-surface-container p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
              <div>
                <span className="block text-caption text-on-surface-variant">
                  مفتاح الطوارئ الرئيسي المشفر (AES-256 Recovery Key)
                </span>
                <span className="font-mono text-headline-sm font-bold text-primary tracking-widest select-all">
                  {recoveryKey}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onCopyMasterKey}
                className="px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-label-md flex items-center gap-1.5 transition-colors shadow-xs border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>نسخ المفتاح</span>
              </button>

              <button
                type="button"
                onClick={onShowCertificate}
                className="px-3.5 py-2 bg-primary text-on-primary rounded-xl font-semibold text-label-md flex items-center gap-1.5 hover:bg-primary-container transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>طباعة شهادة الأمان</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Questions */}
        <div className="lg:col-span-5 bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 border border-outline-variant/30">
          <div className="flex items-center gap-1.5 text-on-surface font-semibold text-label-md mb-0.5">
            <span className="material-symbols-outlined text-primary text-[18px]">quiz</span>
            <span>الأسئلة الأمنية الإضافية (استرجاع فوري محلي)</span>
          </div>

          <div>
            <label className="block text-caption text-on-surface-variant mb-1">السؤال الأمني الأول:</label>
            <input
              type="text"
              value={q1}
              onChange={(e) => onQ1Change(e.target.value)}
              className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface mb-1.5 border border-outline-variant/30 focus:outline-none"
            />
            <input
              type="text"
              value={a1}
              onChange={(e) => onA1Change(e.target.value)}
              placeholder="إجابة السؤال الأول"
              className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-caption text-on-surface-variant mb-1">السؤال الأمني الثاني:</label>
            <input
              type="text"
              value={q2}
              onChange={(e) => onQ2Change(e.target.value)}
              className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface mb-1.5 border border-outline-variant/30 focus:outline-none"
            />
            <input
              type="text"
              value={a2}
              onChange={(e) => onA2Change(e.target.value)}
              placeholder="إجابة السؤال الثاني"
              className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
