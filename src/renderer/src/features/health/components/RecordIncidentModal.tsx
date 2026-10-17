import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'

interface RecordIncidentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecordIncidentModal({ isOpen, onClose }: RecordIncidentModalProps) {
  const queryClient = useQueryClient()
  const now = new Date()
  const timeStr = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [childSearch, setChildSearch] = useState('')
  const [happenedAt, setHappenedAt] = useState(timeStr)
  const [description, setDescription] = useState('')
  const [actionTaken, setActionTaken] = useState('')
  const [notifiedGuardian, setNotifiedGuardian] = useState(false)

  const { data: childrenData } = useQuery({
    queryKey: ['children:list', { search: childSearch, status: 'active' }],
    queryFn: () => api.children.list({ search: childSearch, status: 'active', limit: 20 }),
    enabled: isOpen
  })

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedChildId) throw new Error('يرجى اختيار الطفل')
      if (!description.trim()) throw new Error('يرجى كتابة وصف الواقعة')
      return api.health.recordIncident({
        childId: selectedChildId,
        happenedAt,
        description,
        actionTaken: actionTaken.trim() || undefined,
        notifiedGuardian
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health:stats'] })
      queryClient.invalidateQueries({ queryKey: ['health:incidents'] })
      toast({
        title: 'تم تسجيل الواقعة',
        description: 'تم توثيق تقرير الحادث في سجل السلامة المدرسية'
      })
      onClose()
      setDescription('')
      setActionTaken('')
      setNotifiedGuardian(false)
    },
    onError: (err: any) => {
      toast({
        title: 'خطأ',
        description: err.message || 'فشل تسجيل تقرير الحادث',
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
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </div>
            <div>
              <h3 className="font-bold text-rose-950 text-base">توثيق حادث / إصابة / واقعة</h3>
              <p className="text-xs text-rose-700">تقرير السلامة المهنية والمتابعة الفورية للأولياء</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-rose-100 text-rose-800 flex items-center justify-center"
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
            <label className="block text-xs font-bold text-on-surface mb-1">الطفل المعني بالواقعة</label>
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
                      <span className="text-2xs text-on-surface-variant">{c.classroomId ? 'مسجل' : '—'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* وقت وقوع الحادث */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">تاريخ ووقت الحادث</label>
            <input
              type="text"
              required
              value={happenedAt}
              onChange={(e) => setHappenedAt(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* وصف الواقعة */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">وصف الحادث وكيفية حدوثه</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: تعثر أثناء الجري في ساحة الألعاب واصطدام الركبة بالأرضية المطاطية..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* الإجراء المتخذ */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">الإسعاف الأولي والإجراء المتخذ</label>
            <textarea
              rows={2}
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="مثال: تنظيف الموضع بمحلول مطهر ووضع ضمادة معقمة وكمادة ثلج لمدة 10 دقائق..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* إشعار ولي الأمر */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
            <input
              type="checkbox"
              id="notifiedGuardian"
              checked={notifiedGuardian}
              onChange={(e) => setNotifiedGuardian(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="notifiedGuardian" className="text-xs font-bold text-on-surface cursor-pointer">
              تم إشعار ولي الأمر هاتفياً وإحاطته بالواقعة فوراً
            </label>
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
              disabled={mutation.isPending || !selectedChildId || !description.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>حفظ تقرير الواقعة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
