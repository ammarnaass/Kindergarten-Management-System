import { useState, useEffect } from 'react'
import { api, type ChildItem } from '@/lib/api'

interface AddGuardianModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  childrenList: ChildItem[]
}

export function AddGuardianModal({ isOpen, onClose, onSuccess, childrenList }: AddGuardianModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')
  const [relation, setRelation] = useState('أب')
  const [isPrimary, setIsPrimary] = useState(true)
  const [canPickup, setCanPickup] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFirstName('')
      setLastName('')
      setPhone('')
      setNationalId('')
      setEmail('')
      setAddress('')
      setSelectedChildId(childrenList[0]?.id || '')
      setRelation('أب')
      setIsPrimary(true)
      setCanPickup(true)
      setError(null)
    }
  }, [isOpen, childrenList])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError('يرجى ملء الاسم الأول واسم العائلة ورقم الجوال.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const guardian = await api.guardians.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        nationalId: nationalId.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
      })

      if (guardian?.id && selectedChildId) {
        await api.guardians.linkChild({
          childId: selectedChildId,
          guardianId: guardian.id,
          relation,
          isPrimary,
          canPickup,
        })
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء حفظ ولي الأمر')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low/80 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">تسجيل ولي أمر جديد</h2>
              <p className="text-body-sm text-on-surface-variant">إضافة وتوثيق بيانات ولي الأمر أو المستلم المفوض</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-error-container/40 text-error text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">
                الاسم الأول <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="مثال: فيصل بن عبد الله"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">
                اسم العائلة <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="مثال: العتيبي"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">
                رقم الجوال <span className="text-error">*</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full px-3 py-2 text-right rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">
                رقم الهوية الوطنية / الإقامة
              </label>
              <input
                type="text"
                dir="ltr"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="10xxxxxxxx"
                className="w-full px-3 py-2 text-right rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-right rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">العنوان السكني</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: حي النرجس، شارع 14"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Child Link Section */}
          <div className="pt-3 border-t border-outline-variant/20">
            <h3 className="text-label-lg font-bold text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">child_care</span>
              ربط بطفل مسجل
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">اختر الطفل</label>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">بدون ربط الآن</option>
                  {childrenList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">صلة القرابة</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="أب (ولي شرعي)">أب (ولي شرعي)</option>
                  <option value="أم">أم</option>
                  <option value="جد / جدة">جد / جدة</option>
                  <option value="عم / عمة">عم / عمة</option>
                  <option value="خال / خالة">خال / خالة</option>
                  <option value="سائق خاص">سائق خاص</option>
                  <option value="مفوض خارجي">مفوض خارجي</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-body-sm text-on-surface">ولي الأمر الأساسي</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canPickup}
                  onChange={(e) => setCanPickup(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-body-sm text-on-surface">مصرح له باستلام الطفل</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-label-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-label-lg font-medium shadow-sm flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
              <span>حفظ ولي الأمر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
