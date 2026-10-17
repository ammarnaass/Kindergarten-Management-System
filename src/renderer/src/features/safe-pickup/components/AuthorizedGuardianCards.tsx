import { SafePickupGuardian } from './ActiveChildVerificationCard'

interface AuthorizedGuardianCardsProps {
  guardians: SafePickupGuardian[]
  selectedGuardianId: string
  onSelectGuardian: (id: string) => void
}

export function AuthorizedGuardianCards({
  guardians,
  selectedGuardianId,
  onSelectGuardian
}: AuthorizedGuardianCardsProps) {
  return (
    <div className="mt-space-lg select-none">
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">shield_person</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            الأشخاص المخولون رسمياً باستلام الطفل
          </h3>
        </div>
        <span className="font-caption text-caption text-on-surface-variant">
          اختر الشخص الحاضر أمام البوابة للتحقق والتسليم:
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {guardians.map((g) => {
          const isSelected = selectedGuardianId === g.id
          return (
            <div
              key={g.id}
              onClick={() => onSelectGuardian(g.id)}
              className={`relative p-space-md rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'bg-surface-container-lowest ring-2 ring-primary bg-primary-fixed/20 shadow-md'
                  : 'bg-surface-container-low hover:bg-surface-container shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-surface-container-lowest font-caption text-caption font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    الحاضر الآن عند الشباك
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  {g.photoUrl ? (
                    <img
                      src={g.photoUrl}
                      alt={g.name}
                      className={`w-14 h-14 rounded-xl object-cover shadow-xs ${
                        isSelected ? 'ring-2 ring-emerald-500' : 'ring-1 ring-outline-variant'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center font-bold text-xl shadow-xs ${
                        isSelected ? 'ring-2 ring-emerald-500' : 'ring-1 ring-outline-variant'
                      }`}
                    >
                      {g.name?.[0] || 'م'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                      {g.name}
                    </h4>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      {g.profession}
                    </span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-caption text-caption font-semibold">
                      {g.relationship}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>الهوية الوطنية:</span>
                    <span className="font-mono text-on-surface font-semibold">
                      {g.nationalId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>رقم الجوال:</span>
                    <span className="font-mono text-on-surface font-semibold" dir="ltr">
                      {g.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 bg-surface-container-high/40 -mx-space-md -mb-space-md p-space-sm rounded-b-xl flex items-center justify-between">
                <span className="font-caption text-caption text-emerald-800 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-emerald-600">
                    fingerprint
                  </span>
                  بصمة + هوية مطابقة
                </span>
                <span
                  className={`material-symbols-outlined text-base ${
                    isSelected ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
