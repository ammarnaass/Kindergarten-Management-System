import React, { useState } from 'react'
import {
  Printer,
  FileText,
  Receipt,
  ScanBarcode,
  CheckCircle2,
  RefreshCw,
  CreditCard
} from 'lucide-react'
import type { SetupFormData } from '../../types'
import type { SystemPrinter } from '../../../../lib/api/types'

interface Step5HardwareDiscoveryProps {
  formData: SetupFormData
  printers: SystemPrinter[]
  updateFormData: (fields: Partial<SetupFormData>) => void
}

export const Step5HardwareDiscovery: React.FC<Step5HardwareDiscoveryProps> = ({
  formData,
  printers,
  updateFormData
}) => {
  const [scannerInput, setScannerInput] = useState('')
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)

  const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scannerInput.trim()) {
      setLastScannedCode(scannerInput.trim())
      setScannerInput('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Printer className="w-5 h-5 text-primary" />
          <span>اكتشاف وتهيئة العتاد والطابعات</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          تم التعرف على الطابعات المثبتة بنظام التشغيل تلقائياً، يمكنك تخصيص طابعة لكل غرض من أغراض العمل.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Document Printer Card */}
        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-foreground">طابعة المستندات والتقارير</div>
              <div className="text-[10px] text-muted-foreground">قياس A4 / A5 (سندات، استمارات)</div>
            </div>
          </div>

          <select
            value={formData.documentPrinter}
            onChange={(e) => updateFormData({ documentPrinter: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">تصدير PDF فقط (افتراضي)</option>
            {printers.map((p) => (
              <option key={p.name} value={p.name}>
                {p.displayName} {p.isDefault ? '(الافتراضية)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Thermal Receipt Printer Card */}
        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-foreground">طابعة الإيصالات الحرارية</div>
              <div className="text-[10px] text-muted-foreground">عرض 80mm (إيصالات الاستلام)</div>
            </div>
          </div>

          <select
            value={formData.receiptPrinter}
            onChange={(e) => updateFormData({ receiptPrinter: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">غير محددة (تعطيل الإيصال المباشر)</option>
            {printers.map((p) => (
              <option key={p.name} value={p.name}>
                {p.displayName} {p.isDefault ? '(الافتراضية)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* PVC Card Printer */}
        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-foreground">طابعة بطاقات الطلاب PVC</div>
              <div className="text-[10px] text-muted-foreground">بطاقات CR-80 البلاستيكية</div>
            </div>
          </div>

          <select
            value={formData.cardPrinter}
            onChange={(e) => updateFormData({ cardPrinter: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">تصدير PDF أو طابعة مخصصة</option>
            {printers.map((p) => (
              <option key={p.name} value={p.name}>
                {p.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Barcode & RFID Scanner Live Test */}
      <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanBarcode className="w-4 h-4 text-primary" />
            <span className="font-bold text-xs text-foreground">اختبار قارئ الباركود والـ RFID الموصل</span>
          </div>
          <span className="text-[10px] text-muted-foreground">يدعم أجهزة USB HID Keyboard Emulation</span>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={scannerInput}
            onChange={(e) => setScannerInput(e.target.value)}
            onKeyDown={handleScannerKeyDown}
            placeholder="امسح أي كود باركود أو مرر بطاقة RFID هنا للتجربة واضغط Enter..."
            className="flex-1 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {lastScannedCode && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم استلام الرمز بنجاح: <strong className="font-mono text-foreground font-bold">{lastScannedCode}</strong></span>
          </div>
        )}
      </div>
    </div>
  )
}
