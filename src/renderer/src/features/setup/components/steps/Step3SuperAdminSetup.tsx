import React, { useState } from 'react'
import {
  UserCheck,
  Lock,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Printer
} from 'lucide-react'
import type { SetupFormData } from '../../types'
import { SetupRecoveryKeyModal } from '../SetupRecoveryKeyModal'

interface Step3SuperAdminSetupProps {
  formData: SetupFormData
  updateFormData: (fields: Partial<SetupFormData>) => void
  regenerateRecoveryKey: () => void
}

export const Step3SuperAdminSetup: React.FC<Step3SuperAdminSetupProps> = ({
  formData,
  updateFormData,
  regenerateRecoveryKey
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const passwordLength = formData.adminPassword.length
  const isPasswordGood = passwordLength >= 6

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          <span>حساب المشرف العام الأعلى (Super Admin)</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          هذا الحساب يتمتع بكافة الصلاحيات الإدارية والمالية وإدارة المعلمات والنسخ الاحتياطي للنظام.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            الاسم الكامل للمشرف العام <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.adminDisplayName}
            onChange={(e) => updateFormData({ adminDisplayName: e.target.value })}
            placeholder="مثال: د. نادية المنصوري"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            اسم المستخدم للدخول <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.adminUsername}
            onChange={(e) => updateFormData({ adminUsername: e.target.value.toLowerCase().replace(/\s+/g, '') })}
            placeholder="admin"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            كلمة المرور الرئيسية <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.adminPassword}
              onChange={(e) => updateFormData({ adminPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isPasswordGood ? 'bg-emerald-500 w-full' : passwordLength > 0 ? 'bg-amber-500 w-1/2' : 'w-0'
                }`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {isPasswordGood ? 'كلمة مرور مقبولة' : 'موصى بـ 6 خانات فأكثر'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            تأكيد كلمة المرور <span className="text-destructive">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.adminConfirmPassword}
            onChange={(e) => updateFormData({ adminConfirmPassword: e.target.value })}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            رمز PIN السريع (للبوابة ومحطة العمل) <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            maxLength={6}
            value={formData.adminPin}
            onChange={(e) => updateFormData({ adminPin: e.target.value.replace(/\D/g, '') })}
            placeholder="4 إلى 6 أرقام"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <span className="text-[10px] text-muted-foreground mt-1 block">
            يُستخدم لتبديل المستخدمين السريع عند بوابات الاستلام الآمن.
          </span>
        </div>

        {/* Master Recovery Key Box */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <KeyRound className="w-4 h-4" />
              <span>مفتاح الاسترداد الأمني (Master Key)</span>
            </div>
            <button
              type="button"
              onClick={regenerateRecoveryKey}
              title="توليد مفتاح جديد"
              className="p-1 rounded-md text-amber-600 hover:bg-amber-500/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-foreground bg-card py-2 px-3 rounded-lg border border-border text-center select-all">
            {formData.recoveryKey}
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>عرض وطباعة شهادة الأمان</span>
            </button>
          </div>
        </div>
      </div>

      <SetupRecoveryKeyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recoveryKey={formData.recoveryKey}
        adminUsername={formData.adminUsername}
        branchName={formData.branchName}
      />
    </div>
  )
}
