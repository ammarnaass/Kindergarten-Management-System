import { useState, useEffect, useCallback } from 'react'
import {
  SettingsTab,
  SettingsState,
  BranchSettings,
  PrinterSettings,
  ScannerSettings,
  DatabaseSettings,
  AppearanceSettings
} from '../types'

const DEFAULT_SETTINGS: SettingsState = {
  branch: {
    kindergartenNameAr: 'روضتي الأهلية النموذجية',
    kindergartenNameEn: 'Rowdati Model Kindergarten',
    crLicenseNumber: '1010894231',
    branchName: 'فرع حي الياسمين - الرياض',
    phone: '0114567890',
    email: 'alyasmin-branch@rowdati.local',
    nationalAddress: 'الرياض 13325 - طريق أنس بن مالك - مبنى تعليمي 7421',
    printLogoOnReceipts: true,
    printLogoOnCards: true,
    printLogoOnDailyReport: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIezPc7NnrZ0mYZ8kUILjAVKvD9qJcnT_2xYXGPR7X7Ytl5r8EGn-1G5-cX7W6EYqzj9O6JRE3a4EmGD6OXmbLtafNIJvhZShxrUaE_b80yW2sw8X8TGQaxC8mfyd2WI614mLa_Oyc_agZ8RxTN9n9-yvNxlKotFLUCY1DDiFLW_pH5aAxRX94_ZQqOabBA88gvssZ7gUjYx6PNg2twYBV_Wf3hBM8kkiPHxhE26ffUBgT6fGe2lY'
  },
  printers: {
    thermalPrinter: 'Epson TM-T20III Thermal Receipt Printer (Port: COM3)',
    thermalBaudRate: '115200 bps',
    thermalPaperWidth: '80 ملم (ESC/POS)',
    autoPrintAtGate: true,
    autoCutter: true,
    cashDrawerKick: false,
    documentPrinter: 'HP LaserJet Pro M404n (Network: 192.168.1.114)',
    docPaperSize: 'A4 (210 × 297 mm)',
    docDpi: '600 × 600 DPI',
    docPrintPreview: true,
    docTonerSaver: false,
    docEncryptedBarcode: true,
    pvcCardPrinter: 'Zebra ZC300 Dual-Sided ID Card Printer (USB)',
    pvcCardDualSided: true,
    pvcSmartChipEncoding: true
  },
  scanner: {
    readerMode: 'USB HID Keyboard Emulation',
    autoResetDelay: 5,
    masterPin: '8842',
    buzzerChime: true,
    showMatchedPhotos: true,
    supervisorFingerprint: false,
    rfidFrequency: '13.56 MHz (Mifare / NFC)',
    audioChimeSound: 'نغمة تأكيد لطيفة (Chime 1)'
  },
  database: {
    activeDbPath: 'C:\\Rowdati\\Data\\rowdati_master.db',
    dataSize: '24.3 MB',
    recordsCount: '18,492',
    encryptionType: 'AES-256',
    vacuumOnExit: true,
    walCheckpointing: true,
    externalBackupPath: 'D:\\Rowdati_Backups\\',
    backupFrequency: 'نسخة عند نهاية الدوام (16:30)',
    backupRetention: 'آخر 30 نسخة يومية (يوصى به)',
    autoSyncUsb: true
  },
  appearance: {
    uiLanguage: 'ar',
    calendarType: 'hijri',
    activeAcademicYear: '1446-1445هـ (2024-2025م)',
    activeTerm: 'الفصل الدراسي الثاني (Term 2)',
    preventArchivedEdits: true,
    activeTheme: 'light',
    accentColor: 'blue',
    fontScale: 'standard',
    uiDensity: 'comfortable',
    showFooterKeys: true,
    autoTardinessEnabled: true,
    autoTardinessThreshold: '08:15 ص',
    gateSecurityAlert: true,
    currency: 'ريال سعودي (ر.س)',
    timeFormat: '12h'
  }
}

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('branch')
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [scannedCodeFeedback, setScannedCodeFeedback] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3200)
  }, [])

  const triggerQuickSave = useCallback(() => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      showToast('تمت مزامنة وحفظ التعديلات في SQLite محلياً (WAL-commit)')
    }, 200)
  }, [showToast])

  const resetToDefaults = useCallback(() => {
    if (window.confirm('هل ترغب حقاً في استعادة التفضيلات الافتراضية لقيم المصنع المحلية؟')) {
      setSettings(DEFAULT_SETTINGS)
      showToast('تمت استعادة الإعدادات الافتراضية بنجاح')
    }
  }, [showToast])

  const simulateTestPrint = useCallback(
    (printerName: string) => {
      showToast(`جاري إرسال صفحة الاختبار لطابعة ${printerName} عبر المنفذ المحلي...`)
    },
    [showToast]
  )

  const optimizeLocalDb = useCallback(() => {
    showToast('تم تنفيذ VACUUM وتحسين مؤشرات SQLite بنجاح! تم استعادة 1.4 MB.')
  }, [showToast])

  const triggerImmediateBackup = useCallback(() => {
    showToast('تم إنشاء نسخة احتياطية مشفرة بنجاح في D:\\Rowdati_Backups\\rowdati_backup.db')
  }, [showToast])

  const rescanPorts = useCallback(() => {
    showToast('تمت إعادة فحص المنافذ: 3 أجهزة متصلة ونشطة (COM3, USB001, Zebra USB)')
  }, [showToast])

  const handleScanCode = useCallback((code: string) => {
    if (!code.trim()) return
    setScannedCodeFeedback(code.trim())
    setTimeout(() => {
      setScannedCodeFeedback(null)
    }, 3500)
  }, [])

  const updateBranch = useCallback((fields: Partial<BranchSettings>) => {
    setSettings((prev) => ({ ...prev, branch: { ...prev.branch, ...fields } }))
  }, [])

  const updatePrinters = useCallback((fields: Partial<PrinterSettings>) => {
    setSettings((prev) => ({ ...prev, printers: { ...prev.printers, ...fields } }))
  }, [])

  const updateScanner = useCallback((fields: Partial<ScannerSettings>) => {
    setSettings((prev) => ({ ...prev, scanner: { ...prev.scanner, ...fields } }))
  }, [])

  const updateDatabase = useCallback((fields: Partial<DatabaseSettings>) => {
    setSettings((prev) => ({ ...prev, database: { ...prev.database, ...fields } }))
  }, [])

  const updateAppearance = useCallback((fields: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, ...fields } }))
  }, [])

  // Global Ctrl+S listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        triggerQuickSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerQuickSave])

  return {
    activeTab,
    setActiveTab,
    settings,
    isSaving,
    toastMessage,
    scannedCodeFeedback,
    triggerQuickSave,
    resetToDefaults,
    simulateTestPrint,
    optimizeLocalDb,
    triggerImmediateBackup,
    rescanPorts,
    handleScanCode,
    updateBranch,
    updatePrinters,
    updateScanner,
    updateDatabase,
    updateAppearance
  }
}
