import React from 'react'

interface WizardPledgeSectionProps {
  agreed: boolean
  onAgreedChange: (val: boolean) => void
}

export const WizardPledgeSection: React.FC<WizardPledgeSectionProps> = ({
  agreed,
  onAgreedChange
}) => {
  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
      <div className="flex items-center gap-2 text-primary pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
        <span className="material-symbols-outlined text-[20px]">policy</span>
        <h2 className="font-bold text-label-lg text-on-surface">
          القسم الرابع: حزم الصلاحيات التلقائية وميثاق الأمان الرقمي
        </h2>
      </div>

      {/* Privileges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>
          <div>
            <p className="font-bold text-label-sm text-on-surface">إدارة الموظفين</p>
            <p className="text-caption text-on-surface-variant">صلاحية شاملة 100%</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
          <div>
            <p className="font-bold text-label-sm text-on-surface">المالية والسندات</p>
            <p className="text-caption text-on-surface-variant">الاعتماد والإلغاء</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[22px]">database</span>
          <div>
            <p className="font-bold text-label-sm text-on-surface">النسخ وقاعدة البيانات</p>
            <p className="text-caption text-on-surface-variant">ترحيل واستيراد</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[22px]">security</span>
          <div>
            <p className="font-bold text-label-sm text-on-surface">إعدادات التشفير</p>
            <p className="text-caption text-on-surface-variant">مفاتيح AES-256</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[22px]">door_front</span>
          <div>
            <p className="font-bold text-label-sm text-on-surface">بوابات التحضير</p>
            <p className="text-caption text-on-surface-variant">ربط باركود وRFID</p>
          </div>
        </div>
      </div>

      {/* Pledge Checkbox */}
      <div className="p-4 bg-surface-container rounded-xl flex items-start gap-3 border border-outline-variant/30">
        <input
          id="charterAgreement"
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => onAgreedChange(e.target.checked)}
          className="mt-1 w-5 h-5 text-primary rounded bg-surface-container-lowest focus:ring-0 cursor-pointer"
        />
        <label htmlFor="charterAgreement" className="cursor-pointer text-body-sm text-on-surface leading-relaxed">
          <strong className="block text-label-md text-on-surface mb-0.5">
            إقرار المسؤولية والخصوصية المدرسية:
          </strong>
          أتعهد بصفتي المسؤول الأعلى الأول المعتمد لنظام روضتي بالحفاظ على سرية سجلات الأطفال والبيانات الأسرية والتقارير الصحية والمالية وفق الأنظمة واللوائح المعتمدة، وتحمل مسؤولية حفظ مفتاح الاستعادة المشفر وكلمة المرور الرئيسية بعيداً عن متناول غير المصرح لهم.
        </label>
      </div>
    </div>
  )
}
