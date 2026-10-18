import React, { useRef } from 'react'
import { Building2, Upload, Coins, Clock, Calendar } from 'lucide-react'
import type { SetupFormData } from '../../types'
import { CURRENCY_OPTIONS } from '../../constants'

interface Step2KindergartenIdentityProps {
  formData: SetupFormData
  updateFormData: (fields: Partial<SetupFormData>) => void
}

export const Step2KindergartenIdentity: React.FC<Step2KindergartenIdentityProps> = ({
  formData,
  updateFormData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateFormData({ logoDataUrl: reader.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span>بيانات وهوية الروضة والفرع</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          هذه المعلومات ستظهر في ترويسة التقارير الرسمية، الإيصالات الحرارية، وسندات القبض.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo Card */}
        <div className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-border rounded-2xl bg-card/40 text-center">
          <div className="w-24 h-24 rounded-2xl border border-border bg-muted/30 flex items-center justify-center overflow-hidden mb-3 relative group">
            {formData.logoDataUrl ? (
              <img
                src={formData.logoDataUrl}
                alt="شعار الروضة"
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building2 className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{formData.logoDataUrl ? 'تغيير الشعار' : 'رفع شعار الروضة'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <span className="text-[10px] text-muted-foreground mt-2">PNG أو JPG (موصى بـ 256×256)</span>
        </div>

        {/* Kindergarten Main Details */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-foreground mb-1.5">
              اسم الروضة أو المركز التعليمي <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.branchName}
              onChange={(e) => updateFormData({ branchName: e.target.value })}
              placeholder="مثال: روضة أجيال الغد النموذجية"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              رقم الترخيص / السجل التجاري
            </label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
              placeholder="مثال: LIC-2024-8891"
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">المدينة</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              placeholder="مثال: الرياض"
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              رقم هاتف الإدارة / الواتساب
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="05XXXXXXXX"
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              البريد الإلكتروني للروضة
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="info@kindergarten.local"
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* Regional & Academic Settings */}
      <div className="p-4 rounded-xl border border-border bg-card/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span>العملة الافتراضية</span>
          </label>
          <select
            value={formData.currency}
            onChange={(e) => updateFormData({ currency: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>العام الدراسي الحالي</span>
          </label>
          <input
            type="text"
            value={formData.academicYear}
            onChange={(e) => updateFormData({ academicYear: e.target.value })}
            placeholder="2024-2025"
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>تنسيق الوقت</span>
          </label>
          <select
            value={formData.timeFormat}
            onChange={(e) => updateFormData({ timeFormat: e.target.value as '12h' | '24h' })}
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="12h">نظام 12 ساعة (صباحاً / مساءً)</option>
            <option value="24h">نظام 24 ساعة</option>
          </select>
        </div>
      </div>
    </div>
  )
}
