import React, { useState, useEffect } from 'react'
import { X, Edit2, Shield, School, Calculator, Badge } from 'lucide-react'
import type { DetailedUserItem, RoleWithPermissionsItem } from '@/lib/api/types'

interface EditUserModalProps {
  user: DetailedUserItem | null
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

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  roles
}) => {
  const [displayName, setDisplayName] = useState('')
  const [roleId, setRoleId] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [avatarIcon, setAvatarIcon] = useState('school')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName)
      setRoleId(user.roleId || roles[0]?.id || '')
      setRoleTitle(user.roleTitle || '')
      setPhone(user.phone || '')
      setEmail(user.email || '')
      setAvatarIcon(user.avatarIcon || 'school')
      setIsActive(user.isActive)
      setError(null)
    }
  }, [user, roles])

  if (!isOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!displayName.trim()) {
      setError('يرجى إدخال الاسم الكامل للمستخدم.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        id: user.id,
        displayName: displayName.trim(),
        roleId,
        roleTitle: roleTitle.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        avatarIcon,
        isActive
      })
    } catch (err: any) {
      setError(err?.message || 'فشل في تحديث الحساب')
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
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">تعديل بيانات الحساب</h3>
              <p className="text-[11px] text-muted-foreground font-mono">@{user.username}</p>
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1">
                الاسم الكامل <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
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
                المسمى الوظيفي
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">رقم الجوال</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          {/* Status Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-xs font-semibold text-foreground">الحساب نشط ومفعل لتسجيل الدخول</span>
            </label>
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
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
