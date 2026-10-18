import React, { useState, useEffect } from 'react'
import type { ClassroomItem } from '../types'

interface AddEditClassroomModalProps {
  isOpen: boolean
  onClose: () => void
  classroomToEdit: ClassroomItem | null
  staffList: any[]
  onSubmit: (data: { name: string; capacity: number; room?: string | null; teacherId?: string | null }) => Promise<void>
  isSubmitting: boolean
}

export const AddEditClassroomModal: React.FC<AddEditClassroomModalProps> = ({
  isOpen,
  onClose,
  classroomToEdit,
  staffList,
  onSubmit,
  isSubmitting
}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [capacity, setCapacity] = useState(20)
  const [teacherId, setTeacherId] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (classroomToEdit) {
      setName(classroomToEdit.name)
      setRoom(classroomToEdit.room || '')
      setCapacity(classroomToEdit.capacity || 20)
      setTeacherId(classroomToEdit.teacher?.id || '')
    } else {
      setName('')
      setRoom('')
      setCapacity(20)
      setTeacherId('')
    }
    setError(null)
  }, [classroomToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('يرجى إدخال اسم الفصل')
      return
    }
    try {
      await onSubmit({
        name: name.trim(),
        room: room.trim() || null,
        capacity: Number(capacity) || 20,
        teacherId: teacherId || null
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء حفظ الفصل')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-xl border border-outline-variant/30 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high bg-surface-container-low/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                {classroomToEdit ? 'edit_note' : 'add_circle'}
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {classroomToEdit ? 'تعديل بيانات الفصل' : 'إضافة فصل دراسي جديد'}
              </h2>
              <p className="font-caption text-caption text-on-surface-variant">
                تحديد السعة والقاعة وتعيين المعلمة المشرفة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
              اسم الفصل <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: فصل الأبطال، فصل النجوم، روضة 2-A"
              className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
                رقم أو رمز القاعة
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="مثال: 101، قاعة الزهور"
                className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
                السعة القصوى للأطفال
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
              المعلمة المشرفة على الفصل
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-colors"
            >
              <option value="">-- اختاري المعلمة --</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.role || 'معلمة'})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-surface-container-high">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-lg text-label-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold transition-all shadow-xs disabled:opacity-60"
            >
              {isSubmitting && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
              <span>{classroomToEdit ? 'حفظ التعديلات' : 'إضافة الفصل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
