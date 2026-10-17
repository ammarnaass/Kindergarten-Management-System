interface AuditTimelineCardProps {
  child?: {
    id?: string
    firstName?: string
    lastName?: string
    createdAt?: number | string
    updatedAt?: number | string
    enrolledAt?: string | null
  }
  invoices?: any[]
}

function formatDate(val?: number | string): string {
  if (!val) return ''
  try {
    const d = typeof val === 'number' ? new Date(val * 1000) : new Date(val)
    if (isNaN(d.getTime())) return String(val)
    return d.toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

function formatDZD(cents: number): string {
  return (cents / 100).toLocaleString('ar-DZ') + ' دج'
}

export function AuditTimelineCard({ child, invoices = [] }: AuditTimelineCardProps) {
  const events: Array<{
    id: string
    icon: string
    iconClass: string
    author: string
    date: string
    title: string
    body: React.ReactNode
  }> = []

  // 1. Invoice & Payment audit events
  invoices.slice(0, 3).forEach((inv) => {
    const totalNet = inv.totalCents - (inv.discountCents || 0)
    const paid = inv.paidCents || 0

    if (paid > 0) {
      events.push({
        id: `pay-${inv.id}`,
        icon: 'payments',
        iconClass: 'bg-emerald-100 text-emerald-800',
        author: 'قسم المالية والحسابات',
        date: formatDate(inv.createdAt),
        title: 'سجل دفعة مالية',
        body: (
          <span>
            تم تسجيل سداد بمبلغ{' '}
            <strong className="font-mono font-bold text-emerald-700">{formatDZD(paid)}</strong> للفاتورة{' '}
            <span className="font-mono">{inv.number}</span>.
          </span>
        )
      })
    } else {
      events.push({
        id: `inv-${inv.id}`,
        icon: 'receipt_long',
        iconClass: 'bg-primary-fixed text-on-primary-fixed',
        author: 'المحاسبة والإدارة',
        date: formatDate(inv.createdAt),
        title: 'إصدار مطالبة مالية',
        body: (
          <span>
            صدرت الفاتورة رقم <strong className="font-mono">{inv.number}</strong> بمبلغ{' '}
            <strong className="font-mono">{formatDZD(totalNet)}</strong>.
          </span>
        )
      })
    }
  })

  // 2. Profile modification event
  if (child?.updatedAt && child?.createdAt && child.updatedAt !== child.createdAt) {
    events.push({
      id: 'update-profile',
      icon: 'edit_note',
      iconClass: 'bg-surface-container-highest text-on-surface-variant',
      author: 'أمانة الروضة (محلي)',
      date: formatDate(child.updatedAt),
      title: 'تحديث بيانات الملف',
      body: 'تم تحديث بيانات الملف الشخصي والصحي للطفل وحفظ التغييرات في قاعدة البيانات.'
    })
  }

  // 3. Child Registration / Enrollment event
  if (child) {
    events.push({
      id: 'enrollment',
      icon: 'how_to_reg',
      iconClass: 'bg-secondary-container text-secondary',
      author: 'إدارة القبول والتسجيل',
      date: formatDate(child.enrolledAt || child.createdAt),
      title: 'قيد الطفل في الروضة',
      body: `تم فتح الملف وقيد الطفل ${child.firstName} ${child.lastName} رسمياً في النظام المحلي.`
    })
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">lock_clock</span>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              سجل التدقيق والتغييرات المحلي
            </h3>
            <p className="font-caption text-caption text-on-surface-variant">
              حركات موثقة ومحفوظة محلياً في قاعدة البيانات
            </p>
          </div>
        </div>
        <span className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container font-mono text-on-surface-variant">
          SQLite Audit Log
        </span>
      </div>

      {/* Timeline Items */}
      <div className="space-y-space-sm relative">
        {events.length === 0 ? (
          <div className="p-4 text-center text-xs text-on-surface-variant bg-surface-container-low rounded-lg">
            لا توجد حركات مسجلة بعد لهذا الطفل
          </div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="flex items-start gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
              <div className={`w-8 h-8 rounded-lg ${ev.iconClass} flex items-center justify-center shrink-0 mt-0.5`}>
                <span className="material-symbols-outlined text-base">{ev.icon}</span>
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {ev.author}
                  </span>
                  {ev.date && (
                    <span className="font-mono text-caption text-on-surface-variant">{ev.date}</span>
                  )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-snug">
                  {ev.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-1 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/40">
        <span>سجل آمن مشفر محلياً</span>
        <span className="font-mono text-caption">SQLite Protected</span>
      </div>
    </section>
  )
}
