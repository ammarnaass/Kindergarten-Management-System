import { useNavigate } from 'react-router-dom'

interface ClassroomItem {
  id: string
  name: string
  emoji: string
  ageGroup: string
  teacher: string
  room: string
  present: number
  total: number
  bgColor: string
  textColor: string
  statusNote: string
  progressPercent: number
}

const CLASSROOMS: ClassroomItem[] = [
  {
    id: 'stars',
    name: 'فصل النجوم',
    emoji: '⭐',
    ageGroup: 'السن: 4-5 سنوات',
    teacher: 'أ. خديجة عماري',
    room: 'القاعة 01',
    present: 14,
    total: 14,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    statusNote: 'مكتمل 100%',
    progressPercent: 100,
  },
  {
    id: 'butterflies',
    name: 'فصل الفراشات',
    emoji: '🦋',
    ageGroup: 'السن: 3-4 سنوات',
    teacher: 'أ. أسماء بوحفص',
    room: 'القاعة 02',
    present: 11,
    total: 14,
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    statusNote: '3 بانتظار التسجيل',
    progressPercent: 78.5,
  },
  {
    id: 'flowers',
    name: 'فصل الزهور',
    emoji: '🌸',
    ageGroup: 'السن: 5-6 سنوات (تمهيدي)',
    teacher: 'أ. سناء علام',
    room: 'القاعة 03',
    present: 12,
    total: 13,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    statusNote: '1 غياب مبرر',
    progressPercent: 92.3,
  },
  {
    id: 'sprouts',
    name: 'فصل البراعم',
    emoji: '🌱',
    ageGroup: 'السن: 2-3 سنوات (حضانة)',
    teacher: 'أ. سميرة قندوز',
    room: 'القاعة الرضيعة',
    present: 11,
    total: 11,
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    statusNote: 'حضور كامل',
    progressPercent: 100,
  },
]

export function ClassroomAttendanceSection() {
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
              تحديث حي من سجل الحضور المحلي للمعلمات
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            4 فصول نشطة
          </span>
        </div>
      </div>

      <div className="space-y-space-sm">
        {CLASSROOMS.map((cls) => (
          <div
            key={cls.id}
            className="rounded-lg bg-surface-container-low p-space-md hover:bg-surface-container transition-colors group"
          >
            <div className="flex items-center justify-between gap-space-sm flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${cls.bgColor} ${cls.textColor} flex items-center justify-center font-bold text-base`}
                >
                  {cls.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {cls.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-caption font-caption bg-surface-container-highest text-on-surface-variant">
                      {cls.ageGroup}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    المعلمة: {cls.teacher} • {cls.room}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-space-md">
                <div className="text-left font-mono">
                  <div className="font-label-lg text-label-lg font-bold text-on-surface">
                    {cls.present}{' '}
                    <span className="text-outline text-label-sm font-normal">
                      / {cls.total}
                    </span>
                  </div>
                  <span
                    className={`font-caption text-caption px-1 rounded font-sans font-semibold ${
                      cls.progressPercent === 100
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-amber-700 bg-amber-50'
                    }`}
                  >
                    {cls.statusNote}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/attendance')}
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors shadow-2xs"
                  title="فتح وضع الفصل التفاعلي"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                </button>
              </div>
            </div>

            {/* Capacity progress bar */}
            <div className="mt-3">
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    cls.progressPercent === 100 ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                  style={{ width: `${cls.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 font-caption text-caption text-on-surface-variant">
                <span>الحاضرون: {cls.present} طفل</span>
                <span>
                  {cls.total - cls.present > 0
                    ? `الغياب: ${cls.total - cls.present}`
                    : 'استيعاب الفصل ممتلئ'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
