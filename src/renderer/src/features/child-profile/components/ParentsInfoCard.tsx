export function ParentsInfoCard() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">escalator_warning</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            معلومات الوالدين الرسمية
          </h3>
        </div>
        <button
          className="text-primary hover:text-primary-container font-label-sm text-label-sm flex items-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">call</span>
          <span>سجل الاتصالات السريعة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Father Card */}
        <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
              ولي الأمر الأول (الأب)
            </span>
            <span className="material-symbols-outlined text-base text-primary">verified_user</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              طارق بن علي
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">المهنة: مهندس برمجيات</p>
            <div className="flex items-center gap-1.5 pt-1 text-on-surface font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-sm text-primary">smartphone</span>
              <span className="font-mono font-semibold" dir="ltr">0550 12 34 56</span>
            </div>
            <div className="flex items-start gap-1.5 text-on-surface-variant font-caption text-caption pt-0.5">
              <span className="material-symbols-outlined text-sm shrink-0">home_pin</span>
              <span>حي الياسمين، العمارة ب، شقة رقم 14</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <a
              className="flex-1 py-1 px-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm text-center hover:bg-surface-container-high transition-colors"
              href="https://wa.me/213550123456"
              target="_blank"
              rel="noreferrer"
            >
              مراسلة واتساب
            </a>
            <a
              className="py-1 px-2 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors flex items-center justify-center"
              href="tel:0550123456"
            >
              <span className="material-symbols-outlined text-sm">phone</span>
            </a>
          </div>
        </div>

        {/* Mother Card */}
        <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption font-bold px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">
              ولي الأمر الثاني (الأم)
            </span>
            <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              د. أمينة حمدي
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">المهنة: طبيبة أسنان ممارسة</p>
            <div className="flex items-center gap-1.5 pt-1 text-on-surface font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-sm text-secondary">smartphone</span>
              <span className="font-mono font-semibold" dir="ltr">0661 23 45 67</span>
            </div>
            <div className="flex items-start gap-1.5 text-on-surface-variant font-caption text-caption pt-0.5">
              <span className="material-symbols-outlined text-sm shrink-0">domain</span>
              <span>عيادة النور لطب الأسنان (شارع الاستقلال)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <a
              className="flex-1 py-1 px-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm text-center hover:bg-surface-container-high transition-colors"
              href="https://wa.me/213661234567"
              target="_blank"
              rel="noreferrer"
            >
              مراسلة واتساب
            </a>
            <a
              className="py-1 px-2 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm hover:bg-on-secondary-container transition-colors flex items-center justify-center"
              href="tel:0661234567"
            >
              <span className="material-symbols-outlined text-sm">phone</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
