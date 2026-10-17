export interface GuardianItem {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  address?: string | null
  nationalId?: string | null
  relation: string
  isPrimary: boolean
  canPickup: boolean
}

interface ParentsInfoCardProps {
  guardians: GuardianItem[]
  onAddGuardian?: () => void
}

export function ParentsInfoCard({ guardians, onAddGuardian }: ParentsInfoCardProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">escalator_warning</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            معلومات الأولياء الرسمية
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption">
            {guardians.length} مسجلين
          </span>
        </div>
        {onAddGuardian && (
          <button
            onClick={onAddGuardian}
            className="text-primary hover:text-primary-container font-label-sm text-label-sm flex items-center gap-1 font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>إضافة ولي أمر</span>
          </button>
        )}
      </div>

      {guardians.length === 0 ? (
        <div className="p-8 text-center bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">family_restroom</span>
          <p className="text-on-surface font-semibold text-sm">لا يوجد أولياء أمور مرتبطون بهذا الطفل حالياً</p>
          <p className="text-on-surface-variant text-xs mt-1">
            يمكنك ربط الأب أو الأم لتوثيق الاتصال والاستلام الرسمي
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {guardians.map((g) => {
            const isFather = g.relation.includes('أب') || g.relation.toLowerCase() === 'father'
            return (
              <div
                key={g.id}
                className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-caption text-caption font-bold px-2 py-0.5 rounded ${
                        g.isPrimary
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      {g.isPrimary ? `ولي الأمر الأساسي (${g.relation})` : g.relation}
                    </span>
                    <span className="material-symbols-outlined text-base text-primary">verified_user</span>
                  </div>

                  <div className="space-y-1 mt-2">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {g.firstName} {g.lastName}
                    </h4>
                    {g.phone && (
                      <div className="flex items-center gap-1.5 pt-1 text-on-surface font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-sm text-primary">smartphone</span>
                        <span className="font-mono font-semibold" dir="ltr">
                          {g.phone}
                        </span>
                      </div>
                    )}
                    {g.address && (
                      <div className="flex items-start gap-1.5 text-on-surface-variant font-caption text-caption pt-0.5">
                        <span className="material-symbols-outlined text-sm shrink-0">home_pin</span>
                        <span>{g.address}</span>
                      </div>
                    )}
                    {g.nationalId && (
                      <div className="flex items-center gap-1.5 text-on-surface-variant font-caption text-caption pt-0.5 font-mono">
                        <span className="material-symbols-outlined text-sm shrink-0">badge</span>
                        <span>رقم الهوية: {g.nationalId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/30 mt-3">
                  <a
                    className="flex-1 py-1 px-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm text-center hover:bg-surface-container-high transition-colors"
                    href={`https://wa.me/${g.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    مراسلة واتساب
                  </a>
                  <a
                    className="py-1 px-2.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors flex items-center justify-center"
                    href={`tel:${g.phone}`}
                    title="اتصال هاتفي"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
