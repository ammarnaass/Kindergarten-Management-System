import { useState } from 'react'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { ClassroomItem } from '@/lib/api/types'

interface EditChildModalProps {
  child: {
    id: string
    firstName: string
    lastName: string
    birthDate?: string
    gender?: 'male' | 'female'
    classroomId?: string | null
    status?: string
    allergies?: string | null
    medicalNotes?: string | null
  }
  classrooms: ClassroomItem[]
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  onDelete?: () => void
}

export function EditChildModal({
  child,
  classrooms,
  isOpen,
  onClose,
  onSaved,
  onDelete
}: EditChildModalProps) {
  const [firstName, setFirstName] = useState(child.firstName || '')
  const [lastName, setLastName] = useState(child.lastName || '')
  const [birthDate, setBirthDate] = useState(child.birthDate || '')
  const [gender, setGender] = useState<'male' | 'female'>(child.gender || 'male')
  const [classroomId, setClassroomId] = useState(child.classroomId || '')
  const [status, setStatus] = useState<'active' | 'waitlist' | 'graduated' | 'withdrawn'>(
    (child.status as any) || 'active'
  )
  const [allergies, setAllergies] = useState(child.allergies || '')
  const [medicalNotes, setMedicalNotes] = useState(child.medicalNotes || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !birthDate) {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى إدخال الاسم واللقب وتاريخ الميلاد',
        variant: 'warning',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await api.children.update({
        id: child.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate,
        gender,
        classroomId: classroomId || null,
        status,
        allergies: allergies.trim() || null,
        medicalNotes: medicalNotes.trim() || null,
      })

      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم حفظ تعديلات ملف الطفل في قاعدة البيانات',
        variant: 'success',
      })

      onSaved()
      onClose()
    } catch (err: any) {
      toast({
        title: 'فشل التحديث',
        description: err.message || 'حدث خطأ أثناء تعديل بيانات الطفل',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">edit</span>
            <h3 className="font-headline-sm font-bold text-on-surface">تعديل ملف الطفل</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                الاسم الشخصي *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                اللقب العائلي *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                تاريخ الميلاد *
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">الجنس *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                الفصل الدراسي
              </label>
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="">غير مسكن في فصل</option>
                {classrooms.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {cls.room ? `(${cls.room})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                حالة القيد
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="active">نشط ومسجل</option>
                <option value="waitlist">قائمة الانتظار</option>
                <option value="graduated">متخرج</option>
                <option value="withdrawn">منسحب</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              الحساسيات الغذائية والدوائية
            </label>
            <input
              type="text"
              placeholder="مثال: حساسية الفول السوداني، حساسية البنسلين..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              ملاحظات صحية خاصة
            </label>
            <textarea
              rows={2}
              placeholder="أي إرشادات طبية أو بروتوكول طوارئ خاص بالطفل..."
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-outline-variant/60">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onDelete()
                  }}
                  className="px-3 py-1.5 rounded-lg text-error hover:bg-error-container/30 font-label-md text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  <span>حذف ملف الطفل</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-sm hover:bg-surface-container-high transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
