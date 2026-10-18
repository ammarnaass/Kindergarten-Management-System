import React, { useState } from 'react'
import { api } from '../../../lib/api'
import { useToast } from '@/components/ui/toast'
import type { StaffMember } from '../../../lib/api/types'

interface RecordLeaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  staffList: StaffMember[]
}

export function RecordLeaveModal({ isOpen, onClose, onSuccess, staffList }: RecordLeaveModalProps) {
  const { toast } = useToast()
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id ?? '')
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10))
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10))
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('approved')
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    if (!selectedStaffId && staffList.length > 0) {
      setSelectedStaffId(staffList[0].id)
    }
  }, [staffList, selectedStaffId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStaffId) {
      toast({
        title: 'اختر الموظف',
        description: 'يرجى تحديد الموظف أو المعلمة لتوثيق الإجازة.',
        variant: 'warning'
      })
      return
    }

    if (fromDate > toDate) {
      toast({
        title: 'تاريخ غير منطقي',
        description: 'تاريخ بداية الإجازة يجب أن يسبق أو يوافق تاريخ نهايتها.',
        variant: 'warning'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await api.staff.createLeave({
        staffId: selectedStaffId,
        fromDate,
        toDate,
        reason: reason.trim() || null,
        status
      })

      toast({
        title: 'تم توثيق الإجازة بنجاح',
        description: `تم إدراج الإجازة من ${fromDate} إلى ${toDate} للموظف المحدد.`,
        variant: 'default'
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      toast({
        title: 'خطأ في التوثيق',
        description: err.message || 'تعذر توثيق الإجازة في قاعدة البيانات.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">event_busy</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">
                توثيق إجازة أو استئذان كادر
              </h2>
              <p className="text-caption font-caption text-on-surface-variant">
                سجل الإجازات الرسمية والمرضية والاضطرارية
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
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
              الموظف / المعلمة <span className="text-error">*</span>
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} — ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
                من تاريخ <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
                إلى تاريخ <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
              سبب الإجازة / الملاحظات
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: إجازة اضطرارية، مرافقة مريض، إجازة سنوية..."
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface text-body-md focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1 font-semibold">
              حالة الاعتماد
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-body-md text-on-surface">
                <input
                  type="radio"
                  name="status"
                  value="approved"
                  checked={status === 'approved'}
                  onChange={() => setStatus('approved')}
                  className="text-primary focus:ring-primary"
                />
                <span>معتمدة فوراً</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-body-md text-on-surface">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={status === 'pending'}
                  onChange={() => setStatus('pending')}
                  className="text-primary focus:ring-primary"
                />
                <span>قيد الانتظار والمراجعة</span>
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
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors font-label-md text-label-md font-semibold shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{isSubmitting ? 'جاري الحفظ...' : 'اعتماد وتوثيق الإجازة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
