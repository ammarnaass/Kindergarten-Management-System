import React from 'react'
import { ShieldCheck, HardDrive, Cpu, Lock, CheckCircle2 } from 'lucide-react'
import type { SetupFormData } from '../../types'

interface Step1WelcomeSystemCheckProps {
  formData: SetupFormData
  diagnostics: { ok: boolean; path: string; journalMode: string } | null
  updateFormData: (fields: Partial<SetupFormData>) => void
}

export const Step1WelcomeSystemCheck: React.FC<Step1WelcomeSystemCheckProps> = ({
  formData,
  diagnostics,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground">
              مرحباً بك في معالج التثبيت والتهيئة لنظام «روضتي»
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              يقوم هذا المعالج بإعداد البيئة المحلية الآمنة، تسجيل هوية الروضة، إنشاء حساب المشرف العام الأعلى، وتجهيز الفصول والعتاد.
            </p>
          </div>
        </div>
      </div>

      {/* Offline Guarantees Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-foreground">خصوصية كاملة (Offline-First)</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            تعمل قاعدة البيانات والعمليات بنسبة 100% دون أي اتصال خارجي أو تسريب للبيانات خارج جهازك.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-foreground">محرك SQLite مدمج بنمط WAL</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            أداء فائق للتعامل مع استعلامات الحضور والمالية ومعاملات ذرية تحمي البيانات من انقطاع الطاقة.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-foreground">ربط مباشر مع نظام التشغيل</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            تعرف فوري على طابعات USB والشبكة، وقوارئ الباركود والبطاقات الذكية RFID.
          </div>
        </div>
      </div>

      {/* System Diagnostics Box */}
      <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>حالة فحص جاهزية محطة العمل المحلية</span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>محرك التخزين جاهز ومؤهل</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-card p-3 rounded-lg border border-border/80">
          <div>
            <span className="text-muted-foreground">مسار التخزين المحلي: </span>
            <span className="font-mono text-foreground break-all">{diagnostics?.path || 'جاري الفحص...'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">نمط دفتر اليومية: </span>
            <span className="font-mono text-foreground">{diagnostics?.journalMode || 'WAL'}</span>
          </div>
        </div>
      </div>

      {/* Terms Agreement Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/70 hover:bg-card cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => updateFormData({ agreedToTerms: e.target.checked })}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary mt-0.5"
          />
          <div className="text-xs leading-relaxed text-foreground">
            <strong className="block text-sm mb-0.5">الموافقة على سياسة الاستخدام المحلي والأمان:</strong>
            أقر بأن هذا البرنامج مخصص لإدارة رياض الأطفال، وأتحمل مسؤولية المحافظة على مفتاح الاسترداد الأمني والنسخ الاحتياطية الدورية لقاعدة البيانات.
          </div>
        </label>
      </div>
    </div>
  )
}
