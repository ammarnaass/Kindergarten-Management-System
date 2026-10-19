import React from 'react'

interface WizardPersonalInfoSectionProps {
  fullName: string
  onFullNameChange: (val: string) => void
  roleTitle: string
  onRoleTitleChange: (val: string) => void
  nationalId: string
  onNationalIdChange: (val: string) => void
  isLuhnValid: boolean
  phone: string
  onPhoneChange: (val: string) => void
  adminEmail: string
  onAdminEmailChange: (val: string) => void
}

export const WizardPersonalInfoSection: React.FC<WizardPersonalInfoSectionProps> = ({
  fullName,
  onFullNameChange,
  roleTitle,
  onRoleTitleChange,
  nationalId,
  onNationalIdChange,
  isLuhnValid,
  phone,
  onPhoneChange,
  adminEmail,
  onAdminEmailChange
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">badge</span>
            <h2 className="font-bold text-label-lg text-on-surface">
              القسم الأول: البيانات الإدارية والشخصية
            </h2>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">
            حقول مطلوبة للتوثيق
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="fullName">
              الاسم الرباعي الكامل للمسؤول <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                person
              </span>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
                placeholder="أدخل الاسم الرباعي المعتمد"
                className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Role Title */}
          <div>
            <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="roleTitle">
              المسمى الوظيفي والصفة الرسمية <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                work
              </span>
              <select
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => onRoleTitleChange(e.target.value)}
                className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary appearance-none transition-colors"
              >
                <option value="مالك المنشأة / المدير العام التنفيذي">مالك المنشأة / المدير العام التنفيذي</option>
                <option value="مدير/ـة الروضة المعتمد">مدير/ـة الروضة المعتمد</option>
                <option value="مدير تقنية المعلومات والأنظمة المحلية">مدير تقنية المعلومات والأنظمة المحلية</option>
                <option value="المشرف العام للشؤون الإدارية والمالية">المشرف العام للشؤون الإدارية والمالية</option>
              </select>
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* National ID with Luhn Check */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-label-md text-on-surface" htmlFor="nationalId">
                رقم الهوية الوطنية / الإقامة <span className="text-error">*</span>
              </label>
              <span
                className={`flex items-center gap-1 font-caption text-caption px-2.5 py-0.5 rounded-full font-semibold ${
                  isLuhnValid
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isLuhnValid ? 'verified' : 'info'}
                </span>
                <span>{isLuhnValid ? 'مطابق لخوارزمية Luhn' : '10 أرقام'}</span>
              </span>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                fingerprint
              </span>
              <input
                id="nationalId"
                type="text"
                maxLength={10}
                required
                value={nationalId}
                onChange={(e) => onNationalIdChange(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="10 أرقام تبدأ بـ 1 أو 2"
                className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface font-mono tracking-wider border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Saudi Mobile */}
          <div>
            <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="phone">
              رقم الجوال المعتمد للطوارئ <span className="text-error">*</span>
            </label>
            <div className="flex gap-2" dir="ltr">
              <div className="bg-surface-container px-3 py-2.5 rounded-xl flex items-center gap-1.5 text-on-surface font-mono text-label-md shrink-0 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                <span>+966</span>
              </div>
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="5X XXX XXXX"
                className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface font-mono border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Local Email */}
          <div>
            <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="adminEmail">
              البريد الإلكتروني للأرشفة والتقارير <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                mail
              </span>
              <input
                id="adminEmail"
                type="email"
                required
                value={adminEmail}
                onChange={(e) => onAdminEmailChange(e.target.value)}
                placeholder="admin@al-amal.rawdaty.local"
                className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
