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

interface GateActivityFeedProps {
  logs?: GateLogItem[]
  onSelectChild?: (childName: string) => void
}

export function GateActivityFeed({ logs, onSelectChild }: GateActivityFeedProps) {
  const defaultLogs: GateLogItem[] = [
    {
      id: 'l1',
      childName: 'سارة بنت علي بن علي',
      classroom: 'فصل النجوم',
      time: '16:22',
      receiver: 'طارق بن علي (الأب)',
      status: 'مكتمل بنجاح',
      gate: 'بوابة 01',
      staff: 'أ. نادية المنصوري'
    },
    {
      id: 'l2',
      childName: 'كريم منصور',
      classroom: 'فصل الفراشات',
      time: '16:15',
      receiver: 'خديجة منصور (الأم)',
      status: 'مكتمل بنجاح',
      gate: 'بوابة 01',
      staff: 'أ. نادية المنصوري'
    },
    {
      id: 'l3',
      childName: 'ريما الفاسي',
      classroom: 'فصل الزهور',
      time: '16:05',
      receiver: 'حليم الفاسي (الجد)',
      status: 'مكتمل بنجاح',
      gate: 'بوابة 02',
      staff: 'أ. ليلى عمار'
    }
  ]

  const displayLogs = logs && logs.length > 0 ? logs : defaultLogs

  const queueItems = [
    { name: 'لينا الجزائري', class: 'فصل النجوم', timeIn: '08:00 ص' },
    { name: 'آدم بلحاج', class: 'فصل الفراشات', timeIn: '08:10 ص' },
    { name: 'يوسف بن عمار', class: 'فصل الفراشات', timeIn: '07:45 ص' },
    { name: 'أحمد خالد الزين', class: 'فصل البراعم', timeIn: '08:15 ص' }
  ]

  return (
    <aside className="flex flex-col gap-space-md select-none">
      {/* Live Gate Pickup Log Container */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              حركات الاستلام اللحظية
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-caption text-caption font-semibold">
            اليوم (35 حركة)
          </span>
        </div>

        {/* Activity Timeline Items */}
        <div className="space-y-2.5">
          {displayLogs.map((log, idx) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg transition-colors border ${
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
      </div>

      {/* Remaining Waiting Queue */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-xl">pending_actions</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              في انتظار الاستلام (13)
            </h3>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">انصراف اليوم</span>
        </div>

        <div className="space-y-2">
          {queueItems.map((q, idx) => (
            <div
              key={idx}
              onClick={() => onSelectChild?.(q.name)}
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <span className="font-label-md text-label-md font-semibold text-on-surface block">
                  {q.name}
                </span>
                <span className="font-caption text-caption text-on-surface-variant">
                  {q.class} • دخول: {q.timeIn}
                </span>
              </div>
              <button
                className="p-1 rounded-md text-primary hover:bg-surface-container-lowest"
                title="تحديد واستدعاء"
                type="button"
              >
                <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
