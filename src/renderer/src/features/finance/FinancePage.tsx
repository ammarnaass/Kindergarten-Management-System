import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FinanceBanner } from './components/FinanceBanner'
import { PaymentEntryForm, PaymentFormState } from './components/PaymentEntryForm'
import { ReceiptPreviewCanvas } from './components/ReceiptPreviewCanvas'
import { InvoicesLedgerTable } from './components/InvoicesLedgerTable'
import { BulkMonthlyBillingModal } from './components/BulkMonthlyBillingModal'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { ChildItem, InvoiceItem } from '@/lib/api/types'

export default function FinancePage() {
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<'pos' | 'ledger'>('pos')
  const [bulkModalOpen, setBulkModalOpen] = useState(false)

  // حالة نموذج الدفعة — تبدأ فارغة ونظيفة دون أي بيانات وهمية
  const [form, setForm] = useState<PaymentFormState>({
    childId: undefined,
    childName: '',
    classroom: '',
    guardianName: '',
    guardianPhone: '',
    amount: 0,
    paymentMethod: 'cash',
    reference: '',
    note: '',
    selectedInvoiceId: null,
  })

  const [childPickerOpen, setChildPickerOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [childSearch, setChildSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [lastReceiptNumber, setLastReceiptNumber] = useState<string>('')

  // 1. جلب الفصول لربط معرف الفصل باسمه
  const { data: classrooms = [] } = useQuery({
    queryKey: ['classrooms:list'],
    queryFn: () => api.classrooms.list(),
  })

  const classroomMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of classrooms) {
      map.set(c.id, c.name)
    }
    return map
  }, [classrooms])

  // 2. جلب قائمة الأطفال للبحث والاختيار
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ['children:list', { search: childSearch, status: 'active' }],
    queryFn: () =>
      api.children.list({
        search: childSearch,
        status: 'active',
        limit: 30,
        offset: 0,
      }),
    enabled: childPickerOpen,
  })

  // 3. جلب فواتير الطفل المحدد
  const { data: invoices = [], isLoading: invoicesLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ['invoices:child', form.childId],
    queryFn: () => (form.childId ? api.finance.listByChild(form.childId) : Promise.resolve([])),
    enabled: Boolean(form.childId),
  })

  // 4. جلب المدفوعات المسجلة اليوم لسجل الإيصالات
  const { data: recentPayments = [], refetch: refetchRecentPayments } = useQuery({
    queryKey: ['payments:recent'],
    queryFn: () => api.finance.recentPayments(25),
  })

  // حساب إجمالي المستحقات غير المسددة للطفل
  const dueBalance = useMemo(() => {
    if (!invoices.length) return '0 دج'
    const totalRemaining = invoices.reduce((acc, inv) => {
      const rem =
        inv.remainingCents ??
        Math.max(0, inv.totalCents - inv.discountCents - (inv.paidCents ?? 0))
      return acc + rem
    }, 0)
    return `${(totalRemaining / 100).toLocaleString('ar-DZ')} دج`
  }, [invoices])

  // تحديد الفاتورة المحددة حالياً
  const selectedInvoice = useMemo(() => {
    if (!form.selectedInvoiceId) return null
    return invoices.find((i) => i.id === form.selectedInvoiceId) ?? null
  }, [invoices, form.selectedInvoiceId])

  // عند تحميل فواتير الطفل، نقوم بتحديد الفاتورة المعلقة الأولى تلقائياً
  useEffect(() => {
    if (invoices.length > 0 && !form.selectedInvoiceId) {
      const unpaid = invoices.find((i) => i.status !== 'paid') || invoices[0]
      if (unpaid) {
        const remaining = (unpaid.remainingCents ?? (unpaid.totalCents - unpaid.discountCents)) / 100
        setForm((prev) => ({
          ...prev,
          selectedInvoiceId: unpaid.id,
          amount: remaining > 0 ? remaining : (unpaid.totalCents - unpaid.discountCents) / 100,
          note: unpaid.period ? `سداد ${unpaid.period}` : 'سداد قسط دراسي',
        }))
      }
    }
  }, [invoices, form.selectedInvoiceId])

  const handleFormChange = (updated: Partial<PaymentFormState>) => {
    setForm((prev) => ({ ...prev, ...updated }))
  }

  // اختيار طفل من النافذة
  const handleSelectChild = async (child: ChildItem) => {
    const clsName = child.classroomId ? classroomMap.get(child.classroomId) || 'فصل مسجل' : 'غير مسكن'
    let guardianName = ''
    let guardianPhone = ''

    try {
      const guardians = await api.children.getGuardians(child.id)
      if (guardians && guardians.length > 0) {
        const primary = guardians.find((g: any) => g.isPrimary) || guardians[0]
        guardianName = `${primary.firstName} ${primary.lastName}`
        guardianPhone = primary.phone || ''
      }
    } catch {}

    setForm({
      childId: child.id,
      childName: `${child.firstName} ${child.lastName}`,
      classroom: clsName,
      guardianName: guardianName || 'ولي الأمر',
      guardianPhone: guardianPhone || '',
      amount: 0,
      paymentMethod: 'cash',
      reference: '',
      note: '',
      selectedInvoiceId: null,
    })

    setChildPickerOpen(false)
  }

  // إصدار فاتورة تمدرس سريعة لهذا الشهر إذا لم تكن هناك فواتير
  const handleQuickCreateInvoice = async () => {
    if (!form.childId) return
    setIsCreatingInvoice(true)
    try {
      const now = new Date()
      const currentMonth = now.toLocaleDateString('ar-DZ', { month: 'long', year: 'numeric' })
      const today = now.toISOString().slice(0, 10)

      const newInv = await api.finance.createAndIssue({
        childId: form.childId,
        period: `شهر ${currentMonth}`,
        dueDate: today,
        discountCents: 0,
        items: [
          {
            label: `رسوم التمدرس — شهر ${currentMonth}`,
            quantity: 1,
            unitCents: 2000000, // 20,000 دج
          },
        ],
      })

      toast({
        title: 'تم إصدار الفاتورة',
        description: `تم إصدار الفاتورة ${newInv.number} بنجاح`,
        variant: 'success',
      })

      await refetchInvoices()
      setForm((prev) => ({
        ...prev,
        selectedInvoiceId: newInv.id,
        amount: 20000,
        note: `سداد ${newInv.period || 'رسوم التمدرس'}`,
      }))
    } catch (err: any) {
      toast({
        title: 'فشل إصدار الفاتورة',
        description: err.message || 'حدث خطأ أثناء إصدار الفاتورة',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  // حفظ الدفعة
  const handleSavePayment = async (shouldPrint: boolean) => {
    if (!form.childId || !form.selectedInvoiceId || form.amount <= 0) {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى اختيار الطفل والفاتورة المستهدفة وتحديد مبلغ صحيح للسداد',
        variant: 'warning',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await api.finance.recordPayment({
        invoiceId: form.selectedInvoiceId,
        amountCents: Math.round(form.amount * 100),
        method: form.paymentMethod,
      })

      setLastReceiptNumber(result.receiptNumber)

      toast({
        title: 'تم تسجيل الدفعة بنجاح',
        description: `وصل القبض رقم ${result.receiptNumber} بمبلغ ${form.amount.toLocaleString('ar-DZ')} دج`,
        variant: 'success',
      })

      // تحديث الاستعلامات الحية لتعكس الإحصائيات فوراً
      await refetchInvoices()
      await queryClient.invalidateQueries({ queryKey: ['payments:recent'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard:stats'] })

      if (shouldPrint) {
        setTimeout(() => {
          window.print()
        }, 300)
      }
    } catch (err: any) {
      toast({
        title: 'فشل تسجيل الدفعة',
        description: err.message || 'تعذر تسجيل الدفعة في قاعدة البيانات',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAndPrint = useCallback(() => {
    handleSavePayment(true)
  }, [form])

  const handleSaveOnly = () => {
    handleSavePayment(false)
  }

  const handleCancel = () => {
    setForm({
      childId: undefined,
      childName: '',
      classroom: '',
      guardianName: '',
      guardianPhone: '',
      amount: 0,
      paymentMethod: 'cash',
      reference: '',
      note: '',
      selectedInvoiceId: null,
    })
  }

  // التعامل مع اختصارات لوحة المفاتيح F2 و F10 و Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        setChildPickerOpen(true)
      } else if (e.key === 'F10') {
        e.preventDefault()
        handleSaveAndPrint()
      } else if (e.key === 'Escape') {
        setChildPickerOpen(false)
        setHistoryOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSaveAndPrint])

  const handleLedgerQuickPay = useCallback(
    async (inv: InvoiceItem) => {
      try {
        const child = await api.children.get(inv.childId)
        if (child) {
          const cName = child.classroomId ? classroomMap.get(child.classroomId) || '' : ''
          const rem =
            (inv.remainingCents ??
              inv.totalCents - (inv.discountCents ?? 0) - (inv.paidCents ?? 0)) / 100
          setForm((prev) => ({
            ...prev,
            childId: child.id,
            childName: `${child.firstName} ${child.lastName}`,
            classroom: cName,
            selectedInvoiceId: inv.id,
            amount: rem > 0 ? rem : 0,
          }))
          setActiveTab('pos')
          toast({
            title: 'تم اختيار الفاتورة',
            description: `تم تحديد الفاتورة ${inv.number} للطفل ${child.firstName} ${child.lastName}`,
          })
        }
      } catch {
        setActiveTab('pos')
      }
    },
    [classroomMap]
  )

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-24">
      {/* 1. الترويسة العليا ومؤشر نقطة البيع */}
      <div className="print:hidden">
        <FinanceBanner
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenBulkBilling={() => setBulkModalOpen(true)}
          onViewHistory={() => {
            refetchRecentPayments()
            setHistoryOpen(true)
          }}
        />
      </div>

      {/* 2. المحتوى بناءً على التبويب المختار */}
      {activeTab === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* نموذج تسجيل الدفعة واختيار الفاتورة */}
          <div className="lg:col-span-7 flex flex-col gap-space-md print:hidden">
            <PaymentEntryForm
              form={form}
              invoices={invoices}
              dueBalance={dueBalance}
              onChange={handleFormChange}
              onSaveAndPrint={handleSaveAndPrint}
              onSaveOnly={handleSaveOnly}
              onCancel={handleCancel}
              onSelectChildModal={() => setChildPickerOpen(true)}
              onQuickCreateInvoice={handleQuickCreateInvoice}
              isCreatingInvoice={isCreatingInvoice}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* لوحة المعاينة الحية للوصل المطبوع */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <ReceiptPreviewCanvas
              form={form}
              receiptNumber={lastReceiptNumber || 'REC-2026-000001'}
              selectedInvoice={selectedInvoice}
              onPrint={() => window.print()}
            />
          </div>
        </div>
      ) : (
        <InvoicesLedgerTable
          onQuickPay={handleLedgerQuickPay}
          onOpenBulkModal={() => setBulkModalOpen(true)}
        />
      )}

      {/* 3. نافذة اختيار الطفل بالبحث الفوري (F2) */}
      {childPickerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setChildPickerOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_search</span>
                <span className="font-headline-sm font-bold text-on-surface">
                  اختيار الطفل لسداد الرسوم (F2)
                </span>
              </div>
              <button
                onClick={() => setChildPickerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* حقل البحث الفوري */}
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                autoFocus
                value={childSearch}
                onChange={(e) => setChildSearch(e.target.value)}
                placeholder="ابحث بالاسم أو اللقب..."
                className="w-full h-10 pr-9 pl-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>

            {/* قائمة نتائج الأطفال الحقيقية */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {childrenLoading ? (
                <div className="p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
                  <p className="text-xs">جاري البحث في قاعدة البيانات...</p>
                </div>
              ) : !childrenData?.items || childrenData.items.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-low rounded-xl">
                  <p className="text-on-surface font-semibold text-sm">لم يتم العثور على أطفال</p>
                  <p className="text-on-surface-variant text-xs mt-1">تأكد من كتابة الاسم بشكل صحيح</p>
                </div>
              ) : (
                childrenData.items.map((c) => {
                  const cName = c.classroomId ? classroomMap.get(c.classroomId) || 'فصل مسجل' : 'غير مسكن'
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectChild(c)}
                      className="w-full text-right p-3 rounded-xl hover:bg-surface-container transition-colors flex items-center justify-between group border border-transparent hover:border-outline-variant/60"
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold shadow-2xs">
                          {c.firstName[0]}
                        </div>
                        <div>
                          <p className="font-label-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="font-caption text-caption text-on-surface-variant">
                            {cName} • {c.gender === 'male' ? 'ذكر' : 'أنثى'}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        arrow_back
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. نافذة سجل إيصالات اليوم */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setHistoryOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">history</span>
                <span className="font-headline-sm font-bold text-on-surface">
                  سجل إيصالات اليوم المسجلة
                </span>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {recentPayments.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">receipt</span>
                  <p className="text-on-surface font-semibold text-sm">لا توجد إيصالات مسجلة اليوم</p>
                  <p className="text-on-surface-variant text-xs mt-1">
                    أي دفعة يتم تحصيلها واعتمادها ستظهر هنا فوراً
                  </p>
                </div>
              ) : (
                recentPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-base">payments</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-md font-bold text-on-surface">
                            {p.childFirstName} {p.childLastName}
                          </span>
                          <span className="font-mono text-caption px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                            {p.receiptNumber}
                          </span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                          {p.method === 'cash'
                            ? 'نقداً'
                            : p.method === 'transfer'
                              ? 'تحويل'
                              : p.method === 'cheque'
                                ? 'شيك'
                                : 'بطاقة'}{' '}
                          • {new Date(p.paidAt).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className="font-label-lg font-bold font-mono text-primary">
                      {((p.amountCents || 0) / 100).toLocaleString('ar-DZ')} دج
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. نافذة التوليد الجماعي للاشتراكات الشهرية */}
      <BulkMonthlyBillingModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />
    </div>
  )
}
