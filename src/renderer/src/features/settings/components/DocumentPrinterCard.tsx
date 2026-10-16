import { PrinterSettings } from '../types'

interface DocumentPrinterCardProps {
  settings: PrinterSettings
  onChange: (fields: Partial<PrinterSettings>) => void
  onTestPrint: (printerName: string) => void
}

export function DocumentPrinterCard({
  settings,
  onChange,
  onTestPrint
}: DocumentPrinterCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-variant/40">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                طابعة التقارير والكشوفات الرسمية (A4 / A5)
              </h3>
              <span className="font-caption text-caption text-outline">
                تُستخدم لعقود التسجيل، الشهادات، وميزانيات الحسابات الإدارية
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            متصلة (LAN/USB)
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          <label className="font-label-md text-label-md font-semibold text-on-surface">
            اختر طابعة المستندات الرئيسية للنظام
          </label>
          <select
            value={settings.documentPrinter}
            onChange={(e) => onChange({ documentPrinter: e.target.value })}
            className="w-full px-3 py-2.5 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-transparent focus:border-primary/20"
          >
            <option>HP LaserJet Pro M404n (Network: 192.168.1.114)</option>
            <option>Canon imageCLASS LBP6030w (USB)</option>
            <option>Microsoft Print to PDF (تصدير كملف أرشفة محلي)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-surface-variant/30">
          <div>
            <span className="font-caption text-caption text-on-surface-variant">
              حجم الورق التلقائي
            </span>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              {settings.docPaperSize}
            </div>
          </div>
          <div>
            <span className="font-caption text-caption text-on-surface-variant">
              دقة الطباعة الرسومية
            </span>
            <div className="font-label-md text-label-md font-bold text-on-surface">
              {settings.docDpi}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.docPrintPreview}
              onChange={(e) => onChange({ docPrintPreview: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              عرض شاشة معاينة الطباعة قبل الإرسال الفعلي للطابعة
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.docTonerSaver}
              onChange={(e) => onChange({ docTonerSaver: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              تفعيل وضع التوفير الاقتصادي للحبر (Monochrome Toner Saver)
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.docEncryptedBarcode}
              onChange={(e) => onChange({ docEncryptedBarcode: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-container bg-surface-container"
            />
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              إضافة باركود التحقق المشفر تلقائياً في أسفل كافة الشهادات والوثائق
            </span>
          </label>
        </div>
      </div>

      <div className="mt-space-lg pt-space-md border-t border-surface-variant flex items-center justify-between">
        <button
          type="button"
          onClick={() => onTestPrint('A4 LaserJet')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          <span>طباعة كشف تجريبي (A4 Test Page)</span>
        </button>
        <span className="font-caption text-caption text-outline">حالة الحبر: 82%</span>
      </div>
    </div>
  )
}
