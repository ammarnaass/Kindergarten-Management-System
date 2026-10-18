import React, { useState } from 'react'
import { X, UserPlus, Eye, EyeOff, Shield, School, Calculator, Badge, Lock, KeyRound } from 'lucide-react'
import type { RoleWithPermissionsItem } from '@/lib/api/types'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  roles: RoleWithPermissionsItem[]
}

const AVATAR_OPTIONS = [
  { id: 'shield_person', label: 'إدارة', icon: Shield },
  { id: 'school', label: 'تعليم', icon: School },
  { id: 'payments', label: 'محاسبة', icon: Calculator },
  { id: 'badge', label: 'كادر', icon: Badge }
]

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles
}) => {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState(roles[0]?.id || 'staff')
  const [roleTitle, setRoleTitle] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [avatarIcon, setAvatarIcon] = useState('school')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!displayName.trim()) {
      setError('يرجى إدخال الاسم الكامل للمستخدم.')
      return
    }
    if (!username.trim() || username.length < 3) {
      setError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل.')
      return
    }
    if (!password || password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 خانات على الأقل.')
      return
    }
    if (pinCode && (pinCode.length < 4 || pinCode.length > 6)) {
      setError('رمز PIN يجب أن يتكون من 4 إلى 6 أرقام.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        displayName: displayName.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, ''),
        password,
        roleId,
        roleTitle: roleTitle.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        pinCode: pinCode.trim() || undefined,
        avatarIcon,
        isActive: true
      })
    } catch (err: any) {
      setError(err?.message || 'فشل في إنشاء الحساب')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">إضافة مستخدم جديد</h3>
              <p className="text-[11px] text-muted-foreground">إنشاء حساب جديد وتعيين الصلاحيات ورمز PIN</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                الاسم الكامل <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="أ. سارة الحربي"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                اسم المستخدم <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="sarah"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                كلمة المرور <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 pl-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                رمز PIN السريع (اختياري)
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="4 إلى 6 أرقام"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                الدور الوظيفي <span className="text-destructive">*</span>
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name === 'admin'
                      ? 'مدير النظام (Admin)'
                      : r.name === 'educator'
                        ? 'معلمة / مربية (Educator)'
                        : r.name === 'accountant'
                          ? 'محاسب مالي (Accountant)'
                          : 'استقبال وكادر (Staff)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                المسمى الوظيفي الظاهر
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="معلمة فصل الزهور KG1"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">رقم الجوال</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@rawdati.local"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Avatar Icon Selector */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">الأيقونة الرمزية للحساب</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = avatarIcon === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatarIcon(opt.id)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإنشاء...' : 'حفظ وإنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
