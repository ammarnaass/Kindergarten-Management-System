import { useState } from 'react'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'

interface AddPickupModalProps {
  childId: string
  childName?: string
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

const PRESET_RELATIONS = ['عم / عمة', 'خال / خالة', 'جد / جدة', 'سائق خاص', 'مرافق معتمد', 'أخرى']

export function AddPickupModal({
  childId,
  childName,
  isOpen,
  onClose,
  onSaved,
}: AddPickupModalProps) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [selectedRelation, setSelectedRelation] = useState('عم / عمة')
  const [customRelation, setCustomRelation] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const resetForm = () => {
    setFullName('')
    setPhone('')
    setNationalId('')
    setSelectedRelation('عم / عمة')
    setCustomRelation('')
    setNote('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى إدخال اسم الشخص المخول بالاستلام',
        variant: 'warning',
      })
      return
    }

    const relationText = selectedRelation === 'أخرى' ? customRelation.trim() : selectedRelation
    const combinedNote = [relationText, note.trim()].filter(Boolean).join(' - ')

    setIsSubmitting(true)
    try {
      await api.children.createPickup({
        childId,
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        nationalId: nationalId.trim() || null,
        note: combinedNote || null,
      })

      toast({
        title: 'تمت الإضافة بنجاح',
        description: `تم اعتماد ${fullName.trim()} ضمن قائمة المخولين باستلام الطفل`,
        variant: 'success',
      })

      resetForm()
      onSaved()
      onClose()
    } catch (err: any) {
      toast({
        title: 'فشلت إضافة المخوّل',
        description: err.message || 'حدث خطأ أثناء حفظ بيانات المخوّل في قاعدة البيانات',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">person_add</span>
            <div>
              <h3 className="font-headline-sm font-bold text-on-surface">إضافة مخوّل رسمي بالاستلام</h3>
              {childName && (
                <p className="font-caption text-xs text-on-surface-variant">
                  خاص بالطفل: <span className="font-semibold text-primary">{childName}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              الاسم الكامل للمخوّل *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="مثال: صالح بن محمد المنصور"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                رقم الهاتف المحمول
              </label>
              <input
                type="tel"
                placeholder="05xxxxxxxx"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                رقم الهوية / الإقامة
              </label>
              <input
                type="text"
                placeholder="10xxxxxxxx"
                dir="ltr"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              صلة القرابة أو الصفة
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_RELATIONS.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setSelectedRelation(rel)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors font-semibold ${
                    selectedRelation === rel
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
            {selectedRelation === 'أخرى' && (
              <input
                type="text"
                placeholder="حدد صلة القرابة أو الصفة بدقة..."
                value={customRelation}
                onChange={(e) => setCustomRelation(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              ملاحظات أمان إضافية
            </label>
            <textarea
              rows={2}
              placeholder="مثال: مخوّل باستلام الطفل أيام الخميس فقط، أو بسيارة رقم..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div className="p-3 bg-secondary-container/30 rounded-xl flex items-start gap-2 border border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">security</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              تتم مطابقة بيانات الهوية ورقم الهاتف الموثق عند بوابة الروضة الذكية أثناء وقت الانصراف.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/60">
            <button
              onClick={handleClose}
              type="button"
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-sm hover:bg-surface-container-high transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              <span>{isSubmitting ? 'جاري الاعتماد...' : 'اعتماد المخوّل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
