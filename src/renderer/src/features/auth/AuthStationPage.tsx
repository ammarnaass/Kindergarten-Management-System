import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStationData } from './hooks/useAuthStationData'
import { AuthStationTopBar } from './components/AuthStationTopBar'
import { AuthBrandingCard } from './components/AuthBrandingCard'
import { AuthUserSwitcherPanel } from './components/AuthUserSwitcherPanel'
import { AuthLoginForm } from './components/AuthLoginForm'
import { AuthSuperAdminRegisterForm } from './components/AuthSuperAdminRegisterForm'
import { AuthFeedbackBanner } from './components/AuthFeedbackBanner'
import { AuthStationFooter } from './components/AuthStationFooter'
import { OfflineHelpModal } from './components/OfflineHelpModal'
import { EmergencyMaintenanceModal } from './components/EmergencyMaintenanceModal'

export const AuthStationPage: React.FC = () => {
  const navigate = useNavigate()
  const auth = useAuthStationData()

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between select-none">
      {/* ── Top Window Under-Chrome Subheader ───────────── */}
      <AuthStationTopBar onOpenHelp={() => auth.setHelpOpen(true)} />

      {/* ── Main Canvas Workspace ───────────────────────── */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Right Column: Institutional Identity & User Switcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <AuthBrandingCard
              kindergartenName={auth.kindergartenName}
              branchName={auth.branchName}
              academicYear={auth.academicYear}
            />

            <AuthUserSwitcherPanel
              usersList={auth.usersList}
              selectedUser={auth.selectedUser}
              stationTab={auth.stationTab}
              isFirstRun={auth.isFirstRun}
              onSelectUser={(user) => {
                auth.setSelectedUser(user)
                auth.setPin('')
                auth.setPassword('')
                auth.setFeedback(null)
                auth.setAuthMode(user.hasPin ? 'pin' : 'password')
                auth.setStationTab('login')
              }}
              onSwitchToRegister={() => {
                auth.setStationTab('register')
                auth.setFeedback(null)
              }}
              onPromptCustomUser={auth.handlePromptCustomUser}
            />
          </div>

          {/* Left Column: Multi-Mode Auth & Registration Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
              <div>
                {/* First-Run Super Admin Notice */}
                {auth.isFirstRun && (
                  <div className="flex items-center gap-3 p-3.5 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-label-lg text-primary">
                        تهيئة حساب مدير النظام (للمرة الأولى فقط)
                      </h3>
                      <p className="text-body-xs text-on-surface-variant">
                        يتم إنشاء هذا الحساب لمرة واحدة فقط كمسؤول أعلى للنظام، ثم تُقفل شاشة التسجيل تلقائياً.
                      </p>
                    </div>
                  </div>
                )}

                {/* Mode 1: LOGIN TAB */}
                {auth.stationTab === 'login' && (
                  <AuthLoginForm
                    selectedUser={auth.selectedUser}
                    authMode={auth.authMode}
                    onAuthModeChange={(mode) => {
                      auth.setAuthMode(mode)
                      auth.setFeedback(null)
                    }}
                    pin={auth.pin}
                    onPinChange={auth.setPin}
                    password={auth.password}
                    onPasswordChange={auth.setPassword}
                    showPassword={auth.showPassword}
                    onToggleShowPassword={() => auth.setShowPassword(!auth.showPassword)}
                    rememberSession={auth.rememberSession}
                    onToggleRememberSession={auth.setRememberSession}
                    loading={auth.loading}
                    rfidScanning={auth.rfidScanning}
                    onLogin={auth.handleLogin}
                    onRfidScan={auth.handleRfidScan}
                    onResetFields={() => {
                      auth.setPin('')
                      auth.setPassword('')
                      auth.setFeedback(null)
                    }}
                    onOpenHelp={() => auth.setHelpOpen(true)}
                    isFirstRun={auth.isFirstRun}
                    onSwitchToRegister={() => {
                      auth.setStationTab('register')
                      auth.setFeedback(null)
                    }}
                  />
                )}

                {/* Mode 2: REGISTER TAB (First-run super admin) */}
                {auth.isFirstRun && auth.stationTab === 'register' && (
                  <AuthSuperAdminRegisterForm
                    regDisplayName={auth.regDisplayName}
                    onRegDisplayNameChange={auth.setRegDisplayName}
                    regUsername={auth.regUsername}
                    onRegUsernameChange={auth.setRegUsername}
                    regPassword={auth.regPassword}
                    onRegPasswordChange={auth.setRegPassword}
                    regShowPassword={auth.regShowPassword}
                    onToggleRegShowPassword={() => auth.setRegShowPassword(!auth.regShowPassword)}
                    regPin={auth.regPin}
                    onRegPinChange={auth.setRegPin}
                    regAvatar={auth.regAvatar}
                    onRegAvatarChange={auth.setRegAvatar}
                    regLoading={auth.regLoading}
                    onSubmit={auth.handleRegisterUser}
                    onNavigateToWizard={() => navigate('/register')}
                  />
                )}

                {/* Feedback Banner */}
                <AuthFeedbackBanner feedback={auth.feedback} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Technical Status Bar Footer ─────────────────── */}
      <AuthStationFooter
        dbPath={auth.dbPath}
        onOpenEmergency={() => auth.setEmergencyOpen(true)}
      />

      {/* ── Modals ───────────────────────────────────────── */}
      <OfflineHelpModal isOpen={auth.helpOpen} onClose={() => auth.setHelpOpen(false)} />
      <EmergencyMaintenanceModal isOpen={auth.emergencyOpen} onClose={() => auth.setEmergencyOpen(false)} />
    </div>
  )
}

export default AuthStationPage
