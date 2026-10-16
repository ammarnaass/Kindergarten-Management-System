import { useState, useRef, useEffect } from 'react'
import {
  GateHeaderStatus,
  GateScannerInput,
  ActiveChildVerificationCard,
  GateActivityFeed,
  SafePickupGuardian,
  GateLogItem
} from './index'

export default function SafePickupPage() {
  const [barcode, setBarcode] = useState('KDG-SEC-4412A')
  const [completedCount, setCompletedCount] = useState(35)
  const [remainingCount, setRemainingCount] = useState(13)
  const [deliverySuccessMessage, setDeliverySuccessMessage] = useState<string | null>(null)
  const scannerInputRef = useRef<HTMLInputElement>(null)

  const [logs, setLogs] = useState<GateLogItem[]>([
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
  ])

  // Handle hotkeys F2 for scanner, Enter or F10 for delivery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        scannerInputRef.current?.focus()
        scannerInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleConfirmDelivery = (guardian: SafePickupGuardian) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

    const newLog: GateLogItem = {
      id: String(Date.now()),
      childName: 'ريان بن ماجد الصالح',
      classroom: 'فصل العصافير',
      time: timeStr,
      receiver: `${guardian.name} (${guardian.relationship})`,
      status: 'مكتمل بنجاح',
      gate: 'بوابة 01',
      staff: 'أ. نادية المنصوري'
    }

    setLogs((prev) => [newLog, ...prev])
    setCompletedCount((prev) => prev + 1)
    setRemainingCount((prev) => Math.max(0, prev - 1))

    setDeliverySuccessMessage(
      `تم توثيق استلام الطفل ريان بن ماجد الصالح بنجاح إلى: ${guardian.name}`
    )
    setTimeout(() => setDeliverySuccessMessage(null), 4000)
  }

  return (
    <div className="flex flex-col w-full select-none">
      {/* Success Toast */}
      {deliverySuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-surface-container-lowest px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-2xl">verified</span>
          <span className="font-label-lg text-label-lg font-bold">{deliverySuccessMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Live Gate Status */}
      <GateHeaderStatus
        completedPickups={completedCount}
        remainingPickups={remainingCount}
      />

      {/* Central Scan & Search Zone */}
      <GateScannerInput
        ref={scannerInputRef}
        barcode={barcode}
        onBarcodeChange={setBarcode}
        onTestScan={() => {
          setBarcode('KDG-SEC-9981B')
          alert('تمت قراءة رمز الباركود: KDG-SEC-9981B')
        }}
        onCameraTrigger={() => alert('كاميرا البوابة متصلة وتلتقط المشهد بدقة عالية')}
        onEmergencyAuthorize={() => alert('نافذة التفويض الاستثنائي السريع')}
        lastScanChildName="ريان بن ماجد الصالح - فصل العصافير"
      />

      {/* Dual-Panel Verification Workbench */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Right Main Panel: Active Child & Pickup Authorization (8 Cols) */}
        <div className="xl:col-span-8">
          <ActiveChildVerificationCard
            childName="ريان بن ماجد الصالح"
            childAge="4 سنوات ونصف"
            classroom="فصل العصافير"
            childIdNumber="#KDG-2026-058"
            entryTime="07:50 ص"
            lockerNumber="C-09"
            onConfirmDelivery={handleConfirmDelivery}
          />
        </div>

        {/* Left Panel: Live Audit Log & Remaining Queue (4 Cols) */}
        <div className="xl:col-span-4">
          <GateActivityFeed
            logs={logs}
            onSelectChild={(name) => {
              setBarcode(name)
              alert(`تم تحميل بيانات الطفل: ${name}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}
