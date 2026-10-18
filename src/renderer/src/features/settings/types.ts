import type { SystemPrinter } from '@/lib/api'

export type { SystemPrinter }
export type SettingsTab = 'branch' | 'users' | 'printers' | 'scanner' | 'backup' | 'appearance'

export interface BranchSettings {
  kindergartenNameAr: string
  kindergartenNameEn: string
  crLicenseNumber: string
  branchName: string
  phone: string
  email: string
  nationalAddress: string
  printLogoOnReceipts: boolean
  printLogoOnCards: boolean
  printLogoOnDailyReport: boolean
  logoUrl: string
}

export interface PrinterSettings {
  thermalPrinter: string
  thermalBaudRate: string
  thermalPaperWidth: string
  autoPrintAtGate: boolean
  autoCutter: boolean
  cashDrawerKick: boolean
  documentPrinter: string
  docPaperSize: string
  docDpi: string
  docPrintPreview: boolean
  docTonerSaver: boolean
  docEncryptedBarcode: boolean
  pvcCardPrinter: string
  pvcCardDualSided: boolean
  pvcSmartChipEncoding: boolean
}

export interface ScannerSettings {
  readerMode: string
  autoResetDelay: number
  masterPin: string
  buzzerChime: boolean
  showMatchedPhotos: boolean
  supervisorFingerprint: boolean
  rfidFrequency: string
  audioChimeSound: string
}

export interface DatabaseSettings {
  activeDbPath: string
  dataSize: string
  recordsCount: string
  encryptionType: string
  vacuumOnExit: boolean
  walCheckpointing: boolean
  externalBackupPath: string
  backupFrequency: string
  backupRetention: string
  autoSyncUsb: boolean
}

export interface AppearanceSettings {
  uiLanguage: 'ar' | 'en' | 'fr'
  calendarType: 'hijri' | 'gregorian'
  activeAcademicYear: string
  activeTerm: string
  preventArchivedEdits: boolean
  activeTheme: 'light' | 'dark' | 'system'
  accentColor: 'blue' | 'green' | 'purple' | 'navy'
  fontScale: 'small' | 'standard' | 'large'
  uiDensity: 'comfortable' | 'compact'
  showFooterKeys: boolean
  autoTardinessEnabled: boolean
  autoTardinessThreshold: string
  gateSecurityAlert: boolean
  currency: string
  timeFormat: '12h' | '24h'
}

export interface SettingsState {
  branch: BranchSettings
  printers: PrinterSettings
  scanner: ScannerSettings
  database: DatabaseSettings
  appearance: AppearanceSettings
}
