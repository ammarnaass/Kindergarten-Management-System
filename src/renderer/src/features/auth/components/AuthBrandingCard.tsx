import React from 'react'

interface AuthBrandingCardProps {
  kindergartenName: string
  branchName: string
  academicYear: string
}

export const AuthBrandingCard: React.FC<AuthBrandingCardProps> = ({
  kindergartenName,
  branchName,
  academicYear
}) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              nest_eco_leaf
            </span>
          </div>
          <div>
            <h2 className="font-bold text-headline-md text-primary tracking-tight">
              {kindergartenName}
            </h2>
            <span className="font-semibold text-label-sm text-secondary">
              منظومة الإدارة الذكية للتعليم المبكر
            </span>
          </div>
        </div>

        <p className="text-body-sm text-on-surface-variant leading-relaxed">
          {[branchName, academicYear ? `العام الدراسي ${academicYear}` : null].filter(Boolean).join(' — ')}
          {branchName || academicYear ? '. ' : ''}
          محطة الدخول المشفرة تضمن حماية سجلات الأطفال وحضور الفصول محلياً دون الحاجة للإنترنت.
        </p>

        <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center gap-2.5 text-on-surface border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-label-sm">حماية البيانات المشددة</span>
            <span className="text-[11px] text-on-surface-variant truncate">
              سجلات الأطفال مشفرة بمفتاح محلي AES-256 غير سحابي
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
