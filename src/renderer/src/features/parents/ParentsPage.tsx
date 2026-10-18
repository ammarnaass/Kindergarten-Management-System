import React from 'react'
import { useParentsData } from './hooks/useParentsData'
import { GsmModemBanner } from './components/GsmModemBanner'
import { ParentsHeaderActions } from './components/ParentsHeaderActions'
import { ParentsKpiGrid } from './components/ParentsKpiGrid'
import { ParentsFilterToolbar } from './components/ParentsFilterToolbar'
import { GuardiansDirectorySection } from './components/GuardiansDirectorySection'
import { GuardianMasterCard } from './components/GuardianMasterCard'
import { QuickDispatchConsole } from './components/QuickDispatchConsole'
import { OperationalShortcutsStrip } from './components/OperationalShortcutsStrip'
import { AddGuardianModal } from './components/AddGuardianModal'
import { AddPickupModal } from './components/AddPickupModal'
import { BroadcastModal } from './components/BroadcastModal'
import { PickupCardModal } from './components/PickupCardModal'

export default function ParentsPage() {
  const {
    guardians,
    setGuardians,
    childrenList,
    classrooms,
    loading,
    selectedGuardian,
    selectedGuardianPickups,
    searchQuery,
    setSearchQuery,
    classroomFilter,
    setClassroomFilter,
    authFilter,
    setAuthFilter,
    categoryTab,
    setCategoryTab,
    viewMode,
    setViewMode,
    stats,
    filteredGuardians,
    dispatchText,
    setDispatchText,
    dispatchFeedback,
    setDispatchFeedback,
    searchInputRef,
    isAddGuardianOpen,
    setIsAddGuardianOpen,
    isAddPickupOpen,
    setIsAddPickupOpen,
    isBroadcastOpen,
    setIsBroadcastOpen,
    isPickupCardOpen,
    setIsPickupCardOpen,
    fetchData,
    setSelectedGuardianId,
    handleQuickDispatch,
    handleRevokePickup,
    handleExportCsv,
    resetFilters
  } = useParentsData()

  return (
    <div className="w-full min-h-screen px-space-lg py-4 flex flex-col gap-space-lg select-none">
      {/* 1. Dynamic Notification / Local GSM Banner */}
      <GsmModemBanner
        onCheckNumbers={() => {
          setDispatchFeedback('تم فحص أرقام أولياء الأمور: 100% صالحة محلياً.')
          setTimeout(() => setDispatchFeedback(null), 3000)
        }}
      />

      {/* 2. Page Header & Actions */}
      <ParentsHeaderActions
        onOpenAddGuardian={() => setIsAddGuardianOpen(true)}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenPickupCard={() => {
          if (selectedGuardian) setIsPickupCardOpen(true)
        }}
        onExportCsv={handleExportCsv}
        hasSelectedGuardian={Boolean(selectedGuardian)}
      />

      {/* 3. KPI Metric Cards Grid */}
      <ParentsKpiGrid stats={stats} />

      {/* 4. Search, Filter & View Controls */}
      <ParentsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
        classroomFilter={classroomFilter}
        onClassroomFilterChange={setClassroomFilter}
        classrooms={classrooms}
        authFilter={authFilter}
        onAuthFilterChange={setAuthFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categoryTab={categoryTab}
        onCategoryTabChange={setCategoryTab}
        stats={stats}
      />

      {/* 5. Split View Workspace */}
      <div className="grid grid-cols-12 gap-space-lg items-start">
        {/* RIGHT SECTION: Directory Table / Cards */}
        <GuardiansDirectorySection
          guardians={guardians}
          filteredGuardians={filteredGuardians}
          selectedGuardianId={selectedGuardian?.id || null}
          viewMode={viewMode}
          loading={loading}
          onSortAlpha={() => {
            setGuardians((prev) => [...prev].sort((a, b) => a.firstName.localeCompare(b.firstName, 'ar')))
          }}
          onRefresh={fetchData}
          onResetFilters={resetFilters}
          onSelectGuardian={setSelectedGuardianId}
          onQuickDispatch={handleQuickDispatch}
          onOpenPickupCard={(g) => {
            setSelectedGuardianId(g.id)
            setIsPickupCardOpen(true)
          }}
        />

        {/* LEFT SECTION: Selected Guardian Family Master Card & Quick Dispatch */}
        <div className="col-span-12 lg:col-span-5 2xl:col-span-4 flex flex-col gap-space-md">
          {selectedGuardian ? (
            <>
              <GuardianMasterCard
                guardian={selectedGuardian}
                pickups={selectedGuardianPickups}
                onOpenPickupCard={() => setIsPickupCardOpen(true)}
                onOpenAddPickup={() => setIsAddPickupOpen(true)}
                onRevokePickup={handleRevokePickup}
                onActionFeedback={(msg) => {
                  setDispatchFeedback(msg)
                  setTimeout(() => setDispatchFeedback(null), 3000)
                }}
              />

              <QuickDispatchConsole
                guardian={selectedGuardian}
                dispatchText={dispatchText}
                onDispatchTextChange={setDispatchText}
                dispatchFeedback={dispatchFeedback}
                onSendDispatch={handleQuickDispatch}
              />
            </>
          ) : (
            <div className="p-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant/20">
              يرجى اختيار ولي أمر من القائمة لمعاينة ملف الأسرة والتفويضات.
            </div>
          )}
        </div>
      </div>

      {/* 6. Operational Shortcuts Hint Strip */}
      <OperationalShortcutsStrip />

      {/* Modals */}
      <AddGuardianModal
        isOpen={isAddGuardianOpen}
        onClose={() => setIsAddGuardianOpen(false)}
        onSuccess={fetchData}
        childrenList={childrenList}
      />

      <AddPickupModal
        isOpen={isAddPickupOpen}
        onClose={() => setIsAddPickupOpen(false)}
        onSuccess={fetchData}
        childrenList={childrenList}
        defaultChildId={selectedGuardian?.children[0]?.childId}
      />

      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        totalGuardians={guardians.length}
      />

      <PickupCardModal
        isOpen={isPickupCardOpen}
        onClose={() => setIsPickupCardOpen(false)}
        guardian={selectedGuardian}
      />
    </div>
  )
}
