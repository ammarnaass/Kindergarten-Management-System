import { useState, useEffect, useCallback } from 'react'
import { api, type SystemPrinter } from '@/lib/api'
import {
  SettingsTab,
  SettingsState,
  BranchSettings,
  PrinterSettings,
  ScannerSettings,
  DatabaseSettings,
  AppearanceSettings
} from '../types'

const currentYear = new Date().getFullYear()

const DEFAULT_SETTINGS: SettingsState = {
  branch: {
    kindergartenNameAr: '',
    kindergartenNameEn: '',
    crLicenseNumber: '',
    branchName: 'الفرع الرئيسي',
    phone: '',
    email: '',
    nationalAddress: '',
    printLogoOnReceipts: true,
    printLogoOnCards: true,
    printLogoOnDailyReport: true,
    logoUrl: ''
  },
  printers: {
    thermalPrinter: '',
    thermalBaudRate: '115200 bps',
    thermalPaperWidth: '80 ملم (ESC/POS)',
    autoPrintAtGate: false,
    autoCutter: true,
    cashDrawerKick: false,
    documentPrinter: '',
    docPaperSize: 'A4 (210 × 297 mm)',
    docDpi: '600 × 600 DPI',
    docPrintPreview: true,
    docTonerSaver: false,
    docEncryptedBarcode: true,
    pvcCardPrinter: '',
    pvcCardDualSided: false,
    pvcSmartChipEncoding: false
  },
  scanner: {
    readerMode: 'USB HID Keyboard Emulation',
    autoResetDelay: 5,
    masterPin: '0000',
    buzzerChime: true,
    showMatchedPhotos: true,
    supervisorFingerprint: false,
    rfidFrequency: '13.56 MHz (Mifare / NFC)',
    audioChimeSound: 'نغمة تأكيد لطيفة'
  },
  database: {
    activeDbPath: 'SQLite Local File',
    dataSize: '0.0 KB',
    recordsCount: '0 سجل',
    encryptionType: 'SQLite WAL Native',
    vacuumOnExit: true,
    walCheckpointing: true,
    externalBackupPath: '',
    backupFrequency: 'نسخة عند نهاية الدوام (16:30)',
    backupRetention: 'آخر 30 نسخة يومية (يوصى به)',
    autoSyncUsb: true
  },
  appearance: {
    uiLanguage: 'ar',
    calendarType: 'gregorian',
    activeAcademicYear: `${currentYear}-${currentYear + 1}`,
    activeTerm: 'الفصل الدراسي الأول',
    preventArchivedEdits: true,
    activeTheme: 'light',
    accentColor: 'blue',
    fontScale: 'standard',
    uiDensity: 'comfortable',
    showFooterKeys: true,
    autoTardinessEnabled: true,
    autoTardinessThreshold: '08:15 ص',
    gateSecurityAlert: true,
    currency: 'دج (دينار جزائري)',
    timeFormat: '12h'
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0.0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('branch')
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [printersList, setPrintersList] = useState<SystemPrinter[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [scannedCodeFeedback, setScannedCodeFeedback] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }, [])

  // 1. Load initial settings, real printers, & SQLite diagnostics from Main Process
  useEffect(() => {
    let isMounted = true

    Promise.all([
      api.settings.getAll().catch(() => ({} as Record<string, string>)),
      api.diagnostics.get().catch(() => null),
      api.backup.list().catch(() => []),
      api.system.getPrinters().catch(() => [] as SystemPrinter[])
    ]).then(([savedSettings, diag, backups, osPrinters]) => {
      if (!isMounted) return

      const saved = (savedSettings || {}) as Record<string, string>
      const realPrinters = osPrinters || []
      setPrintersList(realPrinters)

      setSettings((prev) => {
        const next: SettingsState = JSON.parse(JSON.stringify(prev))

        // Merge all saved key-values into corresponding sections
        for (const [key, val] of Object.entries(saved)) {
          if (val === undefined || val === null) continue
          const dotIndex = key.indexOf('.')
          if (dotIndex === -1) continue
          const section = key.slice(0, dotIndex) as keyof SettingsState
          const prop = key.slice(dotIndex + 1)

          if (next[section] && prop in (next[section] as any)) {
            let parsedVal: any = val
            if (val === 'true') parsedVal = true
            else if (val === 'false') parsedVal = false
            else if (/^\d+$/.test(val) && prop === 'autoResetDelay') parsedVal = Number(val)
            ;(next[section] as any)[prop] = parsedVal
          }
        }

        // Set default printers from real OS printers if not already set
        if (realPrinters.length > 0) {
          const defaultPrinter = realPrinters.find((p) => p.isDefault) || realPrinters[0]
          if (!next.printers.documentPrinter && defaultPrinter) {
            next.printers.documentPrinter = defaultPrinter.name
          }
          if (!next.printers.thermalPrinter && defaultPrinter) {
            next.printers.thermalPrinter = defaultPrinter.name
          }
          if (!next.printers.pvcCardPrinter && defaultPrinter) {
            next.printers.pvcCardPrinter = defaultPrinter.name
          }
        }

        // Merge live diagnostics into database tab
        if (diag) {
          const totalRecords = diag.totalRecords ?? 0
          next.database.activeDbPath = diag.dbPath || next.database.activeDbPath
          next.database.dataSize = formatBytes(diag.dbSize || 0)
          next.database.recordsCount = `${totalRecords} سجل نشط (${(backups || []).length} نسخة احتياطية)`
        }

        return next
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  // 2. Save 100% of settings to SQLite
  const triggerQuickSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const flatMap: Record<string, string> = {}

      for (const [sectionKey, sectionObj] of Object.entries(settings)) {
        for (const [propKey, propVal] of Object.entries(sectionObj as any)) {
          // Skip dynamic hardware metrics
          if (
            sectionKey === 'database' &&
            (propKey === 'dataSize' || propKey === 'recordsCount' || propKey === 'activeDbPath')
          ) {
            continue
          }
          flatMap[`${sectionKey}.${propKey}`] = String(propVal ?? '')
        }
      }

      await api.settings.setMany(flatMap)
      showToast('تمت مزامنة وحفظ كافة الإعدادات في قاعدة بيانات SQLite محلياً (WAL-commit)')
    } catch (err: any) {
      console.error('Error saving settings:', err)
      showToast(`فشل حفظ الإعدادات: ${err.message || 'خطأ غير معروف'}`)
    } finally {
      setIsSaving(false)
    }
  }, [settings, showToast])

  const resetToDefaults = useCallback(() => {
    if (window.confirm('هل ترغب حقاً في استعادة التفضيلات الافتراضية لقيم المصنع المحلية؟')) {
      setSettings(DEFAULT_SETTINGS)
      showToast('تمت استعادة الإعدادات الافتراضية بنجاح')
    }
  }, [showToast])

  const simulateTestPrint = useCallback(
    (printerName: string) => {
      showToast(`جاري تشغيل أمر الطباعة التجريبية لطابعة: ${printerName || 'الطابعة الافتراضية'}`)
      window.print()
    },
    [showToast]
  )

  // 3. Database Vacuum & Optimize
  const optimizeLocalDb = useCallback(async () => {
    try {
      const res = await api.settings.vacuum()
      showToast(
        `تم تنفيذ VACUUM وتحسين الفهارس بنجاح! المساحة الحالية: ${formatBytes(res.currentSize)}`
      )
      const diag = await api.diagnostics.get().catch(() => null)
      if (diag) {
        setSettings((prev) => ({
          ...prev,
          database: {
            ...prev.database,
            dataSize: formatBytes(diag.dbSize || 0)
          }
        }))
      }
    } catch (err: any) {
      showToast(`فشل تحسين قاعدة البيانات: ${err.message || 'خطأ غير متوقع'}`)
    }
  }, [showToast])

  // 4. Create Immediate Backup
  const triggerImmediateBackup = useCallback(async () => {
    try {
      const file = await api.backup.create(settings.database.externalBackupPath || undefined)
      showToast(`تم إنشاء نسخة احتياطية مشفرة بنجاح: ${file}`)
      const diag = await api.diagnostics.get().catch(() => null)
      const backups = await api.backup.list().catch(() => [])
      if (diag) {
        setSettings((prev) => ({
          ...prev,
          database: {
            ...prev.database,
            recordsCount: `${diag.totalRecords ?? 0} سجل نشط (${(backups || []).length} نسخة احتياطية)`
          }
        }))
      }
    } catch (err: any) {
      showToast(`فشل إنشاء النسخة الاحتياطية: ${err.message || 'خطأ غير متوقع'}`)
    }
  }, [settings.database.externalBackupPath, showToast])

  // 5. Open SQLite DB folder on disk
  const openDbFolder = useCallback(async () => {
    if (settings.database.activeDbPath) {
      await api.system.openPath(settings.database.activeDbPath)
    }
  }, [settings.database.activeDbPath])

  // 6. Choose real external USB or local folder
  const chooseExternalBackupPath = useCallback(async () => {
    try {
      const selected = await api.system.selectDirectory()
      if (selected) {
        setSettings((prev) => ({
          ...prev,
          database: {
            ...prev.database,
            externalBackupPath: selected
          }
        }))
        showToast(`تم تعيين مسار النسخ الاحتياطي: ${selected}`)
      }
    } catch (err: any) {
      showToast(`فشل اختيار المجلد: ${err.message || 'خطأ غير معروف'}`)
    }
  }, [showToast])

  const rescanPrinters = useCallback(async () => {
    try {
      const osPrinters = await api.system.getPrinters()
      setPrintersList(osPrinters)
      showToast(`تم تحديث قائمة الطابعات: تم العثور على ${osPrinters.length} طابعة بنظام التشغيل`)
    } catch (err: any) {
      showToast(`تعذر جلب الطابعات: ${err.message || 'خطأ'}`)
    }
  }, [showToast])

  const handleScanCode = useCallback((code: string) => {
    if (!code.trim()) return
    setScannedCodeFeedback(code.trim())
    setTimeout(() => {
      setScannedCodeFeedback(null)
    }, 4000)
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
    printersList,
    isSaving,
    toastMessage,
    scannedCodeFeedback,
    triggerQuickSave,
    resetToDefaults,
    simulateTestPrint,
    optimizeLocalDb,
    triggerImmediateBackup,
    openDbFolder,
    chooseExternalBackupPath,
    rescanPrinters,
    handleScanCode,
    updateBranch,
    updatePrinters,
    updateScanner,
    updateDatabase,
    updateAppearance
  }
}
