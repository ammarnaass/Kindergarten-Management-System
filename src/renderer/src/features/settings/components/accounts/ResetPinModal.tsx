import React, { useState } from 'react'
import { X, KeyRound, Trash2 } from 'lucide-react'
import type { DetailedUserItem } from '@/lib/api/types'

interface ResetPinModalProps {
  user: DetailedUserItem | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, newPin: string | null) => Promise<void>
}

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [pin, setPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (pin.length < 4 || pin.length > 6) {
      setError('رمز PIN يجب أن يتكون من 4 إلى 6 أرقام.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(user.id, pin)
      setPin('')
    } catch (err: any) {
      setError(err?.message || 'فشل في تحديث رمز PIN')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearPin = async () => {
    if (!window.confirm(`هل أنت متأكد من إلغاء تفعيل رمز PIN للمستخدم @${user.username}؟`)) {
      return
    }
    setIsSubmitting(true)
    try {
      await onSubmit(user.id, null)
      setPin('')
    } catch (err: any) {
      setError(err?.message || 'فشل في إلغاء رمز PIN')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">رمز PIN للدخول السريع</h3>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground mb-1 text-center">
              أدخل رمز PIN الجديد (4 إلى 6 أرقام)
            </label>
            <input
              type="password"
              autoFocus
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-xl font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="text-[11px] text-muted-foreground text-center">
            يُستخدم رمز PIN للتبديل السريع بين المستخدمين عند بوابات الاستلام الآمن.
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            {user.hasPin ? (
              <button
                type="button"
                onClick={handleClearPin}
                disabled={isSubmitting}
                className="flex items-center gap-1 text-[11px] font-bold text-destructive hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إلغاء تفعيل الـ PIN</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting || pin.length < 4}
                className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الرمز'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
