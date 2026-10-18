import React, { useState } from 'react'
import { KeyRound, Copy, Check, Printer, X, ShieldAlert } from 'lucide-react'

interface SetupRecoveryKeyModalProps {
  recoveryKey: string
  adminUsername: string
  branchName: string
  isOpen: boolean
  onClose: () => void
}

export const SetupRecoveryKeyModal: React.FC<SetupRecoveryKeyModalProps> = ({
  recoveryKey,
  adminUsername,
  branchName,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">شهادة مفتاح الاسترداد الأمني</h3>
              <p className="text-xs text-muted-foreground">حساب المشرف العام الأعلى للروضة</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-700 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>تنبيه بالغ الأهمية:</strong> هذا المفتاح هو وسيلتك الوحيدة لاسترجاع الوصول في حال نسيان كلمة المرور أو تعطل محطة العمل في وضع عدم الاتصال (Offline). احفظه في مكان آمن واطبع نسخة ورقية منه.
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-xl p-5 bg-card/50 text-center space-y-3">
            <div className="text-xs text-muted-foreground">مفتاح الاسترداد المخصص (Master Key):</div>
            <div className="font-mono text-xl font-black tracking-widest text-primary bg-primary/10 py-3 px-4 rounded-lg select-all">
              {recoveryKey}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
              <span>الروضة: <strong className="text-foreground">{branchName || 'روضتي'}</strong></span>
              <span>•</span>
              <span>المشرف: <strong className="text-foreground">{adminUsername}</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ المفتاح'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all hover:bg-primary/90"
            >
              تم الحفظ والمتابعة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
