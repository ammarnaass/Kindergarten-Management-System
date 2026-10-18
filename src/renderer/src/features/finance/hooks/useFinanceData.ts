import { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'
import type { ChildItem, InvoiceItem, PaymentFormState, FinanceTab } from '../types'

export function useFinanceData() {
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<FinanceTab>('pos')
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [childPickerOpen, setChildPickerOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [childSearch, setChildSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [lastReceiptNumber, setLastReceiptNumber] = useState<string>('')

  // Initial clean form state without mock data
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

  // 1. Fetch classrooms
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

  // 2. Fetch children list when picker is open
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

  // 3. Fetch selected child's invoices
  const { data: invoices = [], isLoading: invoicesLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ['invoices:child', form.childId],
    queryFn: () => (form.childId ? api.finance.listByChild(form.childId) : Promise.resolve([])),
    enabled: Boolean(form.childId),
  })

  // 4. Fetch recent payments
  const { data: recentPayments = [], refetch: refetchRecentPayments } = useQuery({
    queryKey: ['payments:recent'],
    queryFn: () => api.finance.recentPayments(25),
  })

  // Compute outstanding balance
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

  // Currently selected invoice
  const selectedInvoice = useMemo(() => {
    if (!form.selectedInvoiceId) return null
    return invoices.find((i) => i.id === form.selectedInvoiceId) ?? null
  }, [invoices, form.selectedInvoiceId])

  // Auto-select unpaid invoice
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

  // Select a child
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

  // Quick invoice creation
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
            unitCents: 2000000, // 20,000 DZD
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

  // Record payment
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

  // Global Keyboard Shortcuts
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

  return {
    activeTab,
    setActiveTab,
    bulkModalOpen,
    setBulkModalOpen,
    childPickerOpen,
    setChildPickerOpen,
    historyOpen,
    setHistoryOpen,
    childSearch,
    setChildSearch,
    isSubmitting,
    isCreatingInvoice,
    lastReceiptNumber,
    form,
    handleFormChange,
    handleCancel,
    classroomMap,
    childrenData,
    childrenLoading,
    invoices,
    invoicesLoading,
    recentPayments,
    refetchRecentPayments,
    dueBalance,
    selectedInvoice,
    handleSelectChild,
    handleQuickCreateInvoice,
    handleSaveAndPrint,
    handleSaveOnly,
    handleLedgerQuickPay
  }
}
