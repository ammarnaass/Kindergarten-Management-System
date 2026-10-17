import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'

interface RecordMedicationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecordMedicationModal({ isOpen, onClose }: RecordMedicationModalProps) {
  const queryClient = useQueryClient()
  const now = new Date()
  const timeStr = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [childSearch, setChildSearch] = useState('')
  const [medicine, setMedicine] = useState('')
  const [dose, setDose] = useState('')
  const [givenAt, setGivenAt] = useState(timeStr)
  const [givenBy, setGivenBy] = useState('ممرضة الروضة المناوبة')

  const { data: childrenData } = useQuery({
    queryKey: ['children:list', { search: childSearch, status: 'active' }],
    queryFn: () => api.children.list({ search: childSearch, status: 'active', limit: 20 }),
    enabled: isOpen
  })

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedChildId) throw new Error('يرجى اختيار الطفل')
      if (!medicine.trim()) throw new Error('يرجى كتابة اسم الدواء')
      return api.health.recordMedication({
        childId: selectedChildId,
        medicine,
        dose: dose.trim() || undefined,
        givenAt,
        givenBy: givenBy.trim() || undefined
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health:stats'] })
      queryClient.invalidateQueries({ queryKey: ['health:medications'] })
      toast({
        title: 'تم تسجيل إعطاء الدواء',
        description: 'تم توثيق الجرعة الطبية في سجل العيادة'
      })
      onClose()
      setMedicine('')
      setDose('')
    },
    onError: (err: any) => {
      toast({
        title: 'خطأ',
        description: err.message || 'فشل تسجيل إعطاء الدواء',
        variant: 'destructive'
      })
    }
  })

  if (!isOpen) return null

  const children = childrenData?.items ?? []
  const selectedChild = children.find((c) => c.id === selectedChildId)

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-secondary-fixed/40 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">medication</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">تسجيل إعطاء دواء بتفويض</h3>
              <p className="text-xs text-on-surface-variant">توثيق الجرعة المعتمدة ومطابقة تعليمات ولي الأمر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className="p-6 space-y-4"
        >
          {/* اختيار الطفل */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">الطفل المتلقي للجرعة</label>
            {selectedChild ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary-fixed/30 border border-primary text-xs">
                <span className="font-bold text-on-surface">
                  {selectedChild.firstName} {selectedChild.lastName}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedChildId('')}
                  className="text-primary hover:underline font-bold"
                >
                  تغيير
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="ابحث بالاسم لتحديد الطفل..."
                  value={childSearch}
                  onChange={(e) => setChildSearch(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {children.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedChildId(c.id)}
                      className="w-full text-right p-2 rounded-lg hover:bg-surface-container text-xs font-semibold flex items-center justify-between"
                    >
                      <span>{c.firstName} {c.lastName}</span>
                      <span className="text-2xs text-on-surface-variant">{c.medicalNotes || 'سليم'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* اسم الدواء والجرعة */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">اسم الدواء</label>
              <input
                type="text"
                required
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                placeholder="مثال: باراسيتامول، فينتولين..."
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">الجرعة المعطاة</label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="مثال: 5 مل، ملعقة صغيرة، بختين..."
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* وقت الإعطاء والمسؤول */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">وقت وتاريخ الإعطاء</label>
              <input
                type="text"
                required
                value={givenAt}
                onChange={(e) => setGivenAt(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">المسؤول عن الإعطاء</label>
              <input
                type="text"
                value={givenBy}
                onChange={(e) => setGivenBy(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !selectedChildId || !medicine.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>توثيق الجرعة في السجل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
