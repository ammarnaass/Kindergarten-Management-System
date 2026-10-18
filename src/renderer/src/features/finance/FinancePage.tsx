import React from 'react'
import { FinanceBanner } from './components/FinanceBanner'
import { FinancePosSection } from './components/FinancePosSection'
import { InvoicesLedgerTable } from './components/InvoicesLedgerTable'
import { ChildPickerModal } from './components/ChildPickerModal'
import { RecentPaymentsHistoryModal } from './components/RecentPaymentsHistoryModal'
import { BulkMonthlyBillingModal } from './components/BulkMonthlyBillingModal'
import { useFinanceData } from './hooks/useFinanceData'

export default function FinancePage() {
  const {
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
    recentPayments,
    refetchRecentPayments,
    dueBalance,
    selectedInvoice,
    handleSelectChild,
    handleQuickCreateInvoice,
    handleSaveAndPrint,
    handleSaveOnly,
    handleLedgerQuickPay
  } = useFinanceData()

  return (
    <div className="flex flex-col w-full gap-space-lg select-none pb-24">
      {/* 1. Header Banner & POS indicator */}
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

      {/* 2. Main Tab Content */}
      {activeTab === 'pos' ? (
        <FinancePosSection
          form={form}
          invoices={invoices}
          dueBalance={dueBalance}
          selectedInvoice={selectedInvoice}
          lastReceiptNumber={lastReceiptNumber}
          onChange={handleFormChange}
          onSaveAndPrint={handleSaveAndPrint}
          onSaveOnly={handleSaveOnly}
          onCancel={handleCancel}
          onSelectChildModal={() => setChildPickerOpen(true)}
          onQuickCreateInvoice={handleQuickCreateInvoice}
          isCreatingInvoice={isCreatingInvoice}
          isSubmitting={isSubmitting}
        />
      ) : (
        <InvoicesLedgerTable
          onQuickPay={handleLedgerQuickPay}
          onOpenBulkModal={() => setBulkModalOpen(true)}
        />
      )}

      {/* 3. Child Search Modal (F2) */}
      <ChildPickerModal
        isOpen={childPickerOpen}
        onClose={() => setChildPickerOpen(false)}
        search={childSearch}
        onSearchChange={setChildSearch}
        childrenData={childrenData}
        isLoading={childrenLoading}
        classroomMap={classroomMap}
        onSelectChild={handleSelectChild}
      />

      {/* 4. Recent Payments History Modal */}
      <RecentPaymentsHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        recentPayments={recentPayments}
      />

      {/* 5. Bulk Monthly Billing Modal */}
      <BulkMonthlyBillingModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />
    </div>
  )
}
