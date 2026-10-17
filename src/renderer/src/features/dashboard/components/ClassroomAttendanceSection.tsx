import { useNavigate } from 'react-router-dom'
import type { ClassroomAttendanceStat } from '@/lib/api/types'

interface ClassroomAttendanceSectionProps {
  classrooms: ClassroomAttendanceStat[]
}

const EMOJIS = ['⭐', '🦋', '🌸', '🌱', '🎨', '🚀', '🦁', '🐬']

export function ClassroomAttendanceSection({ classrooms }: ClassroomAttendanceSectionProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">meeting_room</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              حضور وانضباط الفصول الدراسية
            </h2>
            <p className="font-caption text-caption text-on-surface-variant">
              تحديث حي ومباشر من قاعدة بيانات الحضور لليوم
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {classrooms.length} فصول مسجلة
          </span>
        </div>
      </div>

      {classrooms.length === 0 ? (
        <div className="p-8 text-center bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">school</span>
          <p className="text-on-surface font-semibold text-sm">لا توجد فصول دراسية مسجلة حالياً</p>
          <p className="text-on-surface-variant text-xs mt-1">
            يمكنك إضافة الفصول الدراسية وتعيين الأطفال من الإعدادات
          </p>
        </div>
      ) : (
        <div className="space-y-space-sm">
          {classrooms.map((cls, idx) => {
            const emoji = EMOJIS[idx % EMOJIS.length]
            const progress = cls.progressPercent
            const isFull = progress >= 100

            return (
              <div
                key={cls.id}
                className="rounded-lg bg-surface-container-low p-space-md hover:bg-surface-container transition-colors group"
              >
                <div className="flex items-center justify-between gap-space-sm flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-base shadow-2xs">
                      {emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {cls.name}
                        </h3>
                        {cls.room && (
                          <span className="px-2 py-0.5 rounded text-caption font-caption bg-surface-container-highest text-on-surface-variant">
                            {cls.room}
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        السعة القصوى: {cls.capacity} طفل • المسجلون: {cls.totalChildren}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-md">
                    <div className="text-left font-mono">
                      <div className="font-label-lg text-label-lg font-bold text-on-surface">
                        {cls.presentCount}{' '}
                        <span className="text-outline text-label-sm font-normal">
                          / {cls.totalChildren}
                        </span>
                      </div>
                      <span
                        className={`font-caption text-caption px-1.5 py-0.5 rounded font-sans font-semibold ${
                          isFull
                            ? 'text-emerald-700 bg-emerald-50'
                            : cls.totalChildren === 0
                              ? 'text-on-surface-variant bg-surface-container'
                              : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {cls.totalChildren === 0
                          ? 'فصل فارغ'
                          : isFull
                            ? 'حضور كامل 100%'
                            : `${progress}% حاضرون`}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/attendance')}
                      className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors shadow-2xs"
                      title="فتح الحضور للفصل"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isFull ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1.5 font-caption text-caption text-on-surface-variant">
                    <span>الحاضرون: {cls.presentCount} طفل</span>
                    <span>
                      {cls.absentCount > 0
                        ? `الغياب: ${cls.absentCount}`
                        : cls.lateCount > 0
                          ? `المتأخرون: ${cls.lateCount}`
                          : 'لا يوجد غياب'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
