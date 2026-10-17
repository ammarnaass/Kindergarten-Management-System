export interface PickupPerson {
  id: string
  name: string
  relationship?: string
  phone?: string
  nationalId?: string
  note?: string
}

interface AuthorizedPickupsCardProps {
  pickups: PickupPerson[]
  onAddPickup?: () => void
}

export function AuthorizedPickupsCard({ pickups, onAddPickup }: AuthorizedPickupsCardProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">how_to_reg</span>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              الأشخاص المخوّلون رسمياً بالاستلام والانصراف
            </h3>
            <p className="font-caption text-caption text-on-surface-variant">
              مطابقة الهوية إلزامية عند بوابة الانصراف اليومية
            </p>
          </div>
        </div>
        {onAddPickup && (
          <button
            onClick={onAddPickup}
            className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors flex items-center gap-1 font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>إضافة مخوّل جديد</span>
          </button>
        )}
      </div>

      {/* Authorized List Cards */}
      {pickups.length === 0 ? (
        <div className="p-8 text-center bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">shield_person</span>
          <p className="text-on-surface font-semibold text-sm">لا يوجد مخوّلون إضافيون مسجلون حالياً</p>
          <p className="text-on-surface-variant text-xs mt-1">
            يتم تسليم الطفل حصرياً لأولياء الأمور المعتمدين أعلاه ما لم يُضف مخوّل رسمي
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-sm">
          {pickups.map((person) => (
            <div
              key={person.id}
              className="bg-surface-container-low rounded-xl p-space-sm flex flex-col items-center text-center space-y-2 relative"
            >
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full font-caption text-caption font-semibold bg-emerald-100 text-emerald-800">
                مخوّل مسجل
              </span>
              <div className="w-14 h-14 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-bold text-xl shadow-xs">
                {person.name?.[0] || 'م'}
              </div>
              <div className="space-y-0.5">
                <h5 className="font-label-lg text-label-lg font-bold text-on-surface">{person.name}</h5>
                <p className="font-caption text-caption text-on-surface-variant">
                  {person.relationship || 'مخوّل رسمي'}
                </p>
                {person.phone && (
                  <p className="font-mono text-caption text-on-surface-variant" dir="ltr">
                    {person.phone}
                  </p>
                )}
              </div>
              {person.nationalId && (
                <div className="w-full pt-1">
                  <span className="w-full py-0.5 rounded bg-surface-container text-on-surface-variant font-caption text-caption block font-mono">
                    هوية: {person.nationalId}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Strict Safety Warning Box */}
      <div className="bg-surface-container-high rounded-lg p-space-md flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-secondary text-xl shrink-0">shield</span>
        <div className="space-y-0.5">
          <h5 className="font-label-md text-label-md font-bold text-on-surface">
            تنبيه الحماية والسلامة المشدد:
          </h5>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            يُمنع منعاً باتاً تسليم الطفل لأي شخص غير مسجل في قائمة المخولين دون إذن خطي مسجل مسبقاً وتأكيد هاتفي مباشر من ولي الأمر.
          </p>
        </div>
      </div>
    </section>
  )
}
