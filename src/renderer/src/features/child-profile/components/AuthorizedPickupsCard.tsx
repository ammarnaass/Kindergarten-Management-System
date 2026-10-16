export interface PickupPerson {
  id: string
  name: string
  relationship: string
  phone: string
  photoUrl?: string
  tag: string
  tagClass: string
  note: string
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
        <button
          onClick={onAddPickup}
          className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors flex items-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span>إضافة مخوّل جديد</span>
        </button>
      </div>

      {/* Authorized List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
        {pickups.map((person) => (
          <div
            key={person.id}
            className="bg-surface-container-low rounded-xl p-space-sm flex flex-col items-center text-center space-y-2 relative"
          >
            <span
              className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full font-caption text-caption font-semibold ${person.tagClass}`}
            >
              {person.tag}
            </span>
            <img
              className="w-14 h-14 rounded-full object-cover shadow-xs bg-surface-container"
              src={person.photoUrl}
              alt={person.name}
            />
            <div className="space-y-0.5">
              <h5 className="font-label-lg text-label-lg font-bold text-on-surface">{person.name}</h5>
              <p className="font-caption text-caption text-on-surface-variant">
                {person.relationship}
              </p>
              <p className="font-mono text-caption text-on-surface-variant" dir="ltr">
                {person.phone}
              </p>
            </div>
            <div className="w-full pt-1">
              <span className="w-full py-0.5 rounded bg-surface-container text-on-surface-variant font-caption text-caption block">
                {person.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Strict Safety Warning Box */}
      <div className="bg-surface-container-high rounded-lg p-space-md flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-secondary text-xl shrink-0">shield</span>
        <div className="space-y-0.5">
          <h5 className="font-label-md text-label-md font-bold text-on-surface">
            تنبيه الحماية والسلامة المشدد:
          </h5>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            يُمنع منعاً باتاً تسليم الطفلة لأي شخص آخر دون إذن خطي مسجل مسبقاً في النظام وتأكيد هاتفي مباشر من هاتف الأب أو الأم المسجلين أعلاه حصراً.
          </p>
        </div>
      </div>
    </section>
  )
}
