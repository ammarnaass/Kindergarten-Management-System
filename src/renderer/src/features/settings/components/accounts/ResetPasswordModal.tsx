import React, { useState } from 'react'
import { X, Lock, Eye, EyeOff } from 'lucide-react'
import type { DetailedUserItem } from '@/lib/api/types'

interface ResetPasswordModalProps {
  user: DetailedUserItem | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, newPassword: string) => Promise<void>
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newPassword || newPassword.length < 6) {
      setError('كلمة المرور يجب ألا تقل عن 6 خانات.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(user.id, newPassword)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err?.message || 'فشل في تغيير كلمة المرور')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">تعيين كلمة مرور جديدة</h3>
              <p className="text-[11px] text-muted-foreground font-mono">@{user.username} ({user.displayName})</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              كلمة المرور الجديدة <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              تأكيد كلمة المرور <span className="text-destructive">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/60">
            سيتم تشفير كلمة المرور فوراً باستخدام خوارزمية Scrypt المحلية الآمنة.
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
              {isSubmitting ? 'جاري التحديث...' : 'حفظ كلمة المرور'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
