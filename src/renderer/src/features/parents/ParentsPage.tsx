import { useParentsData } from './hooks/useParentsData'
import { GsmModemBanner } from './components/GsmModemBanner'
import { ParentsHeaderActions } from './components/ParentsHeaderActions'
import { ParentsKpiGrid } from './components/ParentsKpiGrid'
import { ParentsFilterToolbar } from './components/ParentsFilterToolbar'
import { GuardiansTableView } from './components/GuardiansTableView'
import { GuardiansCardsView } from './components/GuardiansCardsView'
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
    selectedGuardianId,
    setSelectedGuardianId,
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
        <div className="col-span-12 lg:col-span-7 2xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden flex flex-col">
          {/* Table Header & Counter */}
          <div className="p-space-md bg-surface-container-low/40 flex items-center justify-between border-b border-outline-variant/10">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                سجلات أولياء الأمور والمستلمين
              </span>
              <span className="bg-surface-container-high text-primary px-2 py-0.5 rounded-md font-label-sm text-label-sm font-semibold">
                عرض {filteredGuardians.length} من أصل {guardians.length}
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => {
                  setGuardians((prev) => [...prev].sort((a, b) => a.firstName.localeCompare(b.firstName, 'ar')))
                }}
                className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
                title="ترتيب أبجدي"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">sort_by_alpha</span>
              </button>
              <button
                onClick={fetchData}
                className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
                title="تحديث السجلات المحلية"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-2">
              <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>جاري تحميل بيانات السجلات...</span>
            </div>
          ) : filteredGuardians.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
              <p className="font-body-md text-on-surface">لم يتم العثور على أي نتائج مطابقة للتصفية</p>
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary text-label-sm"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <GuardiansTableView
              guardians={filteredGuardians}
              selectedGuardianId={selectedGuardian?.id || null}
              onSelectGuardian={setSelectedGuardianId}
              onQuickDispatch={handleQuickDispatch}
              onOpenPickupCard={(g) => {
                setSelectedGuardianId(g.id)
                setIsPickupCardOpen(true)
              }}
            />
          ) : (
            <GuardiansCardsView
              guardians={filteredGuardians}
              selectedGuardianId={selectedGuardian?.id || null}
              onSelectGuardian={setSelectedGuardianId}
              onOpenPickupCard={(g) => {
                setSelectedGuardianId(g.id)
                setIsPickupCardOpen(true)
              }}
            />
          )}

          {/* Table Footer with Shortcuts info */}
          <div className="p-space-md bg-surface-container-low/60 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
              <span>
                التنقل بالأسهم <kbd className="bg-surface-container-highest px-1 rounded">↑</kbd>{' '}
                <kbd className="bg-surface-container-highest px-1 rounded">↓</kbd> للاختيار السريع
              </span>
              <span className="mx-1">•</span>
              <span>
                اضغط <kbd className="bg-surface-container-highest px-1 rounded">F3</kbd> لإضافة ولي أمر
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-caption text-on-surface-variant font-mono">
              إجمالي السجلات: {filteredGuardians.length}
            </div>
          </div>
        </div>

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
