import React from 'react'
import { Sun, Moon, Sparkles, AlertCircle } from 'lucide-react'
import { useTheme } from '../../app/providers/ThemeProvider'
import { useSetupWizard } from './hooks/useSetupWizard'
import { SetupHeaderStepper } from './components/SetupHeaderStepper'
import { SetupFooterActions } from './components/SetupFooterActions'
import { Step1WelcomeSystemCheck } from './components/steps/Step1WelcomeSystemCheck'
import { Step2KindergartenIdentity } from './components/steps/Step2KindergartenIdentity'
import { Step3SuperAdminSetup } from './components/steps/Step3SuperAdminSetup'
import { Step4ClassroomsSetup } from './components/steps/Step4ClassroomsSetup'
import { Step5HardwareDiscovery } from './components/steps/Step5HardwareDiscovery'
import { Step6InstallationProgress } from './components/steps/Step6InstallationProgress'

import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

export const SetupWizardPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  React.useEffect(() => {
    api.system.isInstalled().then((res) => {
      if (res?.isInstalled) {
        navigate('/dashboard', { replace: true })
      }
    }).catch(() => {})
  }, [navigate])

  const {
    currentStep,
    formData,
    updateFormData,
    printers,
    diagnostics,
    isInstalling,
    installProgress,
    installStepLabel,
    isComplete,
    error,
    addClassroom,
    removeClassroom,
    updateClassroom,
    regenerateRecoveryKey,
    goToNextStep,
    goToPreviousStep,
    executeInstallation
  } = useSetupWizard()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <header className="w-full bg-card/80 backdrop-blur-md border-b border-border px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-foreground">معالج تثبيت وتهيئة النظام — روضتي</h1>
            <p className="text-[11px] text-muted-foreground">الإعداد المحلي الشامل • الإصدار 0.1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'التحويل للوضع المشرق' : 'التحويل للوضع المظلم'}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </header>

      {/* Stepper Indicator */}
      <SetupHeaderStepper currentStep={currentStep} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        <div className="bg-card/70 backdrop-blur-sm border border-border/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 relative overflow-hidden">
          {error && currentStep < 6 && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {currentStep === 1 && (
            <Step1WelcomeSystemCheck
              formData={formData}
              diagnostics={diagnostics}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 2 && (
            <Step2KindergartenIdentity
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 3 && (
            <Step3SuperAdminSetup
              formData={formData}
              updateFormData={updateFormData}
              regenerateRecoveryKey={regenerateRecoveryKey}
            />
          )}

          {currentStep === 4 && (
            <Step4ClassroomsSetup
              formData={formData}
              addClassroom={addClassroom}
              removeClassroom={removeClassroom}
              updateClassroom={updateClassroom}
            />
          )}

          {currentStep === 5 && (
            <Step5HardwareDiscovery
              formData={formData}
              printers={printers}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 6 && (
            <Step6InstallationProgress
              formData={formData}
              isInstalling={isInstalling}
              installProgress={installProgress}
              installStepLabel={installStepLabel}
              isComplete={isComplete}
              error={error}
            />
          )}
        </div>
      </main>

      {/* Bottom Actions Bar */}
      <SetupFooterActions
        currentStep={currentStep}
        isInstalling={isInstalling}
        isComplete={isComplete}
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
        onExecute={executeInstallation}
      />
    </div>
  )
}
