import { useNavigate } from 'react-router-dom'

interface ProfileHeroBannerProps {
  child: {
    id: string
    firstName: string
    lastName: string
    birthDate?: string
    photoPath?: string
    classroomId?: string
    allergies?: string
  }
  onEdit?: () => void
  onPrint?: () => void
}

export function ProfileHeroBanner({ child, onEdit, onPrint }: ProfileHeroBannerProps) {
  const navigate = useNavigate()
  const fullName = `${child.firstName} ${child.lastName}`

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden select-none">
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-primary-fixed/25 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
        {/* Student Identity Block */}
        <div className="flex items-center gap-space-lg">
          <div className="relative shrink-0">
            {child.photoPath ? (
              <img
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl object-cover shadow-sm bg-surface-container ring-2 ring-primary-fixed"
                src={child.photoPath}
                alt={fullName}
              />
            ) : (
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-3xl shadow-sm ring-2 ring-primary">
                {child.firstName?.[0] || 'س'}
              </div>
            )}
            <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-emerald-600 text-surface-container-lowest font-caption text-caption flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-ping" />
              نشِطة ومسجلة
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-display-md text-display-md text-on-surface font-bold">
                {fullName}
              </h1>
              <span className="font-caption text-caption font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                #KDG-2024-118
              </span>
              <span className="font-caption text-caption px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-medium">
                العام 2026/2027
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-space-lg gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-primary">cake</span>
                <span>4 سنوات و 3 أشهر (مواليد {child.birthDate || '12 يوليو 2022'})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-secondary">meeting_room</span>
                <span>
                  الفصل: <strong className="text-on-surface font-semibold">فصل النجوم</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-outline">badge</span>
                <span>المعلمة: أ. مريم العابد</span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm pt-1">
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-caption text-caption font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">emergency</span>
                حساسية حرجة موثقة
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-caption text-caption">
                ملف محلي مشفر ومحمي
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Group */}
        <div className="flex flex-wrap items-center gap-space-xs self-start lg:self-center">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>تعديل البيانات</span>
            <kbd className="font-mono text-caption px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">
              Ctrl+E
            </kbd>
          </button>

          <button
            onClick={onPrint || (() => window.print())}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>طباعة الملف / البطاقة</span>
          </button>

          <button
            onClick={() => navigate('/finance')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>تسجيل دفعة للطفل</span>
          </button>
        </div>
      </div>
    </section>
  )
}
