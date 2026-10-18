import React from 'react'
import {
  Sparkles,
  CheckCircle2,
  Building2,
  UserCheck,
  GraduationCap,
  Printer,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { SetupFormData } from '../../types'

interface Step6InstallationProgressProps {
  formData: SetupFormData
  isInstalling: boolean
  installProgress: number
  installStepLabel: string
  isComplete: boolean
  error: string | null
}

export const Step6InstallationProgress: React.FC<Step6InstallationProgressProps> = ({
  formData,
  isInstalling,
  installProgress,
  installStepLabel,
  isComplete,
  error
}) => {
  const navigate = useNavigate()

  const handleLaunch = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="space-y-6">
      {!isComplete ? (
        <>
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>مراجعة بيانات التهيئة والتثبيت النهائي</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              تأكد من صحة البيانات أدناه قبل الضغط على زر بدء التثبيت لتهيئة قاعدة البيانات وقفل النظام.
            </p>
          </div>

          {/* Provisioning Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/60 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">هوية الروضة</div>
                <div className="text-sm font-bold text-foreground">{formData.branchName || 'غير محدد'}</div>
                <div className="text-xs text-muted-foreground">
                  {formData.city} • {formData.currency} • {formData.academicYear}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/60 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">المشرف العام الأعلى</div>
                <div className="text-sm font-bold text-foreground">{formData.adminDisplayName || 'غير محدد'}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  @{formData.adminUsername} • رمز PIN مُفعل
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/60 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">الفصول التعليمية</div>
                <div className="text-sm font-bold text-foreground">{formData.classrooms.length} فصول دراسية</div>
                <div className="text-xs text-muted-foreground">
                  سعة إجمالية: {formData.classrooms.reduce((acc, c) => acc + c.capacity, 0)} طالب
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/60 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-semibold">الطابعات المحددة</div>
                <div className="text-sm font-bold text-foreground">
                  {formData.documentPrinter || 'تصدير PDF فقط'}
                </div>
                <div className="text-xs text-muted-foreground">
                  الحرارية: {formData.receiptPrinter || 'غير مفعلة'}
                </div>
              </div>
            </div>
          </div>

          {/* Installation Progress Bar during execution */}
          {isInstalling && (
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>{installStepLabel}</span>
                </span>
                <span className="font-mono text-primary font-black">{installProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}
        </>
      ) : (
        /* Celebratory Completion Screen */
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-primary text-primary-foreground flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">
              مبارك! تم تثبيت وتهيئة نظام «روضتي» بنجاح 🚀
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              تم تشفير البيانات وقفل التثبيت، وأصبح نظام الروضة جاهزاً للعمل المحلي بالكامل بأعلى معايير السرعة والأمان.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl border border-border bg-card/80 text-right space-y-2 text-xs">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">اسم المنشأة:</span>
              <strong className="text-foreground">{formData.branchName}</strong>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">المشرف الأعلى:</span>
              <strong className="text-foreground">{formData.adminDisplayName} (@{formData.adminUsername})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">حالة النظام:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">مثبت ومحمي (Active & Locked)</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleLaunch}
              className="inline-flex items-center gap-3 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-95 text-primary-foreground font-black text-base shadow-xl shadow-primary/30 transition-all hover:scale-105"
            >
              <span>تشغيل روضتي الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
