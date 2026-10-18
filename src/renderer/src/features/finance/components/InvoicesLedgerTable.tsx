import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { InvoiceItem, ClassroomItem } from '@/lib/api/types'

interface InvoicesLedgerTableProps {
  onQuickPay: (invoice: InvoiceItem) => void
  onOpenBulkModal: () => void
}

type StatusFilter = 'all' | 'overdue' | 'issued' | 'partial' | 'paid' | 'draft'

export function InvoicesLedgerTable({
  onQuickPay,
  onOpenBulkModal
}: InvoicesLedgerTableProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [classroomIdFilter, setClassroomIdFilter] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 25

  // جلب الفصول
  const { data: classrooms = [] } = useQuery<ClassroomItem[]>({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list()
  })

  // استعلام الفواتير الحقيقي
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['invoices:list', { status: statusFilter, search, period: periodFilter, classroomId: classroomIdFilter, page }],
    queryFn: () =>
      api.finance.list({
        status: statusFilter,
        search,
        period: periodFilter || undefined,
        classroomId: classroomIdFilter || undefined,
        limit: pageSize,
        offset: page * pageSize
      })
  })

  const invoices = data?.items ?? []
  const totalInvoices = data?.total ?? 0
  const totalPages = Math.ceil(totalInvoices / pageSize)

  // طباعة الفاتورة محلياً
  const handlePrintInvoice = (inv: InvoiceItem) => {
    const net = (inv.totalCents - (inv.discountCents ?? 0)) / 100
    const paid = (inv.paidCents ?? 0) / 100
    const rem = (inv.remainingCents ?? (inv.totalCents - (inv.discountCents ?? 0) - (inv.paidCents ?? 0))) / 100

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>فاتورة رقم ${inv.number}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; direction: rtl; color: #111; }
            .header { text-align: center; border-bottom: 2px dashed #999; padding-bottom: 16px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; margin: 0; }
            .subtitle { font-size: 13px; color: #555; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 20px; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: right; }
            th { background: #f4f4f4; }
            .summary { margin-top: 20px; border-top: 2px solid #333; padding-top: 10px; font-size: 14px; }
            .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
            .bold { font-weight: bold; font-size: 16px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">روضتي — نظام إدارة رياض الأطفال</h1>
            <p class="subtitle">مطالبة مالية وفاتورة رسمية</p>
          </div>

          <div class="info-grid">
            <div><strong>رقم الفاتورة:</strong> ${inv.number}</div>
            <div><strong>تاريخ الاستحقاق:</strong> ${inv.dueDate}</div>
            <div><strong>الطفل:</strong> ${inv.childFirstName || ''} ${inv.childLastName || ''}</div>
            <div><strong>الفصل:</strong> ${inv.classroomName || 'غير محدد'}</div>
            <div><strong>الشهر المالي:</strong> ${inv.period || '—'}</div>
            <div><strong>الحالة:</strong> ${inv.status === 'paid' ? 'مسددة بالكامل' : inv.status === 'partial' ? 'مسددة جزئياً' : 'مستحقة للدفع'}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>البيان</th>
                <th>المبلغ بالدينار</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>رسوم شهر ${inv.period || ''}</td>
                <td>${net.toLocaleString('ar-DZ')} دج</td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>المبلغ الإجمالي المطلوب:</span>
              <span>${net.toLocaleString('ar-DZ')} دج</span>
            </div>
            <div class="summary-row">
              <span>المبلغ المدفوع حتى الآن:</span>
              <span>${paid.toLocaleString('ar-DZ')} دج</span>
            </div>
            <div class="summary-row bold" style="color: ${rem > 0 ? '#b91c1c' : '#15803d'}">
              <span>المبلغ المتبقي للتحصيل:</span>
              <span>${rem.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>

          <div class="footer">
            <p>تم استخراج هذه المطالبة آلياً بواسطة نظام "روضتي" المكتبي • تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-DZ')}</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* شريط الإجراءات والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* أزرار الحالات */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 'overdue', label: 'متأخرة' },
                { id: 'issued', label: 'مستحقة' },
                { id: 'partial', label: 'جزئية' },
                { id: 'paid', label: 'مسددة' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setStatusFilter(t.id)
                  setPage(0)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === t.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* تصفية الفصل */}
          <select
            value={classroomIdFilter}
            onChange={(e) => {
              setClassroomIdFilter(e.target.value)
              setPage(0)
            }}
            className="h-9 px-3 rounded-xl bg-surface-container border border-outline-variant/60 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">جميع الفصول</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* تصفية الشهر */}
          <input
            type="month"
            value={periodFilter}
            onChange={(e) => {
              setPeriodFilter(e.target.value)
              setPage(0)
            }}
            className="h-9 px-3 rounded-xl bg-surface-container border border-outline-variant/60 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {periodFilter && (
            <button
              type="button"
              onClick={() => setPeriodFilter('')}
              className="p-1 text-on-surface-variant hover:text-primary"
              title="مسح الشهر"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* البحث وزر التوليد الجماعي */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-base text-outline">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="ابحث بالاسم أو رقم الفاتورة..."
              className="w-full h-9 pr-8 pl-3 rounded-xl bg-surface-container border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-2 top-2 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenBulkModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-base">auto_mode</span>
            <span>توليد اشتراكات شهرية</span>
          </button>
        </div>
      </div>

      {/* جدول الفواتير الفعلي */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto scrollbar-thin flex-1">
          <table className="w-full min-w-[800px] text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/60 text-xs font-bold text-on-surface-variant">
                <th className="py-3 px-4">رقم الفاتورة</th>
                <th className="py-3 px-4">الطفل</th>
                <th className="py-3 px-4">الفصل</th>
                <th className="py-3 px-4">الشهر</th>
                <th className="py-3 px-4">تاريخ الاستحقاق</th>
                <th className="py-3 px-4">الصافي</th>
                <th className="py-3 px-4">المدفوع</th>
                <th className="py-3 px-4">المتبقي</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
                    <p className="font-semibold">جاري تحميل الفواتير من قاعدة البيانات...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-on-surface-variant">
                    <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline mb-2">
                      <span className="material-symbols-outlined text-2xl">receipt_long</span>
                    </div>
                    <p className="font-bold text-sm text-on-surface">لا توجد فواتير تطابق هذا البحث</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      يمكنك توليد اشتراكات جديدة أو تعديل خيارات التصفية
                    </p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const net = (inv.totalCents - (inv.discountCents ?? 0)) / 100
                  const paid = (inv.paidCents ?? 0) / 100
                  const rem = (inv.remainingCents ?? (inv.totalCents - (inv.discountCents ?? 0) - (inv.paidCents ?? 0))) / 100

                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 font-bold">
                      مستحقة
                    </span>
                  )
                  if (inv.status === 'paid') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold">
                        مسددة
                      </span>
                    )
                  } else if (inv.status === 'partial') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-bold">
                        جزئية
                      </span>
                    )
                  } else if (inv.isOverdue) {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 font-bold">
                        متأخرة
                      </span>
                    )
                  }

                  return (
                    <tr key={inv.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-on-surface">
                        {inv.number}
                      </td>
                      <td className="py-3 px-4 font-bold text-on-surface">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-2xs">
                            {inv.childFirstName?.[0] || 'ط'}
                          </div>
                          <span>{inv.childFirstName} {inv.childLastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        {inv.classroomName || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-on-surface-variant">
                        {inv.period || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-on-surface-variant">
                        {inv.dueDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-on-surface">
                        {net.toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">
                        {paid.toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            rem > 0 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {rem.toLocaleString('ar-DZ')} دج
                        </span>
                      </td>
                      <td className="py-3 px-4">{statusBadge}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {rem > 0 && (
                            <button
                              type="button"
                              onClick={() => onQuickPay(inv)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs shadow-2xs transition-colors"
                              title="تسجيل دفعة نقدية سريعة"
                            >
                              <span className="material-symbols-outlined text-xs">payments</span>
                              <span>قبض</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handlePrintInvoice(inv)}
                            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="طباعة الفاتورة"
                          >
                            <span className="material-symbols-outlined text-base">print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* تذييل الجدول والتنقل بين الصفحات */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low border-t border-outline-variant/60 text-xs">
          <div className="text-on-surface-variant">
            إجمالي الفواتير: <span className="font-bold text-on-surface">{totalInvoices}</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-40 font-semibold"
              >
                السابق
              </button>
              <span className="font-semibold text-on-surface">
                صفحة {page + 1} من {totalPages}
              </span>
              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-40 font-semibold"
              >
                التالي
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
