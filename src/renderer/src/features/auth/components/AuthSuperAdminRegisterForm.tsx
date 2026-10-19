import React from 'react'
import type { AvatarOption } from '../types'

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'shield_person', label: 'إدارة' },
  { id: 'school', label: 'معلمة' },
  { id: 'badge', label: 'استقبال' },
  { id: 'payments', label: 'محاسبة' },
  { id: 'support_agent', label: 'إشراف' },
  { id: 'psychology', label: 'إرشاد' }
]

interface AuthSuperAdminRegisterFormProps {
  regDisplayName: string
  onRegDisplayNameChange: (val: string) => void
  regUsername: string
  onRegUsernameChange: (val: string) => void
  regPassword: string
  onRegPasswordChange: (val: string) => void
  regShowPassword: boolean
  onToggleRegShowPassword: () => void
  regPin: string
  onRegPinChange: (val: string) => void
  regAvatar: string
  onRegAvatarChange: (val: string) => void
  regLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onNavigateToWizard: () => void
}

export const AuthSuperAdminRegisterForm: React.FC<AuthSuperAdminRegisterFormProps> = ({
  regDisplayName,
  onRegDisplayNameChange,
  regUsername,
  onRegUsernameChange,
  regPassword,
  onRegPasswordChange,
  regShowPassword,
  onToggleRegShowPassword,
  regPin,
  onRegPinChange,
  regAvatar,
  onRegAvatarChange,
  regLoading,
  onSubmit,
  onNavigateToWizard
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Welcome Callout if First Run */}
      <div className="p-3.5 bg-primary-container/40 text-on-primary-container rounded-xl border border-primary/30 flex items-start gap-2.5 mb-2">
        <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
          waving_hand
        </span>
        <div className="text-body-sm">
          <strong className="block font-bold">مرحباً بك في نظام روضتي المكتبي!</strong>
          هذه أول عملية تشغيل بعد تثبيت البرنامج. يرجى إنشاء حساب مدير النظام (المسؤول الأعلى). سيتم قفل إمكانية إنشاء الحسابات الخارجية بعد هذه الخطوة مباشرة.
        </div>
      </div>

      {/* Role Locked Card */}
      <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0">
          <span className="material-symbols-outlined text-[24px]">shield_person</span>
        </div>
        <div className="flex-1">
          <div className="font-bold text-label-md text-primary">نوع الحساب: مدير النظام الأعلى (Super Admin)</div>
          <div className="text-body-xs text-on-surface-variant">
            كامل الصلاحيات الإدارية والمالية والأمنية • يُنشأ لمرة واحدة فقط
          </div>
        </div>
      </div>

      {/* Display Name & Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-label-sm text-on-surface block mb-1">
            الاسم الكامل للمستخدم:
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              person
            </span>
            <input
              type="text"
              required
              value={regDisplayName}
              onChange={(e) => onRegDisplayNameChange(e.target.value)}
              placeholder="مثال: أ. ليلى المنصوري"
              className="w-full h-11 bg-surface-container pr-10 pl-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-label-sm text-on-surface block mb-1">
            اسم المستخدم للدخول (Username):
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              alternate_email
            </span>
            <input
              type="text"
              required
              value={regUsername}
              onChange={(e) => onRegUsernameChange(e.target.value)}
              placeholder="مثال: laila_admin"
              className="w-full h-11 bg-surface-container pr-10 pl-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Password & Quick PIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-label-sm text-on-surface block mb-1">
            كلمة المرور (8 خانات على الأقل):
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              lock
            </span>
            <input
              type={regShowPassword ? 'text' : 'password'}
              required
              value={regPassword}
              onChange={(e) => onRegPasswordChange(e.target.value)}
              placeholder="كلمة مرور قوية..."
              className="w-full h-11 bg-surface-container pr-10 pl-9 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
            />
            <button
              type="button"
              onClick={onToggleRegShowPassword}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[18px]">
                {regShowPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="font-semibold text-label-sm text-on-surface block mb-1">
            رمز PIN السريع (اختياري 4-6 أرقام):
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              dialpad
            </span>
            <input
              type="password"
              maxLength={6}
              value={regPin}
              onChange={(e) => onRegPinChange(e.target.value.replace(/\D/g, ''))}
              placeholder="مثال: 1234"
              className="w-full h-11 bg-surface-container pr-10 pl-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Avatar Icon Selector */}
      <div>
        <label className="font-semibold text-label-sm text-on-surface block mb-1.5">
          اختر أيقونة الحساب الشخصية:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {AVATAR_OPTIONS.map((av) => (
            <button
              key={av.id}
              type="button"
              onClick={() => onRegAvatarChange(av.id)}
              className={`p-2 rounded-xl flex items-center gap-1.5 transition-all text-xs border ${
                regAvatar === av.id
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{av.id}</span>
              <span>{av.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Registration Button */}
      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={regLoading}
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold text-headline-sm rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {regLoading ? (
            <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
          )}
          <span>إنشاء حساب مدير النظام وبدء الاستخدام</span>
        </button>

        {/* Super Admin Wizard Link */}
        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-body-sm text-on-surface-variant">
            تريد تهيئة مدير النظام الأعلى مع شهادة أمان ورقية؟
          </span>
          <button
            type="button"
            onClick={onNavigateToWizard}
            className="text-primary font-bold text-label-md hover:underline flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>معالج التثبيت الشامل (F12)</span>
          </button>
        </div>
      </div>
    </form>
  )
}
