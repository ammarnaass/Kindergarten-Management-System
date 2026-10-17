import { useState, useMemo } from 'react'
import type { ChildItem, ClassroomItem } from '@/lib/api/types'

interface RegistrationFormReportProps {
  childrenList: ChildItem[]
  classrooms?: ClassroomItem[]
  selectedClassroomId: string
  kindergartenName: string
  branchName: string
  academicYear: string
}

export function RegistrationFormReport({
  childrenList,
  classrooms = [],
  selectedClassroomId,
  kindergartenName,
  branchName,
  academicYear,
}: RegistrationFormReportProps) {
  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [showStamp, setShowStamp] = useState(true)

  const filteredChildren = useMemo(() => {
    if (selectedClassroomId === 'ALL') return childrenList
    return childrenList.filter((c) => c.classroomId === selectedClassroomId)
  }, [childrenList, selectedClassroomId])

  const currentChild = useMemo(() => {
    if (selectedChildId) {
      return childrenList.find((c) => c.id === selectedChildId) || null
    }
    return filteredChildren[0] || childrenList[0] || null
  }, [childrenList, selectedChildId, filteredChildren])

  const currentClassroom = classrooms.find((c) => c.id === currentChild?.classroomId)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Non-print control bar */}
      <div className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[24px]">description</span>
          <div>
            <h3 className="font-bold text-on-surface text-label-lg">
              استمارة تسجيل وقيد طفل رسمية (A4 Registration Form)
            </h3>
            <p className="text-caption text-on-surface-variant">
              نموذج معتمد للأرشفة الورقية والموافقات القانونية والتوقيع الحي لولي الأمر
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Child Selector */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-on-surface-variant font-semibold">اختيار الطالب:</span>
            <select
              value={currentChild?.id || ''}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm text-on-surface focus:outline-none"
            >
              <option value="">-- استمارة فارغة جديدة للتعبئة اليدوية --</option>
              {filteredChildren.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.gender === 'male' ? 'ذكر' : 'أنثى'})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-caption text-on-surface">
            <input
              type="checkbox"
              checked={showStamp}
              onChange={(e) => setShowStamp(e.target.checked)}
              className="w-4 h-4 rounded text-primary"
            />
            <span>إظهار ختم الروضة الرسمي</span>
          </label>
        </div>
      </div>

      {/* Realistic A4 Paper (210mm x 297mm) */}
      <div className="w-full max-w-[800px] bg-white text-slate-900 p-10 rounded-2xl shadow-xl border border-slate-200 select-none print:m-0 print:p-8 print:shadow-none print:border-none print:max-w-none print:rounded-none">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="text-right text-[11px] leading-relaxed text-slate-700">
              <div className="font-bold text-slate-900 text-sm">المملكة العربية السعودية</div>
              <div>وزارة التعليم</div>
              <div>الإدارة العامة للتعليم الأهلي والأجنبي</div>
              <div className="font-semibold text-slate-900 mt-1">{kindergartenName}</div>
              <div className="text-slate-500 font-mono text-[10px]">{branchName}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                <span className="material-symbols-outlined text-[36px]">school</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 mt-1">روضتي OS</span>
            </div>

            <div className="text-left text-[11px] leading-relaxed font-mono text-slate-700">
              <div>رقم الاستمارة: <strong className="text-slate-900">REG-{currentChild ? currentChild.id.slice(0, 6).toUpperCase() : '2026-NEW'}</strong></div>
              <div>العام الدراسي: <strong className="text-slate-900">{academicYear}</strong></div>
              <div>تاريخ الطباعة: {new Date().toISOString().slice(0, 10)}</div>
              <div>الحالة: {currentChild ? 'مقيد وموثق' : 'طلب التحاق جديد'}</div>
            </div>
          </div>

          <div className="text-center mt-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              استمارة تسجيل وقيد طفل في رياض الأطفال
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              (ملف القيد الرسمي المعتمد للتسجيل والأرشفة المدرسية)
            </p>
          </div>
        </div>

        {/* Section 1: Child Information */}
        <div className="mb-6">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
            <span>أولاً: البيانات الشخصية للطفل</span>
            <span className="text-xs font-normal text-slate-600 font-mono">CHILD INFORMATION</span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="col-span-2 border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">الاسم الرباعي للطفل:</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                {currentChild ? `${currentChild.firstName} ${currentChild.lastName}` : '..........................................................'}
              </span>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">الجنس:</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {currentChild ? (currentChild.gender === 'male' ? 'ذكر' : 'أنثى') : 'ذكر [ ] / أنثى [ ]'}
              </span>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">تاريخ الميلاد:</span>
              <span className="font-bold text-slate-900 font-mono block mt-0.5">
                {currentChild?.birthDate || 'YYYY / MM / DD'}
              </span>
            </div>

            <div className="col-span-2 border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">الفصل والصف المقترح:</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {currentClassroom?.name || 'فصل تمهيدي / روضة أولى'}
              </span>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">فصيلة الدم:</span>
              <span className="font-bold text-slate-900 font-mono block mt-0.5">
                {currentChild ? 'O+' : '.....'}
              </span>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">حالة القيد:</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {currentChild?.status === 'active' ? 'منتظم' : 'مستجد'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Health & Medical Alerts */}
        <div className="mb-6">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
            <span>ثانياً: الإقرار الصحي والمحاذير الطبية</span>
            <span className="text-xs font-normal text-slate-600 font-mono">HEALTH RECORD</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">الحساسيات الغذائية أو الدوائية المسجلة:</span>
              <span className="font-semibold text-slate-800 block mt-1">
                {currentChild?.allergies || 'سليم، لا توجد حساسيات خاصة مسجلة'}
              </span>
            </div>

            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">الملاحظات والتوصيات الطبية:</span>
              <span className="font-semibold text-slate-800 block mt-1">
                {currentChild?.medicalNotes || 'لا توجد أدوية دورية أو توصيات خاصة أثناء ساعات الدوام'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Guardians and Authorizations */}
        <div className="mb-6">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
            <span>ثالثاً: بيانات أولياء الأمور والمفوضين بالاستلام</span>
            <span className="text-xs font-normal text-slate-600 font-mono">GUARDIANS & PICKUP</span>
          </div>

          <table className="w-full text-right text-xs border border-slate-200 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="p-2">صفة القرابة</th>
                <th className="p-2">الاسم الثلاثي</th>
                <th className="p-2">الهوية الوطنية / الإقامة</th>
                <th className="p-2">رقم الجوال الأساسي</th>
                <th className="p-2">صلاحية الاستلام للبوابة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 font-bold">ولي الأمر الأساسي</td>
                <td className="p-2">{currentChild ? `والد الطفل (${currentChild.lastName})` : '................................'}</td>
                <td className="p-2 font-mono">10xxxxxxxx</td>
                <td className="p-2 font-mono dir-ltr text-right">05xxxxxxxx</td>
                <td className="p-2 font-bold text-emerald-700">مصرح دائم</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">الأم</td>
                <td className="p-2">................................</td>
                <td className="p-2 font-mono">................</td>
                <td className="p-2 font-mono dir-ltr text-right">05xxxxxxxx</td>
                <td className="p-2 font-bold text-emerald-700">مصرح دائم</td>
              </tr>
              <tr>
                <td className="p-2 text-slate-600">مفوض طوارئ / سائق</td>
                <td className="p-2">................................</td>
                <td className="p-2 font-mono">................</td>
                <td className="p-2 font-mono dir-ltr text-right">................</td>
                <td className="p-2 text-slate-600">مشروط بالبطاقة الذكية</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Legal Undertaking & Signatures */}
        <div className="pt-2">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
            <span>رابعاً: الإقرار والتعهد والتوقيعات الرسمية</span>
            <span className="text-xs font-normal text-slate-600 font-mono">APPROVAL & STAMP</span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed mb-6">
            أقر أنا ولي أمر الطفل المذكور أعلاه بصحة كافة البيانات المدونة بهذه الاستمارة، وأوافق على لائحة روضتي الداخلية وتعليمات بوابة الاستلام الآمن، وأتعهد بإشعار الإدارة فوراً بأي تغيير في أرقام الاتصال أو المفوضين بالاستلام.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4">
            <div className="space-y-12">
              <span className="font-bold text-slate-900 block">توقيع ولي الأمر</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>

            <div className="space-y-12">
              <span className="font-bold text-slate-900 block">مسؤولة التسجيل والقبول</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>

            <div className="relative flex flex-col items-center justify-center">
              <span className="font-bold text-slate-900 block mb-2">اعتماد ومديرة الروضة</span>
              {showStamp ? (
                <div className="w-24 h-24 rounded-full border-4 border-emerald-700 text-emerald-800 flex flex-col items-center justify-center rotate-[-12deg] p-1 font-bold text-[9px] select-none opacity-85 shadow-xs">
                  <div className="border-b border-emerald-700 w-full text-center pb-0.5">روضتي الأهلية</div>
                  <div className="my-0.5 text-[10px]">مـعـتـمـد</div>
                  <div className="border-t border-emerald-700 w-full text-center pt-0.5">فرع القبول 1446</div>
                </div>
              ) : (
                <div className="w-24 h-24 border border-dashed border-slate-300 rounded-full flex items-center justify-center text-[10px] text-slate-400">
                  موضع الختم
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
