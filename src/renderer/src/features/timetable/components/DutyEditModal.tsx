import React, { useState, useEffect } from 'react'
import type { StaffDuty, DutyLocation } from '../types'
import type { StaffMember } from '@/lib/api/types'

interface DutyEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialDuty?: StaffDuty | null
  staffList: StaffMember[]
  defaultDayOfWeek: number
}

const DUTY_LOCATIONS: { id: DutyLocation; label: string; icon: string; defaultTimes: [string, string] }[] = [
  { id: 'main_gate', label: 'بوابة الدخول والاستقبال الصباحي', icon: 'sensor_door', defaultTimes: ['07:30', '08:15'] },
  { id: 'dining_hall', label: 'قاعة الطعام والإشراف على الوجبة', icon: 'restaurant', defaultTimes: ['09:30', '10:15'] },
  { id: 'playground', label: 'ساحة الألعاب والملعب الخارجي', icon: 'sports_soccer', defaultTimes: ['11:00', '11:45'] },
  { id: 'bus_zone', label: 'منطقة الحافلات وبوابة الانصراف', icon: 'directions_bus', defaultTimes: ['13:15', '14:00'] },
  { id: 'corridors', label: 'ممرات الفصول والمرافق العامة', icon: 'hallway', defaultTimes: ['08:15', '13:15'] }
]

export function DutyEditModal({
  isOpen,
  onClose,
  onSave,
  initialDuty,
  staffList,
  defaultDayOfWeek
}: DutyEditModalProps) {
  const [staffId, setStaffId] = useState('')
  const [dutyLocation, setDutyLocation] = useState<DutyLocation>('main_gate')
  const [dayOfWeek, setDayOfWeek] = useState<number>(defaultDayOfWeek)
  const [startTime, setStartTime] = useState('07:30')
  const [endTime, setEndTime] = useState('08:15')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialDuty) {
      setStaffId(initialDuty.staffId)
      setDutyLocation((initialDuty.dutyLocation as DutyLocation) || 'main_gate')
      setDayOfWeek(initialDuty.dayOfWeek)
      setStartTime(initialDuty.startTime)
      setEndTime(initialDuty.endTime)
      setNotes(initialDuty.notes || '')
    } else {
      setStaffId(staffList[0]?.id || '')
      setDutyLocation('main_gate')
      setDayOfWeek(defaultDayOfWeek)
      setStartTime('07:30')
      setEndTime('08:15')
      setNotes('')
    }
  }, [initialDuty, defaultDayOfWeek, staffList, isOpen])

  if (!isOpen) return null

  const handleLocationChange = (loc: DutyLocation) => {
    setDutyLocation(loc)
    const match = DUTY_LOCATIONS.find((d) => d.id === loc)
    if (match && !initialDuty) {
      setStartTime(match.defaultTimes[0])
      setEndTime(match.defaultTimes[1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffId) return

    setSaving(true)
    const staffObj = staffList.find((s) => s.id === staffId)
    const staffName = staffObj ? `${staffObj.firstName} ${staffObj.lastName}` : ''

    try {
      await onSave({
        id: initialDuty?.id,
        staffId,
        staffName,
        dutyLocation,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        notes: notes.trim() || null
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
            </div>
            <div>
              <h3 className="font-bold text-title-md text-on-surface">
                {initialDuty ? 'تعديل مهمة مناوبة' : 'تكليف بمهمة مناوبة جديدة'}
              </h3>
              <p className="text-caption text-on-surface-variant">جدول إشراف الكادر اليومي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Staff Member */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1">
              الموظفة أو المشرفة المسؤولة:
            </label>
            <select
              required
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
            >
              <option value="" disabled>اختر الموظفة للمناوبة...</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.role})
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1">
              موقع المناوبة والإشراف:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {DUTY_LOCATIONS.map((loc) => (
                <label
                  key={loc.id}
                  onClick={() => handleLocationChange(loc.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    dutyLocation === loc.id
                      ? 'bg-primary/10 border-primary text-primary font-bold'
                      : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{loc.icon}</span>
                  <span className="text-body-sm flex-1">{loc.label}</span>
                  <span className="font-mono text-caption text-on-surface-variant">
                    {loc.defaultTimes[0]} - {loc.defaultTimes[1]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1">
              يوم المناوبة:
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
            >
              <option value={0}>الأحد</option>
              <option value={1}>الاثنين</option>
              <option value={2}>الثلاثاء</option>
              <option value={3}>الأربعاء</option>
              <option value={4}>الخميس</option>
            </select>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                من الساعة:
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-md text-on-surface font-mono border border-outline-variant/30"
              />
            </div>
            <div>
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                إلى الساعة:
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-md text-on-surface font-mono border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1">
              توجيهات وملاحظات:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: ارتداء السترة الفسفورية، اصطحاب جهاز اللاسلكي..."
              className="w-full h-11 bg-surface-container px-3.5 rounded-xl text-body-sm text-on-surface border border-outline-variant/30"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold text-label-md transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={saving || !staffId}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-label-md flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              {saving ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              )}
              <span>حفظ التكليف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
