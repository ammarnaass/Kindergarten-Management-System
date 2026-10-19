import React from 'react'
import { PinKeypad } from './PinKeypad'
import { AuthSelectedUserBanner } from './AuthSelectedUserBanner'
import type { LocalUserSummary, AuthMode } from '../types'

interface AuthLoginFormProps {
  selectedUser: LocalUserSummary | null
  authMode: AuthMode
  onAuthModeChange: (mode: AuthMode) => void
  pin: string
  onPinChange: (val: string) => void
  password: string
  onPasswordChange: (val: string) => void
  showPassword: boolean
  onToggleShowPassword: () => void
  rememberSession: boolean
  onToggleRememberSession: (val: boolean) => void
  loading: boolean
  rfidScanning: boolean
  onLogin: () => void
  onRfidScan: () => void
  onResetFields: () => void
  onOpenHelp: () => void
  isFirstRun: boolean
  onSwitchToRegister: () => void
}

export const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  selectedUser,
  authMode,
  onAuthModeChange,
  pin,
  onPinChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  rememberSession,
  onToggleRememberSession,
  loading,
  rfidScanning,
  onLogin,
  onRfidScan,
  onResetFields,
  onOpenHelp,
  isFirstRun,
  onSwitchToRegister
}) => {
  return (
    <>
      {/* Active Selected User Profile Banner */}
      {selectedUser && (
        <AuthSelectedUserBanner
          user={selectedUser}
          onResetFields={onResetFields}
        />
      )}

      {/* Auth Mode Tabs Switcher */}
      <div className="flex items-center gap-2 mb-6 bg-surface-container p-1 rounded-xl">
        <button
          type="button"
          onClick={() => onAuthModeChange('pin')}
          className={`flex-1 py-2.5 rounded-lg font-bold text-label-md flex items-center justify-center gap-2 transition-all ${
            authMode === 'pin'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dialpad</span>
          <span>رمز PIN السريع (للفصول والحضور)</span>
        </button>

        <button
          type="button"
          onClick={() => onAuthModeChange('password')}
          className={`flex-1 py-2.5 rounded-lg font-bold text-label-md flex items-center justify-center gap-2 transition-all ${
            authMode === 'password'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span>كلمة المرور الرئيسية</span>
        </button>
      </div>

      {/* Auth Mode: PIN Code */}
      {authMode === 'pin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-label-md text-on-surface">
              أدخل رمز PIN المكون من 4 إلى 6 أرقام:
            </label>
            <span className="text-caption text-on-surface-variant">
              التبديل بين المعلمات دون خروج كامل
            </span>
          </div>

          <PinKeypad
            pin={pin}
            onChange={onPinChange}
            onSubmit={onLogin}
            disabled={loading}
            maxDigits={6}
          />
        </div>
      )}

      {/* Auth Mode: Master Password */}
      {authMode === 'password' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-label-md text-on-surface" htmlFor="master-pwd-input">
                كلمة المرور المحلية:
              </label>
              <button
                type="button"
                onClick={onOpenHelp}
                className="text-label-sm text-primary hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                vpn_key
              </span>
              <input
                id="master-pwd-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="أدخل كلمة مرور الحساب المحلي..."
                className="w-full h-12 bg-surface-container pr-11 pl-11 rounded-xl text-body-md text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 transition-colors"
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
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-2.5 text-on-surface-variant border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]">info</span>
            <span className="text-caption">
              صلاحية مدير النظام تتطلب التحقق الثنائي لكلمات المرور عند التعديل الشامل.
            </span>
          </div>
        </div>
      )}

      {/* Keep Session Active */}
      <div className="flex items-center justify-between mt-5 pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberSession}
            onChange={(e) => onToggleRememberSession(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
          />
          <span className="font-medium text-label-md text-on-surface">
            إبقاء جلسة اليوم نشطة على هذا الحاسوب
          </span>
        </label>
        <span className="text-caption text-on-surface-variant">
          انتهاء القفل التلقائي: 30 دقيقة
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-6">
        <button
          type="button"
          disabled={loading}
          onClick={onLogin}
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold text-headline-sm rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[22px]">login</span>
          )}
          <span>تسجيل الدخول للنظام</span>
          <kbd className="bg-on-primary/20 text-on-primary font-mono text-[11px] px-2 py-0.5 rounded">
            Enter ↵
          </kbd>
        </button>

        {/* RFID / Card Alternate Button */}
        <button
          type="button"
          disabled={loading || rfidScanning}
          onClick={onRfidScan}
          className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-label-md rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-secondary text-[20px]">
            contactless
          </span>
          <span>تمرير بطاقة المعلمة الذكية (RFID) أو باركود الحضور</span>
        </button>

        {/* Switch to Registration Callout */}
        {isFirstRun ? (
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
            <span className="text-body-sm text-on-surface-variant">
              تهيئة المشرف العام للنظام لأول مرة:
            </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary font-bold text-label-md hover:underline flex items-center gap-1"
            >
              <span>تهيئة حساب مدير النظام الآن</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant text-body-xs">
              <span className="material-symbols-outlined text-base text-primary">security</span>
              <span>إضافة وتعديل حسابات المعلمات والموظفين تتم حصراً من داخل لوحة التحكم بواسطة المشرف الإداري.</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
