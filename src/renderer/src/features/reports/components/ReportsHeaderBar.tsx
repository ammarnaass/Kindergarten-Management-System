import React from 'react'

interface ReportsHeaderBarProps {
  onRefresh: () => void
  onPrint: () => void
}

export const ReportsHeaderBar: React.FC<ReportsHeaderBarProps> = ({ onRefresh, onPrint }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 print:hidden">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
          <span className="material-symbols-outlined text-[28px]">print</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-md font-headline-md text-on-surface font-bold">
              مركز التقارير والمطبوعات الرسمية
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-caption text-caption font-semibold">
              نماذج A4 و A5 و 80mm و PVC معتمدة
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            توليد وطباعة الوثائق الرسمية، استمارات التسجيل، بطاقات الطلاب، سندات البوابة، والتقارير بنقرة واحدة
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          title="تحديث البيانات"
          className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md font-semibold shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
          <span>طباعة المستند الحالي (Ctrl+P)</span>
        </button>
      </div>
    </div>
  )
}
