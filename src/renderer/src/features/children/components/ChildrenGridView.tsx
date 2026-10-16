interface ChildCardItem {
  id: string
  firstName: string
  lastName: string
  birthDate?: string
  gender?: string
  status?: string
  classroomId?: string
  allergies?: string | null
  photoPath?: string | null
}

interface ChildrenGridViewProps {
  children: ChildCardItem[]
  onOpenProfile: (id: string) => void
  onPayTuition: (id: string) => void
}

export function ChildrenGridView({
  children,
  onOpenProfile,
  onPayTuition
}: ChildrenGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md select-none">
      {children.map((child) => (
        <div
          key={child.id}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/40 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-space-md group"
        >
          <div className="flex items-start gap-space-md">
            <div className="relative shrink-0">
              {child.photoPath ? (
                <img
                  src={child.photoPath}
                  alt={child.firstName}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary-fixed shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-xl ring-2 ring-primary/20">
                  {child.firstName?.[0] || 'ط'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest" />
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3
                  onClick={() => onOpenProfile(child.id)}
                  className="font-headline-sm text-headline-sm text-on-surface font-bold truncate group-hover:text-primary cursor-pointer transition-colors"
                >
                  {child.firstName} {child.lastName}
                </h3>
                {child.allergies && (
                  <span
                    className="material-symbols-outlined text-error text-base shrink-0 animate-pulse"
                    title={`حساسية صحية: ${child.allergies}`}
                  >
                    emergency
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-on-surface-variant font-caption text-caption">
                <span className="material-symbols-outlined text-sm text-secondary">
                  meeting_room
                </span>
                <span className="truncate">{child.classroomId || 'فصل النجوم'}</span>
              </div>

              <div className="flex items-center gap-1 text-on-surface-variant font-caption text-caption">
                <span className="material-symbols-outlined text-sm text-primary">cake</span>
                <span>{child.birthDate || '2022-07-12'}</span>
              </div>
            </div>
          </div>

          {/* Status and Action Buttons */}
          <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-caption text-caption font-semibold">
              نشط ومسجل
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onPayTuition(child.id)}
                className="p-1.5 rounded-lg text-primary hover:bg-surface-container-low transition-colors"
                title="تسجيل دفعة"
                type="button"
              >
                <span className="material-symbols-outlined text-base">payments</span>
              </button>
              <button
                onClick={() => onOpenProfile(child.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm font-semibold transition-colors"
                type="button"
              >
                <span>الملف</span>
                <span className="material-symbols-outlined text-xs">arrow_back</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
