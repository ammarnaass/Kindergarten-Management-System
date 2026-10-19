import { AuditTimelineCard } from '../AuditTimelineCard'

interface ChildAuditTabProps {
  child: any
  invoices?: any[]
}

export function ChildAuditTab({ child, invoices = [] }: ChildAuditTabProps) {
  return (
    <div className="space-y-space-lg select-none animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">history</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-label-lg">سجل العمليات والتدقيق الأمني المعتمد</h3>
            <p className="text-caption text-on-surface-variant">
              التسلسل الزمني لكافة التعديلات والإجراءات الصادرة على ملف الطفل
            </p>
          </div>
        </div>

        <span className="font-mono text-caption text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
          Audit Trail Log
        </span>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <AuditTimelineCard child={child} invoices={invoices} />
      </div>
    </div>
  )
}
