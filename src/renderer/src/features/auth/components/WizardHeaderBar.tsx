import React from 'react'

export const WizardHeaderBar: React.FC = () => {
  return (
    <>
      {/* ── Stepper Header Bar ─────────────────────────── */}
      <div className="w-full bg-surface-container-lowest shadow-sm rounded-2xl p-6 border border-outline-variant/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-label-md mb-1">
              <span className="material-symbols-outlined text-[18px]">install_desktop</span>
              <span>معالج التثبيت والتشغيل الأولي لنظام روضتي المكتبي</span>
            </div>
            <h1 className="font-extrabold text-headline-lg text-on-surface tracking-tight">
              إعداد مدير النظام الرئيسي (Super Administrator)
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-xl border border-outline-variant/30 self-start lg:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold text-label-sm text-on-surface-variant">
              البيئة: محلية بالكامل (Air-Gapped / Offline-First)
            </span>
          </div>
        </div>

        {/* 4-Step Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="min-w-0">
              <p className="font-caption text-caption text-emerald-600 font-semibold">الخطوة 1 - مكتملة</p>
              <p className="font-bold text-label-md text-on-surface truncate">تهيئة قاعدة بيانات SQLite</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-primary text-on-primary rounded-xl shadow-xs">
            <div className="w-8 h-8 rounded-full bg-on-primary text-primary flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div className="min-w-0">
              <p className="font-caption text-caption text-primary-container font-semibold">الخطوة الحالية</p>
              <p className="font-bold text-label-md text-on-primary truncate">تعيين المسؤول الأعلى</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl opacity-75 border border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div className="min-w-0">
              <p className="font-caption text-caption text-on-surface-variant">الخطوة التالية</p>
              <p className="font-bold text-label-md text-on-surface-variant truncate">بيانات الروضة والفروع</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl opacity-75 border border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
              4
            </div>
            <div className="min-w-0">
              <p className="font-caption text-caption text-on-surface-variant">الخطوة الختامية</p>
              <p className="font-bold text-label-md text-on-surface-variant truncate">التفضيلات والطباعة المحلية</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Alert Banner ──────────────────────────── */}
      <div className="w-full bg-surface-container-high rounded-2xl p-5 flex items-start gap-4 shadow-xs border border-outline-variant/30">
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[28px]">shield_person</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-headline-sm text-on-surface">
              إنشاء حساب الجذر (Super Administrator)
            </h3>
            <span className="bg-primary text-on-primary font-caption text-[11px] px-2 py-0.5 rounded-full font-bold">
              صلاحية مطلقة
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            يمتلك هذا الحساب الصلاحية الكاملة لإدارة قواعد البيانات المحلية، منح التراخيص للمشرفين والمعلمات، توليد النسخ الاحتياطية المشفرة، وإعادة ضبط الأمان في حالات الطوارئ دون الحاجة لأي خادم سحابي.
          </p>
        </div>
      </div>
    </>
  )
}
