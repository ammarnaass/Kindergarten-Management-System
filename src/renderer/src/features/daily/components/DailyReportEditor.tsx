import React from 'react'
import type { DailyClassroomChild, DailyReportFormState, MoodType, FoodValue, NapValue } from '../types'

interface DailyReportEditorProps {
  activeChild: DailyClassroomChild | null
  selectedDate: string
  form: DailyReportFormState
  isSaving: boolean
  onSave: () => void
  onMoodChange: (m: MoodType) => void
  onBreakfastValueChange: (v: FoodValue) => void
  onBreakfastNoteChange: (n: string) => void
  onLunchValueChange: (v: FoodValue) => void
  onLunchNoteChange: (n: string) => void
  onSnackNoteChange: (n: string) => void
  onNapValueChange: (v: NapValue) => void
  onNapTimeChange: (t: string) => void
  onActivitiesChange: (a: string) => void
  onTeacherNoteChange: (n: string) => void
  onGuardianNoticeChange: (n: string) => void
}

export const DailyReportEditor: React.FC<DailyReportEditorProps> = ({
  activeChild,
  selectedDate,
  form,
  isSaving,
  onSave,
  onMoodChange,
  onBreakfastValueChange,
  onBreakfastNoteChange,
  onLunchValueChange,
  onLunchNoteChange,
  onSnackNoteChange,
  onNapValueChange,
  onNapTimeChange,
  onActivitiesChange,
  onTeacherNoteChange,
  onGuardianNoticeChange
}) => {
  if (!activeChild) {
    return (
      <div className="lg:col-span-8 p-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">child_care</span>
        <p className="font-bold text-on-surface text-base">اختر طفلاً من القائمة لبدء التقرير اليومي</p>
        <p className="text-xs text-on-surface-variant mt-1">
          يمكنك توثيق الوجبات والقيلولة والملاحظات وحفظها فوراً في قاعدة البيانات المحلية
        </p>
      </div>
    )
  }

  return (
    <div className="lg:col-span-8 flex flex-col gap-4">
      {/* 1. Active Child Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-xs">
            {activeChild.firstName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-on-surface text-base">
                {activeChild.firstName} {activeChild.lastName}
              </h2>
              {form.isSaved && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-2xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check</span>
                  محفوظ
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
              <span>الفصل: <strong>روضتي</strong></span>
              <span>•</span>
              <span>التاريخ: <strong>{selectedDate}</strong></span>
              {activeChild.allergies && (
                <>
                  <span>•</span>
                  <span className="text-rose-600 font-bold">
                    حساسية: {activeChild.allergies}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              <span>حفظ التقرير (F10)</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Mood Selection */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-on-surface">الحالة المزاجية للطفل اليوم</span>
          <span className="text-2xs text-on-surface-variant">انطباع المعلمة والمشرفة</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(
            [
              { id: 'happy', icon: 'sentiment_very_satisfied', label: 'سعيد ومبتهج', color: 'text-emerald-600' },
              { id: 'calm', icon: 'sentiment_satisfied', label: 'هادئ ومستقر', color: 'text-blue-600' },
              { id: 'active', icon: 'bolt', label: 'نشيط ومتحمس', color: 'text-amber-600' },
              { id: 'tired', icon: 'bedtime', label: 'متعب / نعسان', color: 'text-indigo-600' },
              { id: 'fussy', icon: 'sentiment_dissatisfied', label: 'متقلب المزاج', color: 'text-rose-600' }
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onMoodChange(m.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                form.mood === m.id
                  ? 'bg-primary-fixed/40 border-primary shadow-xs'
                  : 'bg-surface-container-low hover:bg-surface-container border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${m.color} mb-1`}>
                {m.icon}
              </span>
              <span className="font-bold text-2xs text-on-surface">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Nutrition & Meals */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <span className="material-symbols-outlined text-lg">restaurant</span>
          <span>سجل الوجبات والتغذية المدرسية</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Breakfast */}
          <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2">
            <span className="font-bold text-xs text-on-surface">وجبة الإفطار (09:00 ص)</span>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { id: 'full', label: 'كاملة 💯' },
                  { id: 'half', label: 'نصفها 🥣' },
                  { id: 'none', label: 'لم يرغب ❌' }
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onBreakfastValueChange(opt.id)}
                  className={`py-1 px-1.5 rounded-lg text-2xs font-bold transition-all ${
                    form.breakfastValue === opt.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.breakfastNote}
              onChange={(e) => onBreakfastNoteChange(e.target.value)}
              placeholder="ملاحظة حول الإفطار..."
              className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Lunch */}
          <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2">
            <span className="font-bold text-xs text-on-surface">وجبة الغداء (12:00 م)</span>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { id: 'full', label: 'كاملة 💯' },
                  { id: 'half', label: 'نصفها 🥣' },
                  { id: 'none', label: 'لم يرغب ❌' }
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onLunchValueChange(opt.id)}
                  className={`py-1 px-1.5 rounded-lg text-2xs font-bold transition-all ${
                    form.lunchValue === opt.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.lunchNote}
              onChange={(e) => onLunchNoteChange(e.target.value)}
              placeholder="ملاحظة حول الغداء..."
              className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Snack */}
        <div className="flex items-center gap-2 bg-surface-container-low p-2.5 rounded-xl">
          <span className="material-symbols-outlined text-base text-secondary">lunch_dining</span>
          <span className="font-bold text-xs text-on-surface whitespace-nowrap">سناك العصر:</span>
          <input
            type="text"
            value={form.snackNote}
            onChange={(e) => onSnackNoteChange(e.target.value)}
            placeholder="مثال: تفاح طازج وعصير طبيعي..."
            className="w-full h-7 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* 4. Nap & Rest */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <span className="material-symbols-outlined text-lg">hotel</span>
            <span>فترة القيلولة والراحة اليومية</span>
          </div>
          <input
            type="text"
            value={form.napTime}
            onChange={(e) => onNapTimeChange(e.target.value)}
            className="w-40 h-7 px-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-2xs font-mono text-on-surface text-center focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(
            [
              { id: 'good_sleep', icon: 'bedtime', label: 'نام بهدوء وعمق 🛌' },
              { id: 'rested', icon: 'menu_book', label: 'استرخاء وهدوء 📖' },
              { id: 'restless', icon: 'warning', label: 'قلق أو لم ينم ⚠️' }
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onNapValueChange(opt.id)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                form.napValue === opt.id
                  ? 'bg-primary-fixed/40 border-primary text-primary shadow-2xs'
                  : 'bg-surface-container-low hover:bg-surface-container border-transparent text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-base">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Activities & Notes */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <span className="material-symbols-outlined text-lg">palette</span>
          <span>الأنشطة الإبداعية وملاحظات المعلمة وولي الأمر</span>
        </div>

        <div>
          <label className="block text-2xs font-bold text-on-surface-variant mb-1">
            الأنشطة المنجزة اليوم
          </label>
          <input
            type="text"
            value={form.activities}
            onChange={(e) => onActivitiesChange(e.target.value)}
            placeholder="رسم، أناشيد، ألعاب، حفظ..."
            className="w-full h-8 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-2xs font-bold text-on-surface-variant mb-1">
            ملاحظات المعلمة التربوية والسلوكية
          </label>
          <textarea
            rows={2}
            value={form.teacherNote}
            onChange={(e) => onTeacherNoteChange(e.target.value)}
            placeholder="انطباع عام وتطور مهارات الطفل..."
            className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-2xs font-bold text-rose-600 mb-1">
            تنبيه خاص لولي الأمر (يُطبع ويُبرز في التقرير)
          </label>
          <input
            type="text"
            value={form.guardianNotice}
            onChange={(e) => onGuardianNoticeChange(e.target.value)}
            placeholder="مثال: يرجى إحضار ملابس تبديل إضافية ليوم الغد..."
            className="w-full h-8 px-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-rose-300"
          />
        </div>
      </div>
    </div>
  )
}
