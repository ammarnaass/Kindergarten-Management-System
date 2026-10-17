export interface GateLogItem {
  id: string
  childName: string
  classroom: string
  time: string
  receiver: string
  status: string
  gate: string
  staff: string
}

export interface GateQueueItem {
  id: string
  name: string
  classroom?: string
  timeIn?: string
}

interface GateActivityFeedProps {
  logs?: GateLogItem[]
  queueItems?: GateQueueItem[]
  onSelectChild?: (childId: string) => void
}

export function GateActivityFeed({
  logs = [],
  queueItems = [],
  onSelectChild
}: GateActivityFeedProps) {
  return (
    <aside className="flex flex-col gap-space-md select-none">
      {/* Remaining Waiting Queue */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-xl">pending_actions</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              في انتظار الاستلام ({queueItems.length})
            </h3>
          </div>
          <span className="font-caption text-caption text-on-surface-variant font-mono">
            اليوم
          </span>
        </div>

        {queueItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-outline mb-1">done_all</span>
            <p>لا يوجد أطفال في قائمة الانتظار</p>
            <p className="text-[11px] text-outline mt-0.5">
              (إما تم تسليم جميع الحاضرين، أو لم يُسجل الحضور بعد)
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {queueItems.map((q) => (
              <div
                key={q.id}
                onClick={() => onSelectChild?.(q.id)}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors border border-outline-variant/30 group"
              >
                <div>
                  <span className="font-label-md text-label-md font-bold text-on-surface block group-hover:text-primary transition-colors">
                    {q.name}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    {q.classroom || 'عام'} {q.timeIn ? `• دخول: ${q.timeIn}` : ''}
                  </span>
                </div>
                <button
                  className="w-8 h-8 rounded-lg bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-colors shadow-xs"
                  title="تحديد واستدعاء الطفل"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">how_to_reg</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Gate Pickup Log Container */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              حركات الانصراف المكتملة
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-caption text-caption font-semibold">
            {logs.length} حركات
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="py-6 text-center text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-outline mb-1">history</span>
            <p>لا توجد حركات انصراف موثقة حتى الآن اليوم</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {logs.map((log, idx) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-xl transition-colors border ${
                  idx === 0
                    ? 'bg-emerald-100/50 hover:bg-emerald-100 border-emerald-400/30'
                    : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-on-surface">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md font-bold">{log.childName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-caption text-caption">
                      {log.classroom}
                    </span>
                  </div>
                  <span className="font-mono text-caption text-caption text-emerald-800 font-bold">
                    {log.time}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between font-caption text-caption text-on-surface-variant">
                  <span>المستلم: {log.receiver}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    {log.status}
                  </span>
                </div>
                <div className="text-[10px] text-outline mt-0.5">
                  {log.gate} • الموظف: {log.staff}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
