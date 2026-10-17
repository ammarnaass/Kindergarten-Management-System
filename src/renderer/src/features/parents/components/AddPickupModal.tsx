import { useState, useEffect } from 'react'
import { api, type ChildItem } from '@/lib/api'

interface AddPickupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  childrenList: ChildItem[]
  defaultChildId?: string
}

export function AddPickupModal({
  isOpen,
  onClose,
  onSuccess,
  childrenList,
  defaultChildId,
}: AddPickupModalProps) {
  const [selectedChildId, setSelectedChildId] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [note, setNote] = useState('ساري حتى نهاية الفصل الدراسي')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedChildId(defaultChildId || childrenList[0]?.id || '')
      setFullName('')
      setPhone('')
      setNationalId('')
      setNote('ساري حتى نهاية الفصل الدراسي')
      setError(null)
    }
  }, [isOpen, defaultChildId, childrenList])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChildId) {
      setError('يرجى اختيار الطفل المعني بالتفويض.')
      return
    }
    if (!fullName.trim()) {
      setError('يرجى كتابة الاسم الكامل للمستلم المفوض.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await api.children.createPickup({
        childId: selectedChildId,
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        nationalId: nationalId.trim() || null,
        note: note.trim() || null,
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء إضافة المفوض بالاستلام')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-surface-container-low/80 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">إضافة مفوض بالاستلام</h2>
              <p className="text-body-sm text-on-surface-variant">تسجيل وتفويض شخص رسمي لاصطحاب الطفل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-error-container/40 text-error text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-label-md font-medium text-on-surface mb-1">
              الطفل المعني <span className="text-error">*</span>
            </label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              {childrenList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface mb-1">
              اسم الشخص المفوض بالكامل <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: مشعل بن عبد الله العتيبي / السائق محمد"
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">رقم الجوال</label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full px-3 py-2 text-right rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1">الهوية / الإقامة</label>
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

          <div>
            <label className="block text-label-md font-medium text-on-surface mb-1">
              ملاحظة التفويض وشروطه
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: سائق خاص - مشروط بالرمز QR / العم - تفويض موسمي"
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

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
              <span>تأكيد وحفظ التفويض</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
