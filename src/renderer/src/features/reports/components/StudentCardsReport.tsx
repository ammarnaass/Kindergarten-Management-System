import { useMemo } from 'react'
import type { ChildItem, ClassroomItem } from '@/lib/api/types'

interface StudentCardsReportProps {
  childrenList: ChildItem[]
  classrooms?: ClassroomItem[]
  selectedClassroomId: string
  kindergartenName: string
  branchName: string
  academicYear: string
}

export function StudentCardsReport({
  childrenList,
  classrooms = [],
  selectedClassroomId,
  kindergartenName,
  branchName,
  academicYear
}: StudentCardsReportProps) {
  const filteredChildren = useMemo(() => {
    if (selectedClassroomId === 'ALL') {
      return childrenList
    }
    return childrenList.filter((c) => c.classroomId === selectedClassroomId)
  }, [childrenList, selectedClassroomId])

  // Simple deterministic barcode generator for offline badges
  const renderBarcode = (code: string) => {
    const bars = []
    for (let i = 0; i < 30; i++) {
      const isThick = (code.charCodeAt(i % code.length) + i) % 2 === 0
      bars.push(
        <rect
          key={i}
          x={i * 6}
          y="0"
          width={isThick ? 4 : 2}
          height="32"
          fill="#1F2937"
        />
      )
    }
    return (
      <svg className="w-44 h-8 mx-auto" viewBox="0 0 180 32">
        {bars}
      </svg>
    )
  }

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs print:border-none print:shadow-none print:p-0">
      {/* Non-print instructions */}
      <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-body-sm flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
          <div>
            <h3 className="font-bold text-on-surface">بطاقات الهوية المدرسية والاستلام الآمن (PVC / A4)</h3>
            <p className="text-caption text-on-surface-variant">
              مجهزة بتنسيق 8 بطاقات في صفحة A4 واحدة. يمكن طباعتها وتغليفها حرارياً وتسليمها لأولياء الأمور للبوابة.
            </p>
          </div>
        </div>
        <div className="text-left font-mono font-bold text-caption text-primary">
          جاهز لطباعة: {filteredChildren.length} بطاقة
        </div>
      </div>

      {filteredChildren.length === 0 ? (
        <div className="py-16 text-center text-on-surface-variant bg-surface-container-low/30 rounded-xl">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">badge</span>
          <p className="text-body-md font-semibold text-on-surface">لا يوجد أطفال لطباعة بطاقاتهم في هذا الفصل</p>
        </div>
      ) : (
        /* Grid of 2 columns on A4 page */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
          {filteredChildren.map((child) => (
            <div
              key={child.id}
              className="relative p-4 rounded-2xl border-2 border-outline-variant/60 bg-surface-container-lowest shadow-xs flex flex-col justify-between overflow-hidden page-break-inside-avoid print:border-dashed print:border-gray-400 print:shadow-none"
              style={{ minHeight: '230px' }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-caption">
                    <span className="material-symbols-outlined text-[16px]">child_care</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-label-sm text-primary leading-tight">
                      {kindergartenName || 'روضتي النموذجية'}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant block">
                      {branchName || 'الفرع الرئيسي'} • {academicYear || '1446-1447هـ'}
                    </span>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-bold text-[10px] border border-secondary/20">
                  بطاقة استلام مصرح
                </div>
              </div>

              {/* Card Body */}
              <div className="flex items-center gap-3 my-2">
                {/* Child Avatar / Photo */}
                <div className="w-16 h-16 rounded-xl bg-surface-container-high border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-headline-sm overflow-hidden flex-shrink-0">
                  {child.photoPath ? (
                    <img src={child.photoPath} alt={child.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{child.firstName.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-headline-sm text-on-surface truncate leading-tight">
                    {child.firstName} {child.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold text-[11px]">
                      {classrooms.find((c) => c.id === child.classroomId)?.name || 'غير مسكن بفصل'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {child.gender === 'female' ? 'أنثى' : 'ذكر'}
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                    القيد: <span dir="ltr">{child.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Barcode & Pickup ID Footer */}
              <div className="pt-2 border-t border-outline-variant/30 flex flex-col items-center justify-center bg-surface-container-low/40 -mx-4 -mb-4 p-2.5">
                {renderBarcode(child.id.replace(/-/g, '').slice(0, 16))}
                <div className="flex items-center justify-between w-full px-2 text-[10px] font-mono text-on-surface-variant mt-1">
                  <span>رمز التحقق: {child.id.slice(0, 8).toUpperCase()}</span>
                  <span>المسح الآمن للبوابة</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
