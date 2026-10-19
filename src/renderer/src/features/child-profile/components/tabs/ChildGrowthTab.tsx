import { GrowthMetricsBento } from '../GrowthMetricsBento'

interface ChildGrowthTabProps {
  child: {
    id: string
    firstName: string
    lastName: string
    birthDate?: string
    allergies?: string | null
    medicalNotes?: string | null
  }
}

export function ChildGrowthTab({ child }: ChildGrowthTabProps) {
  return (
    <div className="space-y-space-lg select-none animate-in fade-in duration-200">
      {/* 1. Physical Growth & Vitals Bento */}
      <GrowthMetricsBento />

      {/* 2. Medical Protocol & Allergy Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs space-y-space-sm">
          <div className="flex items-center gap-2 text-primary font-bold text-label-lg">
            <span className="material-symbols-outlined text-xl">medical_information</span>
            <h4>الحساسيات والمحاذير الغذائية</h4>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
            {child.allergies ? (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-2xl mt-0.5">warning</span>
                <div>
                  <h5 className="font-bold text-error text-body-md">حساسية معتمدة: {child.allergies}</h5>
                  <p className="text-caption text-on-surface-variant mt-1 leading-relaxed">
                    يُمنع تقديم أي وجبات أو مشروبات تحتوي على هذه المكونات، مع وجوب إبلاغ المطبخ والكادر المشرف.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                <span className="text-body-sm font-semibold">لا توجد حساسيات معروفة مسجلة في ملف الطفل.</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs space-y-space-sm">
          <div className="flex items-center gap-2 text-secondary font-bold text-label-lg">
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
            <h4>الإرشادات الطبية الخاصة</h4>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 min-h-[96px]">
            {child.medicalNotes ? (
              <p className="text-body-sm text-on-surface leading-relaxed">{child.medicalNotes}</p>
            ) : (
              <p className="text-caption text-on-surface-variant">
                لا توجد توصيات طبية أو بروتوكولات طارئة إضافية مسجلة. الملف الصحي للطفل مستقر.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
