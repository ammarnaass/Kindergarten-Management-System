import React from 'react'
import {
  GateHeaderStatus,
  GateScannerInput,
  ActiveChildVerificationCard,
  GateActivityFeed
} from './index'
import { useSafePickupData } from './hooks/useSafePickupData'
import { getAgeString } from './utils/dateHelpers'

export default function SafePickupPage() {
  const {
    barcode,
    scannerInputRef,
    childrenList,
    childrenMap,
    classroomsMap,
    activeChild,
    activeGuardians,
    deliverySuccessMessage,
    completedLogs,
    waitingQueue,
    completedCount,
    remainingCount,
    setSelectedChildId,
    setBarcode,
    handleBarcodeChange,
    handleConfirmDelivery,
    handleTestScan
  } = useSafePickupData()

  return (
    <div className="flex flex-col w-full select-none gap-space-md">
      {/* Success Notification Toast */}
      {deliverySuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-on-primary px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-2xl">verified</span>
          <span className="font-label-lg text-label-lg font-bold">{deliverySuccessMessage}</span>
        </div>
      )}

      {/* Top Gate Status Banner */}
      <GateHeaderStatus
        completedPickups={completedCount}
        remainingPickups={remainingCount}
      />

      {/* Central Scan & Search Zone */}
      <GateScannerInput
        ref={scannerInputRef}
        barcode={barcode}
        onBarcodeChange={handleBarcodeChange}
        onTestScan={handleTestScan}
        onCameraTrigger={() => alert('كاميرا البوابة متصلة وتعمل بنجاح')}
        onEmergencyAuthorize={() => alert('نافذة التفويض الاستثنائي السريع')}
        lastScanChildName={
          activeChild
            ? `${activeChild.firstName} ${activeChild.lastName} - ${
                activeChild.classroomId
                  ? classroomsMap.get(activeChild.classroomId) || 'عام'
                  : 'عام'
              }`
            : 'اختر أو امسح طفلاً'
        }
      />

      {/* Dual-Panel Verification Workbench */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Right Main Panel: Active Child & Pickup Authorization (8 Cols) */}
        <div className="xl:col-span-8">
          {activeChild ? (
            <ActiveChildVerificationCard
              childName={`${activeChild.firstName} ${activeChild.lastName}`}
              childAge={getAgeString(activeChild.birthDate)}
              classroom={
                activeChild.classroomId
                  ? classroomsMap.get(activeChild.classroomId) || 'عام'
                  : 'عام'
              }
              childIdNumber={`#${activeChild.id.slice(0, 8).toUpperCase()}`}
              entryTime="08:00 ص"
              photoUrl={activeChild.photoPath}
              allergiesNote={activeChild.allergies}
              teacherNote={activeChild.medicalNotes}
              guardians={activeGuardians}
              onConfirmDelivery={handleConfirmDelivery}
            />
          ) : (
            <div className="bg-surface-container-lowest p-12 rounded-xl shadow-xs text-center border border-outline-variant/40">
              <span className="material-symbols-outlined text-5xl text-outline mb-3">how_to_reg</span>
              <h3 className="font-headline-sm font-bold text-on-surface mb-1">لا يوجد طفل محدد حالياً</h3>
              <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
                امسح بطاقة الطفل برمز الباركود/QR أو اختر طفلاً من قائمة الانتظار للتحقق من هوية المستلم.
              </p>
            </div>
          )}
        </div>

        {/* Left Panel: Live Audit Log & Remaining Queue (4 Cols) */}
        <div className="xl:col-span-4">
          <GateActivityFeed
            logs={completedLogs}
            queueItems={waitingQueue}
            onSelectChild={(childId) => {
              setSelectedChildId(childId)
              const c = childrenMap.get(childId)
              if (c) {
                setBarcode(`${c.firstName} ${c.lastName}`)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
