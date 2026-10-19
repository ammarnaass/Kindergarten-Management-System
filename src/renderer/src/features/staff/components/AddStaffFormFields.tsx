import React from 'react'

export const PRESET_ROLES = [
  'معلمة رياض أطفال',
  'مساعدة معلمة',
  'أخصائية نطق وتخاطب',
  'ممرضة صحية',
  'إدارية شؤون أطفال',
  'مشرفة نقل وحافلات',
  'عاملة رعاية وخدمات',
  'حارس أمن وسلامة',
  'أخرى'
]

export interface AddStaffFormFieldsProps {
  firstName: string
  setFirstName: (val: string) => void
  lastName: string
  setLastName: (val: string) => void
  role: string
  setRole: (val: string) => void
  customRole: string
  setCustomRole: (val: string) => void
  phone: string
  setPhone: (val: string) => void
  email: string
  setEmail: (val: string) => void
  salaryDzd: string
  setSalaryDzd: (val: string) => void
  hiredAt: string
  setHiredAt: (val: string) => void
  isActive: boolean
  setIsActive: (val: boolean) => void
}

export const AddStaffFormFields: React.FC<AddStaffFormFieldsProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  role,
  setRole,
  customRole,
  setCustomRole,
  phone,
  setPhone,
  email,
  setEmail,
  salaryDzd,
  setSalaryDzd,
  hiredAt,
  setHiredAt,
  isActive,
  setIsActive
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            الاسم الأول <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="مثال: مريم"
            required
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            اسم العائلة <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="مثال: بن علي"
            required
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            المسمى الوظيفي <span className="text-error">*</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
          >
            {PRESET_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {role === 'أخرى' && (
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
              اكتب المسمى الوظيفي <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="مثال: منسقة أنشطة وترفيه"
              required
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
            />
          </div>
        )}
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xxxxxxxx / 06xxxxxxxx"
            dir="ltr"
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@rawdati.dz"
            dir="ltr"
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary text-right"
          />
        </div>
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            الراتب الأساسي (دينار جزائري)
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              min="0"
              step="500"
              value={salaryDzd}
              onChange={(e) => setSalaryDzd(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary pl-12"
            />
            <span className="absolute left-3 text-caption font-caption text-on-surface-variant pointer-events-none">
              دج
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
            تاريخ المباشرة
          </label>
          <input
            type="date"
            value={hiredAt}
            onChange={(e) => setHiredAt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ms-3 text-label-sm font-label-sm text-on-surface font-semibold">
              {isActive ? 'على رأس العمل (نشط)' : 'متوقف / غير نشط'}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
