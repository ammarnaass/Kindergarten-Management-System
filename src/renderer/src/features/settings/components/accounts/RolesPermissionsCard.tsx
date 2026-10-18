import React, { useState } from 'react'
import { ShieldCheck, ChevronDown, ChevronUp, Check, Lock } from 'lucide-react'
import type { RoleWithPermissionsItem } from '@/lib/api/types'

interface RolesPermissionsCardProps {
  roles: RoleWithPermissionsItem[]
}

export const RolesPermissionsCard: React.FC<RolesPermissionsCardProps> = ({ roles }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const ROLE_DETAILS = [
    {
      role: 'admin',
      name: 'مدير النظام الأعلى (Admin)',
      desc: 'صلاحيات مطلقة: إدارة جميع الأطفال، الكادر التعليمي، العمليات المالية، النسخ الاحتياطي، وإعدادات النظام الكاملة.',
      color: 'border-rose-500/30 bg-rose-500/5',
      features: ['إدارة كاملة للأطفال والملفات', 'تسجيل ومراجعة الحضور والغياب', 'إصدار الفواتير وسندات القبض', 'إدارة الحسابات والصلاحيات', 'النسخ الاحتياطي والصيانة']
    },
    {
      role: 'educator',
      name: 'معلمة / مربية (Educator)',
      desc: 'مخصصة للفصول التعليمية: تسجيل الحضور اليومي، كتابة ومتابعة التقارير اليومية للطفل (وجبات، قيلولة، سلوك)، واستعراض الملف الصحي.',
      color: 'border-indigo-500/30 bg-indigo-500/5',
      features: ['عرض قائمة أطفال الفصل', 'تسجيل حضور وغياب الفصل', 'كتابة التقرير اليومي والملاحظات', 'استعراض الحالات الصحية والحساسية']
    },
    {
      role: 'accountant',
      name: 'محاسب مالي (Accountant)',
      desc: 'إدارة دورة الرسوم المدرسية: إصدار الفواتير الفردية والشهرية المجمعة، تسجيل مدفوعات أولياء الأمور، وإصدار التقارير المالية.',
      color: 'border-emerald-500/30 bg-emerald-500/5',
      features: ['إصدار الفواتير الشهرية', 'تسجيل سندات القبض والدفع', 'طباعة الإيصالات والتقارير المالية', 'عرض بيانات الأطفال والأولياء']
    },
    {
      role: 'staff',
      name: 'استقبال وكادر الدعم (Staff)',
      desc: 'تشغيل بوابات الاستلام الآمن: مطابقة صور الأولياء والمفوضين، فحص بطاقات الـ RFID، وتسجيل خروج الأطفال اليومي.',
      color: 'border-amber-500/30 bg-amber-500/5',
      features: ['تشغيل شاشة الاستلام الآمن', 'مطابقة المفوضين بالاستلام', 'مسح بطاقات الباركود والـ RFID', 'الاطلاع على حضور وانصراف الأطفال']
    }
  ]

  return (
    <div className="border border-border rounded-2xl bg-card/60 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-right hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">مصفوفة صلاحيات الأدوار الوظيفية (Roles & Permissions)</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              استعراض حدود الصلاحيات المطبقة على حسابات النظام
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <span>{isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-muted/10 animate-in fade-in">
          {ROLE_DETAILS.map((r) => (
            <div key={r.role} className={`p-4 rounded-xl border ${r.color} space-y-2.5`}>
              <div>
                <h5 className="font-bold text-xs text-foreground">{r.name}</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{r.desc}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                {r.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
