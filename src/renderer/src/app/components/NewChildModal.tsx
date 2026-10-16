import { useState, useEffect } from 'react'
import { ipc } from '@/lib/ipc'
import { useQueryClient } from '@tanstack/react-query'

interface NewChildModalProps {
  open: boolean
  onClose: () => void
}

export function NewChildModal({ open, onClose }: NewChildModalProps) {
  const qc = useQueryClient()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('2022-01-01')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [classroomId, setClassroomId] = useState('')
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [allergies, setAllergies] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      ipc<any[]>('classrooms:list')
        .then((data) => {
          if (data) setClassrooms(data)
        })
        .catch(() => {})
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError('يرجى ملء الاسم واللقب')
      return
    }
    setLoading(true)
    setError('')
    try {
      await ipc('children:create', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate,
        gender,
        classroomId: classroomId || undefined,
        allergies: allergies.trim() || undefined,
        medicalNotes: medicalNotes.trim() || undefined,
        status: 'active'
      })
      qc.invalidateQueries({ queryKey: ['children'] })
      qc.invalidateQueries({ queryKey: ['children-count'] })
      setFirstName('')
      setLastName('')
      setClassroomId('')
      setAllergies('')
      setMedicalNotes('')
      onClose()
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء التسجيل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 select-none animate-toast-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">person_add</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              تسجيل طفل جديد في الروضة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-space-sm p-2 rounded-lg bg-error-container text-on-error-container font-caption text-caption">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                الاسم الأول:
              </label>
              <input
                required
                className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="مثال: يوسف"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                اسم العائلة (اللقب):
              </label>
              <input
                required
                className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="مثال: بن خالد"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                تاريخ الميلاد:
              </label>
              <input
                type="date"
                required
                className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                الجنس:
              </label>
              <select
                className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
              الفصل / الفوج الدراسي:
            </label>
            <select
              className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
            >
              <option value="">بدون تسكين (تحديد لاحقاً)</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.room ? `(${c.room})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
              تنبيهات الحساسية الطبية (إن وجدت):
            </label>
            <input
              className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="مثال: حساسية الفول السوداني أو البنسلين"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
              ملاحظات صحية أو بروتوكول طوارئ:
            </label>
            <textarea
              rows={2}
              className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="مثال: بخاخ فنتولين متوافر بالحقيبة"
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-space-lg py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-xs"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ وتسجيل الطفل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
