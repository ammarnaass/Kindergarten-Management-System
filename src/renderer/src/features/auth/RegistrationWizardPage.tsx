import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegistrationWizard } from './hooks/useRegistrationWizard'
import { WizardHeaderBar } from './components/WizardHeaderBar'
import { WizardPersonalInfoSection } from './components/WizardPersonalInfoSection'
import { WizardCredentialsSection } from './components/WizardCredentialsSection'
import { WizardRecoverySection } from './components/WizardRecoverySection'
import { WizardPledgeSection } from './components/WizardPledgeSection'
import { WizardStickyFooter } from './components/WizardStickyFooter'
import { RecoveryKeyCertificate } from './components/RecoveryKeyCertificate'
import { EmergencyMaintenanceModal } from './components/EmergencyMaintenanceModal'

export const RegistrationWizardPage: React.FC = () => {
  const navigate = useNavigate()
  const wizard = useRegistrationWizard()

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8 flex flex-col items-center select-none">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <WizardHeaderBar />

        {/* ── Form Grid Workspace ────────────────────────── */}
        <form onSubmit={wizard.handleSubmit} className="w-full flex flex-col gap-6">
          {/* Row 1: Section A (Personal) & Section B (Credentials) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WizardPersonalInfoSection
              fullName={wizard.fullName}
              onFullNameChange={wizard.setFullName}
              roleTitle={wizard.roleTitle}
              onRoleTitleChange={wizard.setRoleTitle}
              nationalId={wizard.nationalId}
              onNationalIdChange={wizard.setNationalId}
              isLuhnValid={wizard.isLuhnValid}
              phone={wizard.phone}
              onPhoneChange={wizard.setPhone}
              adminEmail={wizard.adminEmail}
              onAdminEmailChange={wizard.setAdminEmail}
            />

            <WizardCredentialsSection
              username={wizard.username}
              onUsernameChange={wizard.setUsername}
              password={wizard.password}
              onPasswordChange={wizard.setPassword}
              confirmPassword={wizard.confirmPassword}
              onConfirmPasswordChange={wizard.setConfirmPassword}
              showPassword={wizard.showPassword}
              onToggleShowPassword={() => wizard.setShowPassword(!wizard.showPassword)}
              passwordsMatch={wizard.passwordsMatch}
              pinCode={wizard.pinCode}
              onPinCodeChange={wizard.setPinCode}
            />
          </div>

          <WizardRecoverySection
            recoveryKey={wizard.recoveryKey}
            onCopyMasterKey={wizard.copyMasterKey}
            onShowCertificate={() => wizard.setShowCertificate(true)}
            q1={wizard.q1}
            onQ1Change={wizard.setQ1}
            a1={wizard.a1}
            onA1Change={wizard.setA1}
            q2={wizard.q2}
            onQ2Change={wizard.setQ2}
            a2={wizard.a2}
            onA2Change={wizard.setA2}
          />

          <WizardPledgeSection
            agreed={wizard.agreed}
            onAgreedChange={wizard.setAgreed}
          />

          <WizardStickyFooter
            loading={wizard.loading}
            isFormValid={wizard.isFormValid}
            onOpenEmergency={() => wizard.setEmergencyOpen(true)}
            onCancel={() => navigate('/login')}
          />
        </form>
      </div>

      {/* Printable Certificate Modal */}
      {wizard.showCertificate && (
        <RecoveryKeyCertificate
          recoveryKey={wizard.recoveryKey}
          adminName={wizard.fullName}
          username={wizard.username}
          nationalId={wizard.nationalId}
          createdAt={new Date().toLocaleString('ar-SA')}
          onClose={() => {
            wizard.setShowCertificate(false)
            navigate('/dashboard')
          }}
        />
      )}

      {/* Emergency Modal */}
      <EmergencyMaintenanceModal
        isOpen={wizard.emergencyOpen}
        onClose={() => wizard.setEmergencyOpen(false)}
      />
    </div>
  )
}

export default RegistrationWizardPage
