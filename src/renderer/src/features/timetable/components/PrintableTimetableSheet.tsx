import type { TimetablePeriod } from '../types'

interface PrintableTimetableSheetProps {
  periods: TimetablePeriod[]
  classroomName?: string | null
  kindergartenName: string
  academicYear: string
  onClose: () => void
}

export function PrintableTimetableSheet({
  periods,
  classroomName,
  kindergartenName,
  academicYear,
  onClose
}: PrintableTimetableSheetProps) {
  const sortedPeriods = [...periods].sort((a, b) => a.periodNumber - b.periodNumber)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Screen Controls Header (Hidden during print) */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-[22px]">print</span>
            <span className="font-bold text-title-md">معاينة طباعة الجدول الزمني الرسمي (A4)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-label-md rounded-xl shadow-xs flex items-center gap-2 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>طباعة المستند الآن</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (Styled for A4) */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0 print:m-0 print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6 flex items-center justify-between">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase block tracking-wider">
                المملكة العربية السعودية — وزارة التعليم
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{kindergartenName}</h1>
              <p className="text-sm font-semibold text-slate-600">
                البرنامج اليومي للتعليم المبكر — العام الدراسي {academicYear}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[160px]">
              <span className="text-xs font-bold text-slate-500 block">نطاق الجدول:</span>
              <strong className="text-base font-extrabold text-blue-700 block">
                {classroomName || 'الجدول العام المعتمد'}
              </strong>
              <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden border border-slate-300 rounded-xl mb-6">
            <table className="w-full border-collapse text-right text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="py-3 px-3 text-center w-16 border-l border-slate-300">الفترة</th>
                  <th className="py-3 px-4 w-36 border-l border-slate-300">التوقيت</th>
                  <th className="py-3 px-4 border-l border-slate-300">اسم النشاط والبرنامج</th>
                  <th className="py-3 px-4 border-l border-slate-300">المشرفة المكلفة</th>
                  <th className="py-3 px-4">الأهداف والتوجيهات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedPeriods.map((period) => (
                  <tr key={period.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-bold font-mono border-l border-slate-200 bg-slate-50">
                      {period.periodNumber}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 border-l border-slate-200 whitespace-nowrap">
                      {period.startTime} — {period.endTime}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 border-l border-slate-200">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: period.color }}
                        />
                        <span>{period.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 border-l border-slate-200">
                      {period.supervisorStaffName || 'معلمة الفصل'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed">
                      {period.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guidelines Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 mb-8">
            <strong className="font-bold text-slate-900 block mb-1">تعليمات الالتزام بجدول التوقيت:</strong>
            <p>1. يلتزم الكادر التعليمي بالانتقال بين الفترات وفق النغمات والجرس الصوتي المحدد دون تأخير.</p>
            <p>2. يتم تسليم الأطفال عند الانصراف الساعة 01:15 ظهراً وفق البطاقات المشفرة وبإشراف مسؤولات المناوبة.</p>
            <p>3. يُرجى من أولياء الأمور الكرام الالتزام بمواعيد الحضور الصباحي والانصراف المحددة أعلاه.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-700">
            <div>
              <span className="block font-bold text-slate-900 mb-8">رائدة الفصل / المعلمة</span>
              <span className="block border-t border-slate-300 pt-2 font-mono">التوقيع: .....................</span>
            </div>

            <div>
              <span className="block font-bold text-slate-900 mb-8">وكيلة الشؤون التعليمية</span>
              <span className="block border-t border-slate-300 pt-2 font-mono">التوقيع: .....................</span>
            </div>

            <div>
              <span className="block font-bold text-slate-900 mb-8">مديرة الروضة والاعتماد</span>
              <span className="block border-t border-slate-300 pt-2 font-mono">الختم والتوقيع: .....................</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
