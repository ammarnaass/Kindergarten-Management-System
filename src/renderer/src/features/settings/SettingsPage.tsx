import { useSettings } from './hooks/useSettings'
import { SettingsHeaderBanner } from './components/SettingsHeaderBanner'
import { SettingsNavigationTabs } from './components/SettingsNavigationTabs'
import { BranchIdentityTab } from './components/BranchIdentityTab'
import { HardwarePrintersTab } from './components/HardwarePrintersTab'
import { BarcodeScannerTab } from './components/BarcodeScannerTab'
import { DatabaseMaintenanceTab } from './components/DatabaseMaintenanceTab'
import { AppearanceAcademicTab } from './components/AppearanceAcademicTab'
import { SettingsBottomBar } from './components/SettingsBottomBar'

export function SettingsPage() {
  const {
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
  } = useSettings()

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Banner and Floating SQLite Sync Toast */}
      <SettingsHeaderBanner
        isSaving={isSaving}
        toastMessage={toastMessage}
        onSave={triggerQuickSave}
        onReset={resetToDefaults}
      />

      {/* Horizontal Scrollable Navigation Tabs Bar */}
      <SettingsNavigationTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Dynamic Tab Panes */}
      <div className="flex flex-col gap-space-lg w-full">
        {activeTab === 'branch' && (
          <BranchIdentityTab
            settings={settings.branch}
            onChange={updateBranch}
            onSave={triggerQuickSave}
          />
        )}

        {activeTab === 'printers' && (
          <HardwarePrintersTab
            settings={settings.printers}
            printersList={printersList}
            onChange={updatePrinters}
            onTestPrint={simulateTestPrint}
            onRefreshPrinters={rescanPrinters}
          />
        )}

        {activeTab === 'scanner' && (
          <BarcodeScannerTab
            settings={settings.scanner}
            scannedCodeFeedback={scannedCodeFeedback}
            onChange={updateScanner}
            onScanCode={handleScanCode}
            onRescanPorts={rescanPrinters}
          />
        )}

        {activeTab === 'backup' && (
          <DatabaseMaintenanceTab
            settings={settings.database}
            onChange={updateDatabase}
            onOptimize={optimizeLocalDb}
            onBackupNow={triggerImmediateBackup}
            onOpenDbFolder={openDbFolder}
            onChooseBackupPath={chooseExternalBackupPath}
          />
        )}

        {activeTab === 'appearance' && (
          <AppearanceAcademicTab
            settings={settings.appearance}
            onChange={updateAppearance}
            onRollForward={() => {
              triggerQuickSave()
            }}
          />
        )}
      </div>

      {/* Fast Sticky Save Strip at bottom */}
      <SettingsBottomBar onSave={triggerQuickSave} />
    </div>
  )
}
export default SettingsPage
