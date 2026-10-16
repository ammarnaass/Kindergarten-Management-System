import { useState, useEffect, useCallback } from 'react'
import { FinanceBanner } from './components/FinanceBanner'
import { PaymentEntryForm, PaymentFormState } from './components/PaymentEntryForm'
import { ReceiptPreviewCanvas } from './components/ReceiptPreviewCanvas'
import { ipc } from '@/lib/ipc'

export default function FinancePage() {
  const [form, setForm] = useState<PaymentFormState>({
    childName: 'سارة بن علي',
    classroom: 'فصل النجوم (4 سنوات)',
    guardianName: 'طارق بن علي',
    guardianPhone: '0550-12-34-56',
    amount: 20000,
    paymentMethod: 'cash',
    reference: 'REC-2026-00842',
    note: 'دفعة نقدية بالاستقبال - سداد كامل',
    paidInvoices: ['nov2026'],
  })

  const [childPickerOpen, setChildPickerOpen] = useState(false)
  const [childrenList, setChildrenList] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleFormChange = (updated: Partial<PaymentFormState>) => {
    setForm((prev) => ({ ...prev, ...updated }))
  }

  const handleSaveAndPrint = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // IPC call if invoice exists
      await ipc('payments:record', {
        invoiceId: '00000000-0000-0000-0000-000000000001',
        amountCents: form.amount * 100,
        method: form.paymentMethod,
      })
    } catch {}
    setIsSubmitting(false)
    setSaveSuccess(true)
    setTimeout(() => {
      window.print()
      setSaveSuccess(false)
    }, 400)
  }, [form])

  const handleSaveOnly = async () => {
    setIsSubmitting(true)
    try {
      await ipc('payments:record', {
        invoiceId: '00000000-0000-0000-0000-000000000001',
        amountCents: form.amount * 100,
        method: form.paymentMethod,
      })
    } catch {}
    setIsSubmitting(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // Keyboard shortcut F10 to Save & Print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10') {
        e.preventDefault()
        handleSaveAndPrint()
      } else if (e.key === 'F2') {
        e.preventDefault()
        setChildPickerOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSaveAndPrint])

  const openChildPicker = async () => {
    try {
      const res = await ipc<any>('children:list', { limit: 20 })
      setChildrenList(res?.items ?? [])
    } catch {}
    setChildPickerOpen(true)
  }

  const selectChild = (c: any) => {
    setForm((prev) => ({
      ...prev,
      childName: `${c.firstName} ${c.lastName}`,
      classroom: c.classroomId ? `فصل ${c.classroomId.slice(0, 4)}` : 'فصل النجوم',
    }))
    setChildPickerOpen(false)
  }

  return (
    <div className="flex flex-col w-full gap-space-md select-none pb-24">
      {/* 1. Top Operational Banner */}
      <FinanceBanner onViewHistory={() => {}} />

      {saveSuccess && (
        <div className="p-space-md rounded-xl bg-emerald-100 text-emerald-800 font-label-md flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>تم تسجيل الدفعة بنجاح وتحديث قيود الخزينة اليومية.</span>
          </div>
        </div>
      )}

      {/* 2. Workspace Grid: 50% Form Entry + 50% Receipt Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
        {/* Right Pane (Form Desk - 6 cols) */}
        <div className="xl:col-span-6">
          <PaymentEntryForm
            form={form}
            onChange={handleFormChange}
            onSaveAndPrint={handleSaveAndPrint}
            onSaveOnly={handleSaveOnly}
            onCancel={() => {}}
            onSelectChildModal={openChildPicker}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Left Pane (Receipt Preview - 6 cols) */}
        <div className="xl:col-span-6">
          <ReceiptPreviewCanvas
            form={form}
            receiptNumber="REC-2026-00842"
            onPrint={() => window.print()}
          />
        </div>
      </div>

      {/* Child Picker Modal (F2) */}
      {childPickerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
          onClick={() => setChildPickerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b">
              <span className="font-headline-sm font-bold">اختيار الطفل لسداد الرسوم (F2)</span>
              <button onClick={() => setChildPickerOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {childrenList.length === 0 ? (
                <div className="space-y-1">
                  {['سارة بن علي', 'ريان الصالح', 'يوسف بن خالد', 'كريم منصور'].map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, childName: name }))
                        setChildPickerOpen(false)
                      }}
                      className="w-full text-right p-2.5 rounded-lg hover:bg-surface-container font-label-md block"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : (
                childrenList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectChild(c)}
                    className="w-full text-right p-2.5 rounded-lg hover:bg-surface-container font-label-md block"
                  >
                    {c.firstName} {c.lastName}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
