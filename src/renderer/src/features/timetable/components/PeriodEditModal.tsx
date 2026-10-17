import React, { useState, useEffect } from 'react'
import type { TimetablePeriod } from '../types'
import type { StaffMember, ClassroomItem } from '@/lib/api/types'

interface PeriodEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialPeriod?: TimetablePeriod | null
  staffList: StaffMember[]
  classrooms: ClassroomItem[]
  defaultClassroomId?: string | null
}

const PRESET_COLORS = [
  '#0284c7', // Sky Blue
  '#059669', // Emerald Green
  '#2563eb', // Royal Blue
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#16a34a', // Grass Green
  '#0891b2', // Teal
  '#db2777', // Pink
  '#dc2626', // Red
  '#ea580c'  // Orange
]

const PRESET_ICONS = [
  'meeting_room',
  'flag',
  'menu_book',
  'restaurant',
  'extension',
  'sports_soccer',
  'psychology',
  'auto_stories',
  'sensor_door',
  'palette',
  'music_note',
  'bed'
]

export function PeriodEditModal({
  isOpen,
  onClose,
  onSave,
  initialPeriod,
  staffList,
  classrooms,
  defaultClassroomId
}: PeriodEditModalProps) {
  const [title, setTitle] = useState('')
  const [periodNumber, setPeriodNumber] = useState(1)
  const [category, setCategory] = useState('circle')
  const [startTime, setStartTime] = useState('08:45')
  const [endTime, setEndTime] = useState('09:30')
  const [color, setColor] = useState('#0284c7')
  const [icon, setIcon] = useState('menu_book')
  const [supervisorStaffId, setSupervisorStaffId] = useState<string>('')
  const [classroomId, setClassroomId] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialPeriod) {
      setTitle(initialPeriod.title)
      setPeriodNumber(initialPeriod.periodNumber)
      setCategory(initialPeriod.category)
      setStartTime(initialPeriod.startTime)
      setEndTime(initialPeriod.endTime)
      setColor(initialPeriod.color || '#0284c7')
      setIcon(initialPeriod.icon || 'schedule')
      setSupervisorStaffId(initialPeriod.supervisorStaffId || '')
      setClassroomId(initialPeriod.classroomId || '')
      setNotes(initialPeriod.notes || '')
    } else {
      setTitle('')
      setPeriodNumber(1)
      setCategory('circle')
      setStartTime('08:00')
      setEndTime('08:45')
      setColor('#0284c7')
      setIcon('menu_book')
      setSupervisorStaffId('')
      setClassroomId(defaultClassroomId || '')
      setNotes('')
    }
  }, [initialPeriod, defaultClassroomId, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supervisor = staffList.find((s) => s.id === supervisorStaffId)
    const supervisorStaffName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : null

    try {
      await onSave({
        id: initialPeriod?.id,
        periodNumber: Number(periodNumber),
        title: title.trim(),
        category,
        startTime,
        endTime,
        color,
        icon,
        supervisorStaffId: supervisorStaffId || null,
        supervisorStaffName,
        classroomId: classroomId || null,
        notes: notes.trim() || null,
        isActive: true
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div>
              <h3 className="font-bold text-title-md text-on-surface">
                {initialPeriod ? 'تعديل الفترة الزمنية' : 'إضافة فترة زمنية جديدة'}
              </h3>
              <p className="text-caption text-on-surface-variant">برنامج اليوم الدراسي للروضة</p>
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Period Title & Number */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                رقم الفترة:
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={periodNumber}
                onChange={(e) => setPeriodNumber(Number(e.target.value))}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-md text-on-surface text-center font-mono focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                عنوان النشاط أو الحصة:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: حلقة التعلم الأولى، وجبة الإفطار..."
                className="w-full h-11 bg-surface-container px-3.5 rounded-xl text-body-md text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Timing: Start and End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                وقت البدء (HH:MM):
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-md text-on-surface font-mono focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
              />
            </div>

            <div>
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                وقت الانتهاء (HH:MM):
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-md text-on-surface font-mono focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Category & Classroom Assignment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                تصنيف الفترة:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
              >
                <option value="arrival">استقبال وتجمع صباحي</option>
                <option value="assembly">طابور الصباح والنشيد</option>
                <option value="circle">حلقة تعلم معرفية</option>
                <option value="meal">وجبة إفطار صحية</option>
                <option value="play">أركان ولعب موجه</option>
                <option value="outdoor">لعب خارجي وحركي</option>
                <option value="nap">قيلولة وراحة (حضانة)</option>
                <option value="closing">لقاء ختامي وقصة</option>
                <option value="pickup">انصراف وبوابة الاستلام</option>
                <option value="custom">نشاط إضافي مخصص</option>
              </select>
            </div>

            <div>
              <label className="block text-label-sm font-semibold text-on-surface mb-1">
                نطاق الجدول:
              </label>
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
              >
                <option value="">عام لكافة فصول الروضة</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    مخصص لـ {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Supervisor Staff */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1">
              المعلمة أو المشرفة المسؤولة:
            </label>
            <select
              value={supervisorStaffId}
              onChange={(e) => setSupervisorStaffId(e.target.value)}
              className="w-full h-11 bg-surface-container px-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
            >
              <option value="">معلمة الفصل الأساسية</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.role})
                </option>
              ))}
            </select>
          </div>

          {/* Color & Icon Picker */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1.5">
              اللون والأيقونة المميزة:
            </label>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-primary ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {PRESET_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-xl text-on-surface transition-all shrink-0 ${
                    icon === ic
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-1">
              ملاحظات وتوجيهات النشاط:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توجيهات للمعلمة، تجهيزات مطلوبة، أو أهداف النشاط..."
              className="w-full bg-surface-container p-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 resize-none"
            />
          </div>

          {/* Submit & Cancel */}
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
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-label-md flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              {saving ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              <span>حفظ الفترة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
