import { BranchSettings } from '../types'

interface BranchIdentityFormProps {
  settings: BranchSettings
  onChange: (fields: Partial<BranchSettings>) => void
  onSave: () => void
}

export function BranchIdentityForm({
  settings,
  onChange,
  onSave
}: BranchIdentityFormProps) {
  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div>
        <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-variant">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              بيانات المنشأة والترخيص الرسمي
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              تظهر هذه المعلومات تلقائياً في رؤوس الكشوفات المطبوعة والخطابات الإدارية
            </p>
          </div>
          <span className="material-symbols-outlined text-outline text-[24px]">corporate_fare</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              اسم الروضة الرسمي بالعربية
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.kindergartenNameAr}
                onChange={(e) => onChange({ kindergartenNameAr: e.target.value })}
                placeholder="أدخل اسم الروضة بالعربية..."
                className="w-full pr-10 pl-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                school
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              الاسم الإنجليزي (للشهادات المزدوجة)
            </label>
            <div className="relative">
              <input
                dir="ltr"
                type="text"
                value={settings.kindergartenNameEn}
                onChange={(e) => onChange({ kindergartenNameEn: e.target.value })}
                placeholder="Kindergarten English Name..."
                className="w-full pl-10 pr-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all text-left border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                translate
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              رقم السجل التجاري / الترخيص الوزاري
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.crLicenseNumber}
                onChange={(e) => onChange({ crLicenseNumber: e.target.value })}
                placeholder="رقم السجل أو الترخيص..."
                className="w-full pr-10 pl-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                badge
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              فرع المنشأة المسجل
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.branchName}
                onChange={(e) => onChange({ branchName: e.target.value })}
                placeholder="الفرع الرئيسي / فرع 1..."
                className="w-full pr-10 pl-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                pin_drop
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              رقم الهاتف الرسمي للروضة
            </label>
            <div className="relative">
              <input
                dir="ltr"
                type="tel"
                value={settings.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="05XXXXXXXX"
                className="w-full pr-10 pl-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all text-right border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                call
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              البريد الإلكتروني الداخلي للفرع
            </label>
            <div className="relative">
              <input
                dir="ltr"
                type="email"
                value={settings.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="info@your-kindergarten.com"
                className="w-full pl-10 pr-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all text-left border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                mail
              </span>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              العنوان الوطني المعتمد / الموقع الجغرافي
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.nationalAddress}
                onChange={(e) => onChange({ nationalAddress: e.target.value })}
                placeholder="المدينة، الحي، الشارع..."
                className="w-full pr-10 pl-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all border border-transparent focus:border-primary/20"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                location_on
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <span className="font-caption text-caption text-on-surface-variant">
          البيانات مشفرة ومحفوظة بمفتاح فرع محلي خاص بالروضة.
        </span>
        <button
          type="button"
          onClick={onSave}
          className="px-space-md py-2 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-bold hover:bg-primary-fixed transition-colors"
        >
          حفظ بيانات الفرع فقط
        </button>
      </div>
    </div>
  )
}
