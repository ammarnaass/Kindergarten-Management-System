import { forwardRef } from 'react'

interface GateScannerInputProps {
  barcode: string
  onBarcodeChange: (value: string) => void
  onTestScan: () => void
  onCameraTrigger: () => void
  onEmergencyAuthorize: () => void
  lastScanChildName?: string
}

export const GateScannerInput = forwardRef<HTMLInputElement, GateScannerInputProps>(
  (
    {
      barcode,
      onBarcodeChange,
      onTestScan,
      onCameraTrigger,
      onEmergencyAuthorize,
      lastScanChildName = 'ريان بن ماجد الصالح - فصل العصافير'
    },
    ref
  ) => {
    return (
      <section className="mb-space-lg select-none">
        <div className="relative bg-gradient-to-r from-primary/10 via-surface-container-low to-primary-container/10 p-space-md rounded-xl shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-space-md">
            {/* Prominent Scanner Input with Pulsing Accent Glow */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-primary">
                <span className="material-symbols-outlined text-2xl animate-pulse">
                  qr_code_scanner
                </span>
              </div>
              <input
                ref={ref}
                autoComplete="off"
                autoFocus
                type="text"
                value={barcode}
                onChange={(e) => onBarcodeChange(e.target.value)}
                placeholder="امسح بطاقة الطفل برمز QR أو الباركود هنا، أو اكتب اسم الطفل / رقم القيد..."
                className="w-full h-14 pr-12 pl-28 rounded-xl bg-surface-container-lowest text-on-surface font-headline-sm text-headline-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 placeholder:text-outline transition-all"
              />
              <div className="absolute inset-y-0 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-1 rounded bg-primary text-on-primary font-caption text-caption uppercase font-bold tracking-wider">
                  مسح فوري [F2]
                </span>
              </div>
            </div>

            {/* Quick Scan Utility Buttons */}
            <div className="flex items-center gap-space-xs w-full lg:w-auto">
              <button
                onClick={onTestScan}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-space-md h-14 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-label-lg text-label-lg shadow-xs transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>مسح تجريبي</span>
              </button>
              <button
                onClick={onCameraTrigger}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-space-md h-14 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg shadow-xs transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-lg text-primary">face</span>
                <span>كاميرا البوابة</span>
              </button>
              <button
                onClick={onEmergencyAuthorize}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-space-md h-14 rounded-xl bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-xs transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">key</span>
                <span>تفويض استثنائي (F4)</span>
              </button>
            </div>
          </div>

          {/* Simulated Scan Success Feedback Banner */}
          <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 px-space-sm py-1.5 rounded-lg bg-surface-container-lowest/80 text-on-surface font-body-sm text-body-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">task_alt</span>
              <span className="font-semibold text-emerald-700">تم المسح الناجح:</span>
              <span className="font-mono text-caption text-caption bg-surface-container px-2 py-0.5 rounded text-on-surface">
                {barcode || 'KDG-SEC-4412A'}
              </span>
              <span className="text-on-surface font-medium">({lastScanChildName})</span>
              <span className="text-on-surface-variant font-caption text-caption">
                • بواسطة قارئ USB مكتبي
              </span>
            </div>
            <button
              onClick={onTestScan}
              className="flex items-center gap-1 text-primary font-label-sm text-label-sm cursor-pointer hover:underline"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">history</span>
              <span>إعادة المسح</span>
            </button>
          </div>
        </div>
      </section>
    )
  }
)

GateScannerInput.displayName = 'GateScannerInput'
