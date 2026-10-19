import React from 'react'

interface WizardCredentialsSectionProps {
  username: string
  onUsernameChange: (val: string) => void
  password: string
  onPasswordChange: (val: string) => void
  confirmPassword: string
  onConfirmPasswordChange: (val: string) => void
  showPassword: boolean
  onToggleShowPassword: () => void
  passwordsMatch: boolean
  pinCode: string
  onPinCodeChange: (val: string) => void
}

export const WizardCredentialsSection: React.FC<WizardCredentialsSectionProps> = ({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  showPassword,
  onToggleShowPassword,
  passwordsMatch,
  pinCode,
  onPinCodeChange
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
            <h2 className="font-bold text-label-lg text-on-surface">
              القسم الثاني: بيانات المصادقة والأمان المحلي
            </h2>
          </div>
          <span className="font-caption text-caption text-on-surface-variant font-mono">
            تشفير محلي scrypt/Argon2
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Master Username */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-label-md text-on-surface" htmlFor="username">
                اسم مستخدم الحساب الرئيسي (Username) <span className="text-error">*</span>
              </label>
              <span className="font-caption text-caption text-secondary font-semibold">
                غير قابل للتعديل لاحقاً
              </span>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                alternate_email
              </span>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface font-mono border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Master Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-label-md text-on-surface" htmlFor="password">
                كلمة المرور الرئيسية للنظام <span className="text-error">*</span>
              </label>
              <span className="font-caption text-caption text-primary font-semibold">
                قوية ومحمية (100%)
              </span>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                key
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full pr-11 pl-11 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={onToggleShowPassword}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              <div className="h-1.5 rounded-full bg-primary" />
              <div className="h-1.5 rounded-full bg-primary" />
              <div className="h-1.5 rounded-full bg-primary" />
              <div className="h-1.5 rounded-full bg-primary" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="confirmPassword">
              تأكيد كلمة المرور الرئيسية <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                check_circle
              </span>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                className={`w-full pr-11 pl-11 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border transition-colors ${
                  passwordsMatch
                    ? 'border-emerald-500/50 focus:border-emerald-500'
                    : 'border-outline-variant/30 focus:border-primary'
                }`}
              />
              {passwordsMatch && (
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-[20px]">
                  done_all
                </span>
              )}
            </div>
          </div>

          {/* Quick Access PIN */}
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-label-md text-on-surface flex items-center gap-1.5" htmlFor="pinCode">
                <span className="material-symbols-outlined text-primary text-[18px]">dialpad</span>
                <span>رمز المرور السريع للوحة المفاتيح (Quick 6-Digit PIN)</span>
              </label>
              <span className="font-caption text-caption bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-semibold">
                عمليات سريعة
              </span>
            </div>
            <p className="text-caption text-on-surface-variant mb-2.5">
              يسمح بالتفويض السريع للعمليات الحساسة (قفل الشاشة أو التحضير السريع) دون كتابة كلمة المرور الطويلة في كل مرة.
            </p>
            <div className="flex items-center gap-3">
              <input
                id="pinCode"
                type="password"
                maxLength={6}
                value={pinCode}
                onChange={(e) => onPinCodeChange(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-44 px-3 py-2 bg-surface-container-lowest text-center tracking-[0.4em] font-headline-sm text-primary rounded-xl border border-outline-variant/40 focus:outline-none focus:border-primary"
              />
              <span className="text-caption text-on-surface-variant">
                6 أرقام فقط (Numpad Ready)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
