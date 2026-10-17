import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { ChildItem } from '@/lib/api/types'

interface RecordClinicVisitModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecordClinicVisitModal({ isOpen, onClose }: RecordClinicVisitModalProps) {
  const queryClient = useQueryClient()
  const todayStr = new Date().toISOString().slice(0, 10)

  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [childSearch, setChildSearch] = useState('')
  const [recordedOn, setRecordedOn] = useState(todayStr)
  const [kind, setKind] = useState('clinic_visit')
  const [detail, setDetail] = useState('')

  const { data: childrenData } = useQuery({
    queryKey: ['children:list', { search: childSearch, status: 'active' }],
    queryFn: () => api.children.list({ search: childSearch, status: 'active', limit: 20 }),
    enabled: isOpen
  })

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedChildId) throw new Error('يرجى اختيار الطفل')
      if (!detail.trim()) throw new Error('يرجى كتابة تفاصيل المراجعة')
      return api.health.recordClinicVisit({
        childId: selectedChildId,
        kind,
        detail,
        recordedOn
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health:stats'] })
      queryClient.invalidateQueries({ queryKey: ['health:clinicVisits'] })
      toast({
        title: 'تم تسجيل المراجعة',
        description: 'تم توثيق مراجعة العيادة في السجل الطبي بنجاح'
      })
      onClose()
      setDetail('')
    },
    onError: (err: any) => {
      toast({
        title: 'خطأ',
        description: err.message || 'فشل تسجيل مراجعة العيادة',
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
        <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">medical_services</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">تسجيل مراجعة للعيادة المدرسية</h3>
              <p className="text-xs text-on-surface-variant">توثيق الفحص، قياس الحرارة، أو الإسعاف الأولي</p>
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
            <label className="block text-xs font-bold text-on-surface mb-1">اختيار الطفل</label>
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
                      <span className="text-2xs text-on-surface-variant">{c.allergies ? `حساسية: ${c.allergies}` : 'سليم'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* نوع المراجعة والتاريخ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">نوع المراجعة</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="clinic_visit">فحص عيادة عام</option>
                <option value="temperature_check">قياس درجة الحرارة</option>
                <option value="first_aid">إسعاف أولي طارئ</option>
                <option value="routine_check">كشف صحي روتيني</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">تاريخ المراجعة</label>
              <input
                type="date"
                value={recordedOn}
                onChange={(e) => setRecordedOn(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* تفاصيل المراجعة */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              الأعراض الملاحظة والإجراء الطبي المتخذ
            </label>
            <textarea
              rows={3}
              required
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="مثال: قياس حرارة 37.8، وضع كمادة باردة، إراحة الطفل في العيادة لمدة 30 دقيقة والاتصال بالأم..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
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
              disabled={mutation.isPending || !selectedChildId || !detail.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>اعتماد السجل في العيادة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
