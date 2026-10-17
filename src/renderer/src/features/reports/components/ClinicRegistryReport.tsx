import type { CriticalAllergyChild, ClinicVisitItem } from '@/lib/api/types'

interface ClinicRegistryReportProps {
  allergiesList: CriticalAllergyChild[]
  clinicVisits: ClinicVisitItem[]
  kindergartenName: string
  branchName: string
  academicYear: string
}

export function ClinicRegistryReport({
  allergiesList,
  clinicVisits,
  kindergartenName,
  branchName,
  academicYear
}: ClinicRegistryReportProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-xs print:border-none print:shadow-none print:p-0 text-on-surface">
      {/* Official Kindergarten Report Header */}
      <div className="border-b-2 border-rose-500/20 pb-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 font-bold shadow-2xs">
            <span className="material-symbols-outlined text-[32px]">medical_services</span>
          </div>
          <div>
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
              {kindergartenName || 'روضتي النموذجية'}
            </h1>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              {branchName || 'الفرع الرئيسي'} • العيادة المدرسية والسلامة • {academicYear || '1446-1447هـ'}
            </p>
          </div>
        </div>

        <div className="text-left font-mono text-body-sm space-y-1">
          <div className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-semibold text-caption inline-block">
            سجل العيادة والحالات الطبية الحرجة
          </div>
          <div className="text-caption text-on-surface-variant">
            تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>
      </div>

      {/* Section 1: Critical Allergies & Chronic Conditions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <h2 className="text-headline-sm font-bold text-on-surface">
            سجل الحساسيات الغذائية والدوائية والاحتياطات الطبية ({allergiesList.length} أطفال)
          </h2>
        </div>

        {allergiesList.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant bg-surface-container-low/40 rounded-xl">
            <p className="text-body-md font-semibold">لا توجد حالات حساسية حرجة مسجلة حالياً — جميع الأطفال بصحة جيدة.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-right border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">اسم الطفل</th>
                  <th className="py-2.5 px-4">الفصل</th>
                  <th className="py-2.5 px-4">نوع الحساسية / الملاحظة</th>
                  <th className="py-2.5 px-4">الاحتياط والإجراء الطبي العاجل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {allergiesList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-caption text-outline">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-on-surface">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="py-2.5 px-4 text-on-surface-variant text-caption">
                      {item.classroomName || 'غير مسكن'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 text-caption font-bold border border-rose-200">
                        {item.allergies}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-on-surface-variant text-caption">
                      {item.medicalNotes || 'منع تناول المادة ومراجعة ممرضة الروضة فوراً'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Recent Clinic Visits */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <h2 className="text-headline-sm font-bold text-on-surface">
            سجل مراجعات وزيارات العيادة المدرسية الأخيرة ({clinicVisits.length} مراجعة)
          </h2>
        </div>

        {clinicVisits.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant bg-surface-container-low/40 rounded-xl">
            <p className="text-body-md font-semibold">لم تسجل مراجعات طبية طارئة خلال هذه الفترة.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
            <table className="w-full text-right border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">تاريخ ووقت الزيارة</th>
                  <th className="py-2.5 px-4">اسم الطفل</th>
                  <th className="py-2.5 px-4">الفصل</th>
                  <th className="py-2.5 px-4">تفاصيل الشكوى الطبية والإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {clinicVisits.slice(0, 15).map((visit, idx) => (
                  <tr key={visit.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-caption text-outline">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-caption text-on-surface">
                      {visit.recordedOn}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-on-surface">
                      {visit.childFirstName} {visit.childLastName}
                    </td>
                    <td className="py-2.5 px-4 text-on-surface-variant text-caption">
                      {visit.classroomName || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-on-surface text-caption">
                      {visit.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Signatures & Seal Section */}
      <div className="mt-12 pt-8 border-t border-outline-variant/30 grid grid-cols-3 gap-6 text-center text-body-sm">
        <div className="space-y-8">
          <span className="text-on-surface-variant font-semibold block">الممرضة الصحية المشرفة:</span>
          <div className="border-b border-dashed border-outline-variant/60 w-3/4 mx-auto"></div>
          <span className="text-caption text-outline font-mono block">التوقيع والتاريخ</span>
        </div>

        <div className="space-y-4">
          <span className="text-on-surface-variant font-semibold block">ختم العيادة المدرسية:</span>
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-rose-300 mx-auto flex items-center justify-center text-rose-500 text-caption font-semibold">
            العيادة المدرسية
          </div>
        </div>

        <div className="space-y-8">
          <span className="text-on-surface-variant font-semibold block">مديرة الروضة:</span>
          <div className="border-b border-dashed border-outline-variant/60 w-3/4 mx-auto"></div>
          <span className="text-caption text-outline font-mono block">الاعتماد الرسمي</span>
        </div>
      </div>
    </div>
  )
}
