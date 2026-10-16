interface ActiveChildProfileHeaderProps {
  childName: string
  childAge: string
  classroom: string
  childIdNumber: string
  entryTime: string
  photoUrl: string
  lockerNumber: string
  allergiesNote: string
  teacherNote: string
}

export function ActiveChildProfileHeader({
  childName,
  childAge,
  classroom,
  childIdNumber,
  entryTime,
  photoUrl,
  lockerNumber,
  allergiesNote,
  teacherNote
}: ActiveChildProfileHeaderProps) {
  return (
    <div className="space-y-space-sm select-none">
      {/* Header Profile Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md pb-space-md border-b border-outline-variant/30">
        <div className="flex items-center gap-space-md">
          <div className="relative">
            <img
              src={photoUrl}
              alt={childName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-fixed shadow-sm bg-surface-container"
            />
            <span className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-md bg-primary text-on-primary font-caption text-caption font-bold shadow-xs">
              حاضر
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                {childName}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">
                {childAge}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">
                  flutter_dash
                </span>
                <span className="font-semibold text-secondary">{classroom}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-caption text-caption bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface">
                {childIdNumber}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">تسجيل الدخول: {entryTime}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-label-md text-label-md font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>جاهز ومؤهل للاستلام</span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">
            خزانة رقم: {lockerNumber}
          </span>
        </div>
      </div>

      {/* Health Alert Banner */}
      <div className="p-space-md rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center gap-space-md shadow-xs">
        <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-xl">air</span>
        </div>
        <div className="flex-1">
          <div className="font-label-lg text-label-lg font-bold flex items-center gap-2">
            <span>⚠️ تنبيه صحي: حساسية صدرية وموسمية (Asthma / Inhaler)</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-caption text-caption font-semibold">
              مستوى أصفر
            </span>
          </div>
          <p className="font-body-sm text-body-sm mt-0.5">{allergiesNote}</p>
        </div>
      </div>

      {/* Teacher's Afternoon Checkout Note */}
      <div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-primary text-lg mt-0.5">comment</span>
        <div className="font-body-sm text-body-sm">
          <span className="font-semibold text-primary">ملاحظة المعلمة (أ. ريم الشريف): </span>
          {teacherNote}
        </div>
      </div>
    </div>
  )
}
