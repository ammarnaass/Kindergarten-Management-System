import { useMemo } from 'react'
import type { ChildItem, ClassroomItem } from '@/lib/api/types'

interface ClassroomRosterReportProps {
  childrenList: ChildItem[]
  classrooms: ClassroomItem[]
  selectedClassroomId: string
  kindergartenName: string
  branchName: string
  academicYear: string
}

export function ClassroomRosterReport({
  childrenList,
  classrooms,
  selectedClassroomId,
  kindergartenName,
  branchName,
  academicYear
}: ClassroomRosterReportProps) {
  const selectedClassroom = useMemo(() => {
    return classrooms.find((c) => c.id === selectedClassroomId)
  }, [classrooms, selectedClassroomId])

  const filteredChildren = useMemo(() => {
    if (selectedClassroomId === 'ALL') {
      return childrenList
    }
    return childrenList.filter((c) => c.classroomId === selectedClassroomId)
  }, [childrenList, selectedClassroomId])

  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return '—'
    const birth = new Date(birthDateStr)
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    if (months < 0) {
      years--
      months += 12
    }
    return `${years} سنوات و ${months} أشهر`
  }

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-xs print:border-none print:shadow-none print:p-0 print:m-0 text-on-surface">
      {/* Official Kindergarten Report Header */}
      <div className="border-b-2 border-primary/20 pb-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-2xs print:border print:border-primary/20">
            <span className="material-symbols-outlined text-[32px]">school</span>
          </div>
          <div>
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
              {kindergartenName || 'روضتي النموذجية'}
            </h1>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              {branchName || 'الفرع الرئيسي'} • العام الدراسي {academicYear || '1446-1447هـ'}
            </p>
          </div>
        </div>

        <div className="text-left font-mono text-body-sm space-y-1">
          <div className="px-3 py-1 bg-surface-container-low rounded-lg text-primary font-semibold text-caption inline-block">
            كشف قيد رسمي معتمد
          </div>
          <div className="text-caption text-on-surface-variant">
            تاريخ الاستخراج: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>
      </div>

      {/* Classroom Context Metadata Bar */}
      <div className="bg-surface-container-low/60 p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 border border-outline-variant/20">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-caption text-on-surface-variant block font-semibold">الفصل الدراسي:</span>
            <span className="text-headline-sm font-bold text-primary">
              {selectedClassroom ? selectedClassroom.name : 'جميع الفصول المسجلة بالروضة'}
            </span>
          </div>
          {selectedClassroom && (
            <div>
              <span className="text-caption text-on-surface-variant block font-semibold">القاعة / الغرفة:</span>
              <span className="text-body-md font-semibold text-on-surface">
                {selectedClassroom.room || 'القاعة الرئيسية'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-body-sm">
          <div>
            <span className="text-caption text-on-surface-variant block font-semibold">عدد الأطفال المقيدين:</span>
            <span className="text-headline-sm font-bold text-on-surface font-mono">
              {filteredChildren.length} طفلاً
            </span>
          </div>
          {selectedClassroom && (
            <div>
              <span className="text-caption text-on-surface-variant block font-semibold">الطاقة الاستيعابية:</span>
              <span className="text-body-md font-semibold text-on-surface font-mono">
                {selectedClassroom.capacity} مقعداً
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Roster Table */}
      {filteredChildren.length === 0 ? (
        <div className="py-16 text-center text-on-surface-variant bg-surface-container-low/30 rounded-xl">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">escalator_warning</span>
          <p className="text-body-md font-semibold text-on-surface">لا يوجد أطفال مسجلون في هذا الفصل حالياً</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
          <table className="w-full text-right border-collapse text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-4">اسم الطفل الرباعي</th>
                <th className="py-3 px-3">الجنس</th>
                <th className="py-3 px-4">تاريخ الميلاد / العمر</th>
                <th className="py-3 px-4">الفصل</th>
                <th className="py-3 px-4">رقم الطوارئ</th>
                <th className="py-3 px-4">ملاحظات طبية / حساسية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredChildren.map((child, idx) => (
                <tr key={child.id} className="hover:bg-surface-container-low/40 transition-colors print:hover:bg-transparent">
                  <td className="py-2.5 px-3 text-center font-mono text-caption text-outline">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-on-surface">
                    {child.firstName} {child.lastName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-caption font-semibold ${
                      child.gender === 'female'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {child.gender === 'female' ? 'أنثى' : 'ذكر'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-caption">
                    <div>{child.birthDate}</div>
                    <div className="text-[11px] text-on-surface-variant">{calculateAge(child.birthDate)}</div>
                  </td>
                  <td className="py-2.5 px-4 text-on-surface-variant text-caption">
                    {classrooms.find((c) => c.id === child.classroomId)?.name || 'غير مسكن'}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-caption" dir="ltr">
                    {child.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-2.5 px-4">
                    {child.allergies ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-caption font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>{child.allergies}</span>
                      </span>
                    ) : (
                      <span className="text-outline text-caption">سليم معافى</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Official Signatures & Seal Section */}
      <div className="mt-12 pt-8 border-t border-outline-variant/30 grid grid-cols-3 gap-6 text-center text-body-sm">
        <div className="space-y-8">
          <span className="text-on-surface-variant font-semibold block">معلمة الفصل / المشرفة:</span>
          <div className="border-b border-dashed border-outline-variant/60 w-3/4 mx-auto"></div>
          <span className="text-caption text-outline font-mono block">التوقيع والتاريخ</span>
        </div>

        <div className="space-y-4">
          <span className="text-on-surface-variant font-semibold block">ختم الروضة الرسمي:</span>
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-outline-variant/50 mx-auto flex items-center justify-center text-outline text-caption">
            الختم الرسمي
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
