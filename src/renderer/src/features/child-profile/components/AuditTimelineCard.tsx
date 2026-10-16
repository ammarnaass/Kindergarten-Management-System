export function AuditTimelineCard() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">lock_clock</span>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              سجل التدقيق والتغييرات المحلي
            </h3>
            <p className="font-caption text-caption text-on-surface-variant">
              غير قابل للتعديل • محفوظ في قاعدة البيانات
            </p>
          </div>
        </div>
        <span className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container font-mono text-on-surface-variant">
          SQLite Triggers
        </span>
      </div>

      {/* Timeline Items */}
      <div className="space-y-space-sm relative">
        <div className="flex items-start gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-base">payments</span>
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                أ. نادية المنصوري (مديرة)
              </span>
              <span className="font-mono text-caption text-on-surface-variant">اليوم 10:45 ص</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-snug">
              سجلت دفعة نقدية بمبلغ{' '}
              <strong className="font-mono font-bold text-emerald-700">20,000 دج</strong> (اشتراك شهر أكتوبر مع النقل المدرسي والإطعام).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-base">rate_review</span>
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                أ. مريم العابد (معلمة الفصل)
              </span>
              <span className="font-mono text-caption text-on-surface-variant">أمس 14:15 م</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-snug">
              أضافت ملاحظة التقرير اليومي:{' '}
              <span className="italic text-on-surface-variant">
                &ldquo;أظهرت سارة تفاعلاً مميزاً وسرعة استيعاب في نشاط الرسم الجماعي للألوان الأساسية.&rdquo;
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-base">edit_note</span>
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                أمانة السكرتارية (محلي)
              </span>
              <span className="font-mono text-caption text-on-surface-variant">10 أكتوبر 2026</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-snug">
              تم تحديث رقم هاتف الأم د. أمينة حمدي وتثبيت بطاقة الهوية الوطنية للجدة فاطمة في قائمة المخولين.
            </p>
          </div>
        </div>
      </div>

      <button
        className="w-full py-2 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors text-center"
        type="button"
      >
        عرض كامل سجل التدقيق التاريخي (14 حركة سابقة)
      </button>
    </section>
  )
}
