import React, { useState } from 'react'
import type { ClassroomStudent } from '../../types'

interface ChildQuickActionModalProps {
  student: ClassroomStudent | null
  isOpen: boolean
  onClose: () => void
  onSaveQuickLog: (data: {
    childId: string
    category: 'meal' | 'nap' | 'potty' | 'behavior' | 'activity'
    value: string
    note?: string
  }) => Promise<void>
}

export const ChildQuickActionModal: React.FC<ChildQuickActionModalProps> = ({
  student,
  isOpen,
  onClose,
  onSaveQuickLog
}) => {
  const [activeCategory, setActiveCategory] = useState<'meal' | 'nap' | 'potty' | 'behavior'>('meal')
  const [selectedValue, setSelectedValue] = useState<string>('أكل الوجبة كاملة')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !student) return null

  const categoryOptions = {
    meal: [
      { label: 'أكل الوجبة كاملة', icon: 'restaurant', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
      { label: 'أكل نصف الوجبة', icon: 'lunch_dining', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
      { label: 'لم يرغب بتناول الوجبة', icon: 'no_meals', color: 'bg-error-container text-on-error-container border-error/30' },
      { label: 'طلب وجبة بديلة خفيفة', icon: 'cookie', color: 'bg-primary/10 text-primary border-primary/30' }
    ],
    nap: [
      { label: 'نوم هادئ وعميق', icon: 'bedtime', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
      { label: 'قيلولة خفيفة متقطعة', icon: 'hotel', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
      { label: 'استرخاء دون نوم', icon: 'self_improvement', color: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30' },
      { label: 'لم ينم وظل نشطاً', icon: 'child_care', color: 'bg-surface-container-high text-on-surface border-outline-variant/30' }
    ],
    potty: [
      { label: 'استخدام الحمام بنجاح', icon: 'wc', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
      { label: 'غيار حفاض نظيف', icon: 'dry_cleaning', color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30' },
      { label: 'غيار ملابس طارئ', icon: 'checkroom', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
      { label: 'غسل اليدين والوجه', icon: 'soap', color: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30' }
    ],
    behavior: [
      { label: 'نجمة التميز والمشاركة الفعالة ⭐', icon: 'star', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
      { label: 'سلوك تعاوني ومساعدة الأصدقاء 🤝', icon: 'volunteer_activism', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
      { label: 'إبداع في الأنشطة الفنية والأركان 🎨', icon: 'palette', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30' },
      { label: 'يحتاج تشجيعاً وتهدئة إيجابية ❤️', icon: 'favorite', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' }
    ]
  }

  const handleCategoryChange = (cat: 'meal' | 'nap' | 'potty' | 'behavior') => {
    setActiveCategory(cat)
    setSelectedValue(categoryOptions[cat][0].label)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSaveQuickLog({
        childId: student.id,
        category: activeCategory,
        value: selectedValue,
        note: note.trim() || undefined
      })
      setNote('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-in">
        {/* Child Header */}
        <div className="p-5 border-b border-surface-container-high bg-surface-container-low/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {student.photoPath ? (
              <img
                src={student.photoPath}
                alt={student.firstName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary font-bold text-xl flex items-center justify-center shadow-xs">
                {student.firstName[0]}
              </div>
            )}
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {student.firstName} {student.lastName}
              </h3>
              <p className="font-caption text-caption text-primary font-semibold">
                توثيق سريع في سجل المتابعة اليومية
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

        {/* Category Tabs */}
        <div className="p-3 bg-surface-container-low border-b border-surface-container-high grid grid-cols-4 gap-1.5 text-center">
          <button
            type="button"
            onClick={() => handleCategoryChange('meal')}
            className={`py-2 rounded-xl font-label-md text-label-md flex flex-col items-center gap-1 transition-all ${
              activeCategory === 'meal'
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            <span>الوجبة</span>
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('nap')}
            className={`py-2 rounded-xl font-label-md text-label-md flex flex-col items-center gap-1 transition-all ${
              activeCategory === 'nap'
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bedtime</span>
            <span>القيلولة</span>
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('potty')}
            className={`py-2 rounded-xl font-label-md text-label-md flex flex-col items-center gap-1 transition-all ${
              activeCategory === 'potty'
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">wc</span>
            <span>الحمام</span>
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('behavior')}
            className={`py-2 rounded-xl font-label-md text-label-md flex flex-col items-center gap-1 transition-all ${
              activeCategory === 'behavior'
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span>التميز</span>
          </button>
        </div>

        {/* Options List */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            {categoryOptions[activeCategory].map((opt) => {
              const isSelected = selectedValue === opt.label
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedValue(opt.label)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all active:scale-[0.98] ${
                    isSelected
                      ? `${opt.color} ring-2 ring-primary font-bold shadow-2xs`
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                    <span className="font-label-lg text-label-lg">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick Note */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
              ملاحظة إضافية (اختياري)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: كان سعيداً بمشاركة زميله، طلب شرب الماء..."
              className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-body-sm border border-outline-variant/40 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-lg text-label-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold transition-all shadow-xs disabled:opacity-60"
            >
              {isSubmitting && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
              <span>حفظ في السجل اليومي</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
