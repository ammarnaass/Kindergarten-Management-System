import { useNavigate } from 'react-router-dom'

interface ProfileHeroBannerProps {
  child: {
    id: string
    firstName: string
    lastName: string
    birthDate?: string
    gender?: 'male' | 'female'
    photoPath?: string | null
    classroomId?: string | null
    classroomName?: string | null
    status?: string
    allergies?: string | null
    medicalNotes?: string | null
  }
  onEdit?: () => void
  onPrint?: () => void
  onDelete?: () => void
}

function getAgeString(birthDateStr?: string): string {
  if (!birthDateStr) return ''
  try {
    const birth = new Date(birthDateStr)
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--
      months += 12
    }
    if (years <= 0) return `${months} أشهر`
    if (months === 0) return `${years} سنوات`
    return `${years} سنوات و ${months} أشهر`
  } catch {
    return ''
  }
}

export function ProfileHeroBanner({ child, onEdit, onPrint, onDelete }: ProfileHeroBannerProps) {
  const navigate = useNavigate()
  const fullName = `${child.firstName} ${child.lastName}`
  const age = getAgeString(child.birthDate)

  const isMale = child.gender === 'male'
  const statusLabel =
    child.status === 'active'
      ? isMale ? 'نشط ومسجل' : 'نشطة ومسجلة'
      : child.status === 'waitlist'
        ? 'قائمة الانتظار'
        : child.status === 'graduated'
          ? 'متخرج'
          : 'منسحب'

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
                {child.firstName?.[0] || 'ط'}
              </div>
            )}
            <span
              className={`absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full font-caption text-caption flex items-center gap-1 shadow-xs ${
                child.status === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {child.status === 'active' && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              )}
              {statusLabel}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-display-md text-display-md text-on-surface font-bold">
                {fullName}
              </h1>
              <span className="font-caption text-caption font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                #{child.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="font-caption text-caption px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-medium">
                العام الدراسي الحالي
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-space-lg gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
              {child.birthDate && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-primary">cake</span>
                  <span>
                    {age ? `${age} • ` : ''}مواليد {child.birthDate}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-secondary">meeting_room</span>
                <span>
                  الفصل: <strong className="text-on-surface font-semibold">{child.classroomName || 'غير مسكن'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-outline">badge</span>
                <span>الجنس: {isMale ? 'ذكر' : 'أنثى'}</span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm pt-1">
              {child.allergies ? (
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-caption text-caption font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">emergency</span>
                  حساسية: {child.allergies}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-caption text-caption flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  لا توجد حساسيات معروفة
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-caption text-caption">
                سجل محلي معتمد
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
            <span>طباعة الملف</span>
          </button>

          <button
            onClick={() => navigate('/finance')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>تسجيل دفعة</span>
          </button>

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-error-container/30 text-error hover:bg-error-container/60 font-label-md text-label-md transition-colors"
              title="حذف ملف الطفل ونقله للأرشيف"
              type="button"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              <span>حذف الملف</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
