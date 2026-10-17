import React, { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import { useToast } from '@/components/ui/toast'
import type { StaffMember } from '../../../lib/api/types'

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  staffMember?: StaffMember | null
}

const PRESET_ROLES = [
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

export function AddStaffModal({ isOpen, onClose, onSuccess, staffMember }: AddStaffModalProps) {
  const { toast } = useToast()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState(PRESET_ROLES[0])
  const [customRole, setCustomRole] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [salarySar, setSalarySar] = useState<string>('4500')
  const [hiredAt, setHiredAt] = useState(new Date().toISOString().slice(0, 10))
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (staffMember) {
      setFirstName(staffMember.firstName)
      setLastName(staffMember.lastName)
      if (PRESET_ROLES.includes(staffMember.role)) {
        setRole(staffMember.role)
        setCustomRole('')
      } else {
        setRole('أخرى')
        setCustomRole(staffMember.role)
      }
      setPhone(staffMember.phone ?? '')
      setEmail(staffMember.email ?? '')
      setSalarySar(String(Math.round(staffMember.salaryCents / 100)))
      setHiredAt(staffMember.hiredAt ?? new Date().toISOString().slice(0, 10))
      setIsActive(staffMember.isActive)
    } else {
      setFirstName('')
      setLastName('')
      setRole(PRESET_ROLES[0])
      setCustomRole('')
      setPhone('')
      setEmail('')
      setSalarySar('4500')
      setHiredAt(new Date().toISOString().slice(0, 10))
      setIsActive(true)
    }
  }, [staffMember, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى إدخال الاسم الأول واسم العائلة للموظف.',
        variant: 'warning'
      })
      return
    }

    const finalRole = role === 'أخرى' ? customRole.trim() : role
    if (!finalRole) {
      toast({
        title: 'المسمى الوظيفي مطلوب',
        description: 'يرجى تحديد أو كتابة المسمى الوظيفي للموظف.',
        variant: 'warning'
      })
      return
    }

    const salaryNumber = parseFloat(salarySar) || 0
    const salaryCents = Math.round(salaryNumber * 100)

    setIsSubmitting(true)
    try {
      if (staffMember) {
        await api.staff.update({
          id: staffMember.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: finalRole,
          phone: phone.trim() || null,
          email: email.trim() || null,
          salaryCents,
          hiredAt: hiredAt || null,
          isActive
        })
        toast({
          title: 'تم تحديث بيانات الموظف',
          description: `تم حفظ تعديلات ${firstName.trim()} ${lastName.trim()} بنجاح.`,
          variant: 'default'
        })
      } else {
        await api.staff.create({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: finalRole,
          phone: phone.trim() || null,
          email: email.trim() || null,
          salaryCents,
          hiredAt: hiredAt || null,
          isActive
        })
        toast({
          title: 'تم إضافة الموظف بنجاح',
          description: `تم إدراج ${firstName.trim()} ${lastName.trim()} في الكادر التعليمي والإداري.`,
          variant: 'default'
        })
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast({
        title: 'خطأ أثناء الحفظ',
        description: err.message || 'تعذر حفظ بيانات الموظف في قاعدة البيانات.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">
                {staffMember ? 'تعديل بيانات موظف' : 'تسجيل موظف أو معلمة جديدة'}
              </h2>
              <p className="text-caption font-caption text-on-surface-variant">
                سجل الموارد البشرية والكادر التعليمي والإداري
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
                الاسم الأول <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="مثال: نورة"
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
                placeholder="مثال: العتيبي"
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
                  placeholder="مثال: منسقة فعاليات"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
                />
              </div>
            )}
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
                رقم الجوال
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
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
                placeholder="teacher@rawdati.local"
                dir="ltr"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary text-right"
              />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
                الراتب الأساسي (ريال سعودي)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={salarySar}
                  onChange={(e) => setSalarySar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary pl-12"
                />
                <span className="absolute left-3 text-caption font-caption text-on-surface-variant pointer-events-none">
                  ر.س
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

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-container-high flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md font-semibold shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {staffMember ? 'save' : 'person_add'}
              </span>
              <span>{isSubmitting ? 'جاري الحفظ...' : staffMember ? 'حفظ التعديلات' : 'إضافة الموظف'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
