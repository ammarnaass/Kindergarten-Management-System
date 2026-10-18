import React, { useState } from 'react'
import type { useClassroomTimer } from '../../hooks/useClassroomTimer'

interface ClassroomActivityTimerProps {
  isOpen: boolean
  onClose: () => void
  timer: ReturnType<typeof useClassroomTimer>
}

export const ClassroomActivityTimer: React.FC<ClassroomActivityTimerProps> = ({
  isOpen,
  onClose,
  timer
}) => {
  const [customInput, setCustomInput] = useState('')

  if (!isOpen) return null

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseInt(customInput, 10)
    if (!isNaN(val) && val > 0) {
      timer.setCustomMinutes(val)
      setCustomInput('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg shadow-2xl border border-outline-variant/30 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high bg-surface-container-low/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                مؤقت الأنشطة الصفي التفاعلي
              </h3>
              <p className="font-caption text-caption text-on-surface-variant">
                مؤقت مرئي وصوتي لإدارة أوقات الحصص والوجبات والقيلولة
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

        {/* Timer Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Presets Row */}
          <div className="flex items-center flex-wrap gap-2 justify-center mb-6 w-full">
            {timer.presets.map((preset) => {
              const isSelected = timer.activePreset.id === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => timer.selectPreset(preset)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-label-md text-label-md transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{preset.icon}</span>
                  <span>{preset.title}</span>
                  <span className="font-mono text-caption opacity-80">({preset.durationMinutes}د)</span>
                </button>
              )
            })}
          </div>

          {/* Large Countdown Display */}
          <div className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center bg-surface-container-low border-4 border-primary/20 shadow-inner mb-6">
            {/* Active title */}
            <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-sm">{timer.activePreset.icon}</span>
              <span>{timer.activePreset.title}</span>
            </span>

            {/* Time */}
            <span
              className={`font-mono font-bold tracking-tight select-none ${
                timer.isFinished
                  ? 'text-5xl text-error animate-bounce'
                  : timer.isRunning
                  ? 'text-6xl text-primary animate-pulse'
                  : 'text-6xl text-on-surface'
              }`}
            >
              {timer.formattedTime}
            </span>

            {/* Finish message or progress */}
            {timer.isFinished ? (
              <span className="mt-2 px-3 py-0.5 rounded-full bg-error text-white font-label-sm font-bold text-caption animate-pulse">
                انتهى الوقت المحدد! 🎉
              </span>
            ) : (
              <div className="w-36 bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${timer.progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!timer.isRunning ? (
              <button
                type="button"
                onClick={timer.start}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-on-primary hover:bg-primary-container font-headline-sm text-headline-sm font-bold transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">play_arrow</span>
                <span>{timer.secondsLeft < timer.totalSeconds && !timer.isFinished ? 'استئناف' : 'بدء المؤقت'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.pause}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-white hover:bg-amber-600 font-headline-sm text-headline-sm font-bold transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">pause</span>
                <span>إيقاف مؤقت</span>
              </button>
            )}

            <button
              type="button"
              onClick={timer.reset}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-colors active:scale-95"
              title="إعادة ضبط"
            >
              <span className="material-symbols-outlined text-xl">restart_alt</span>
              <span>إعادة تعيين</span>
            </button>
          </div>

          {/* Custom Duration Input */}
          <form onSubmit={handleApplyCustom} className="mt-6 flex items-center gap-2 w-full max-w-xs">
            <input
              type="number"
              min="1"
              max="180"
              placeholder="دقائق مخصصة..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl bg-surface-container-low text-on-surface text-body-sm border border-outline-variant/40 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 h-9 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors"
            >
              تطبيق
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low/50 border-t border-surface-container-high flex items-center justify-between text-caption text-caption text-on-surface-variant">
          <span>يصدر المؤقت نغمة هادئة عند اكتمال الوقت</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-md text-label-md transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
