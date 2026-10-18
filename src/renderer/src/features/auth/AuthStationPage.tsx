import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { LocalUserSummary } from '@/lib/api/types'
import { QuickUserCard } from './components/QuickUserCard'
import { PinKeypad } from './components/PinKeypad'
import { OfflineHelpModal } from './components/OfflineHelpModal'
import { EmergencyMaintenanceModal } from './components/EmergencyMaintenanceModal'
import { useTheme } from '@/app/providers/ThemeProvider'

export const AuthStationPage: React.FC = () => {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  // Primary Station Mode: 'login' | 'register'
  const [stationTab, setStationTab] = useState<'login' | 'register'>('login')
  const [isFirstRun, setIsFirstRun] = useState(false)

  // Login States
  const [usersList, setUsersList] = useState<LocalUserSummary[]>([])
  const [selectedUser, setSelectedUser] = useState<LocalUserSummary | null>(null)
  const [authMode, setAuthMode] = useState<'pin' | 'password'>('pin')
  const [pin, setPin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberSession, setRememberSession] = useState(true)

  const [loading, setLoading] = useState(false)
  const [rfidScanning, setRfidScanning] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null)

  // Registration Form States
  const [regDisplayName, setRegDisplayName] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regShowPassword, setRegShowPassword] = useState(false)
  const [regPin, setRegPin] = useState('')
  const [regRole, setRegRole] = useState<'admin' | 'educator' | 'staff' | 'accountant'>('educator')
  const [regAvatar, setRegAvatar] = useState('school')
  const [regLoading, setRegLoading] = useState(false)

  const [helpOpen, setHelpOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [dbPath, setDbPath] = useState<string>('')

  // Fetch local users and settings
  const loadInitialData = async () => {
    try {
      const [users, sett, setupStatus] = await Promise.all([
        api.auth.listUsers(),
        api.settings.getAll().catch(() => ({})),
        api.auth.checkSetup().catch(() => ({ isSetupComplete: true, hasAdmin: true, allowRegistration: false, userCount: 1 }))
      ])
      setUsersList(users)
      setSettings(sett || {})
      api.system.integrityCheck().then((res) => {
        if (res?.dbPath) setDbPath(res.dbPath)
      }).catch(() => {})

      const needsAdminSetup = !setupStatus.hasAdmin || users.length === 0
      setIsFirstRun(needsAdminSetup)

      if (needsAdminSetup) {
        setStationTab('register')
        setRegRole('admin')
        setRegAvatar('shield_person')
      } else {
        setStationTab('login')
        const adminUser = users.find((u) => u.role === 'admin') || users[0]
        if (adminUser) {
          setSelectedUser(adminUser)
          setAuthMode(adminUser.hasPin ? 'pin' : 'password')
        }
      }
    } catch {
      setUsersList([])
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  // Cycle user selection on Escape
  const cycleNextUser = useCallback(() => {
    if (stationTab !== 'login' || usersList.length <= 1) return
    const currentIndex = selectedUser ? usersList.findIndex((u) => u.username === selectedUser.username) : -1
    const nextIndex = (currentIndex + 1) % usersList.length
    const nextUser = usersList[nextIndex]
    setSelectedUser(nextUser)
    setPin('')
    setPassword('')
    setFeedback(null)
    setAuthMode(nextUser.hasPin ? 'pin' : 'password')
  }, [stationTab, usersList, selectedUser])

  // Authentication Handlers
  const handleLogin = async () => {
    if (!selectedUser) {
      setFeedback({ type: 'error', message: 'يرجى اختيار حساب من القائمة للمتابعة.' })
      return
    }

    if (authMode === 'pin' && pin.trim().length === 0) {
      setFeedback({ type: 'error', message: 'يرجى إدخال رمز PIN المكون من 4 إلى 6 أرقام.' })
      return
    }

    if (authMode === 'password' && password.trim().length === 0) {
      setFeedback({ type: 'error', message: 'يرجى إدخال كلمة المرور للمتابعة.' })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      if (authMode === 'pin') {
        await api.auth.loginPin({
          username: selectedUser.username,
          pin: pin.trim()
        })
      } else {
        await api.auth.login({
          username: selectedUser.username,
          password: password.trim()
        })
      }

      setFeedback({
        type: 'success',
        message: `تم التحقق بنجاح! جاري تحميل جلسة ${selectedUser.displayName}...`
      })

      setTimeout(() => {
        navigate('/dashboard')
      }, 600)
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'بيانات المرور غير صحيحة، يرجى إعادة المحاولة.'
      })
      setLoading(false)
    }
  }

  // Super Admin One-Time Setup Handler
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regDisplayName.trim() || regDisplayName.trim().length < 3) {
      setFeedback({ type: 'error', message: 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل).' })
      return
    }
    if (!regUsername.trim() || regUsername.trim().length < 3) {
      setFeedback({ type: 'error', message: 'يرجى إدخال اسم مستخدم صالح للدخول (3 أحرف على الأقل).' })
      return
    }
    if (regPassword.length < 8) {
      setFeedback({ type: 'error', message: 'كلمة المرور يجب أن لا تقل عن 8 خانات.' })
      return
    }
    if (regPin && (regPin.length < 4 || regPin.length > 6)) {
      setFeedback({ type: 'error', message: 'رمز PIN يجب أن يتكون من 4 إلى 6 أرقام.' })
      return
    }

    setRegLoading(true)
    setFeedback(null)

    try {
      await api.auth.registerSuperAdmin({
        fullName: regDisplayName.trim(),
        roleTitle: 'مدير النظام — المشرف العام',
        username: regUsername.trim().toLowerCase(),
        password: regPassword,
        pinCode: regPin.trim() || undefined
      })

      setFeedback({
        type: 'success',
        message: `تم إنشاء حساب مدير النظام "${regDisplayName}" بنجاح! تم قفل التسجيل وبدء الجلسة فوراً...`
      })

      setIsFirstRun(false)
      setStationTab('login')
      await loadInitialData()
      setTimeout(() => {
        navigate('/dashboard')
      }, 700)
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'تعذر إنشاء حساب مدير النظام، يرجى التأكد من عدم تكرار اسم المستخدم.'
      })
    } finally {
      setRegLoading(false)
    }
  }

  // RFID / Barcode Scanner quick prompt
  const handleRfidScan = () => {
    if (!selectedUser) return
    setFeedback({
      type: 'info',
      message: 'قارئ البطاقات والباركود جاهز: مرر البطاقة أو امسح الباركود على الجهاز، وسيتم إدخال الرمز مباشرة.'
    })
    setAuthMode('pin')
  }

  const handlePromptCustomUser = () => {
    const custom = window.prompt('أدخل اسم المستخدم المحلي (Username):')
    if (custom && custom.trim()) {
      const existing = usersList.find((u) => u.username.toLowerCase() === custom.trim().toLowerCase())
      if (existing) {
        setSelectedUser(existing)
        setAuthMode(existing.hasPin ? 'pin' : 'password')
        setPin('')
        setPassword('')
        setFeedback(null)
      } else {
        setFeedback({
          type: 'error',
          message: `اسم المستخدم "${custom.trim()}" غير مسجل في النظام المحلي.`
        })
      }
    }
  }

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (helpOpen || emergencyOpen) return

      if (e.key === 'F1') {
        e.preventDefault()
        setHelpOpen(true)
      } else if (e.key === 'F12') {
        e.preventDefault()
        setEmergencyOpen(true)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cycleNextUser()
      } else if (e.key === 'Enter' && !loading && !regLoading) {
        if (stationTab === 'login') {
          handleLogin()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [helpOpen, emergencyOpen, loading, regLoading, stationTab, cycleNextUser, handleLogin])

  const kindergartenName =
    settings['branch.name'] || settings['branch.kindergartenNameAr'] || 'نظام روضتي'
  const branchCity = settings['branch.city'] || ''
  const branchName =
    settings['branch.branchName'] || (branchCity ? `فرع ${branchCity}` : '')
  const academicYear =
    settings['branch.academicYear'] || settings['appearance.activeAcademicYear'] || ''

  const avatarOptions = [
    { id: 'shield_person', label: 'إدارة' },
    { id: 'school', label: 'معلمة' },
    { id: 'badge', label: 'استقبال' },
    { id: 'payments', label: 'محاسبة' },
    { id: 'support_agent', label: 'إشراف' },
    { id: 'psychology', label: 'إرشاد' }
  ]

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between select-none">
      {/* ── Top Window Under-Chrome Subheader ───────────── */}
      <div className="w-full bg-surface-container-low px-4 py-2 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-primary font-bold text-headline-sm">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <span>محطة الدخول والتسجيل المكتبي الموحد</span>
          </div>

          <span className="h-4 w-px bg-outline-variant/50 hidden sm:inline-block" />

          <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-full text-on-surface shadow-xs border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-label-sm font-semibold">SQLite 3.44 WAL</span>
            <span className="text-caption text-on-surface-variant">(AES-256 محلي)</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">wifi_off</span>
            <span>100% دون إنترنت — معالجة مشفرة</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="تبديل المظهر (داكن / فاتح)"
            className="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container px-3 py-1 rounded-lg text-on-surface font-label-md text-label-md border border-outline-variant/30 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">help</span>
            <span>المساعدة</span>
            <kbd className="bg-surface-container-high text-on-surface-variant font-mono text-[10px] px-1 py-0.5 rounded">
              F1
            </kbd>
          </button>
        </div>
      </div>

      {/* ── Main Canvas Workspace ───────────────────────── */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Right Column: Institutional Identity & User Switcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Branding Card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-sm shadow-primary/20">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      nest_eco_leaf
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-headline-md text-primary tracking-tight">
                      {kindergartenName}
                    </h2>
                    <span className="font-semibold text-label-sm text-secondary">
                      منظومة الإدارة الذكية للتعليم المبكر
                    </span>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {[branchName, academicYear ? `العام الدراسي ${academicYear}` : null].filter(Boolean).join(' — ')}
                  {branchName || academicYear ? '. ' : ''}
                  محطة الدخول المشفرة تضمن حماية سجلات الأطفال وحضور الفصول محلياً دون الحاجة للإنترنت.
                </p>

                <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center gap-2.5 text-on-surface border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-label-sm">حماية البيانات المشددة</span>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      سجلات الأطفال مشفرة بمفتاح محلي AES-256 غير سحابي
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Switcher Panel */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                    <span className="font-bold text-label-lg">المستخدمون النشطون على هذا الجهاز</span>
                  </div>
                  <span className="font-caption text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-semibold">
                    {usersList.length} حساب
                  </span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
                  {usersList.length === 0 ? (
                    <div className="p-4 text-center text-on-surface-variant text-body-sm bg-surface-container-low rounded-xl">
                      لا توجد حسابات مسجلة بعد. استخدم نموذج إنشاء الحساب لبدء الاستخدام.
                    </div>
                  ) : (
                    usersList.map((u) => (
                      <QuickUserCard
                        key={u.id || u.username}
                        user={u}
                        isSelected={stationTab === 'login' && selectedUser?.username === u.username}
                        onSelect={(target) => {
                          setStationTab('login')
                          setSelectedUser(target)
                          setPin('')
                          setPassword('')
                          setFeedback(null)
                          setAuthMode(target.hasPin ? 'pin' : 'password')
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions at Bottom of Users List */}
              <div className="pt-3 mt-3 border-t border-outline-variant/20 flex flex-col gap-2">
                {isFirstRun && (
                  <button
                    type="button"
                    onClick={() => {
                      setStationTab('register')
                      setFeedback(null)
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-label-md transition-all ${
                      stationTab === 'register'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    <span>تهيئة حساب مدير النظام</span>
                  </button>
                )}

                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                  <button
                    type="button"
                    onClick={handlePromptCustomUser}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">badge</span>
                    <span>دخول بحساب مخصص</span>
                  </button>
                  <span>
                    <kbd className="bg-surface-container px-1 py-0.5 rounded">Esc</kbd> للتبديل
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Multi-Mode Auth & Registration Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
              <div>
                {/* ── First-Run Super Admin Notice (يظهر فقط عند التثبيت لأول مرة ويختفي نهائياً بعد إنشاء الحساب) ── */}
                {isFirstRun && (
                  <div className="flex items-center gap-3 p-3.5 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-label-lg text-primary">تهيئة حساب مدير النظام (للمرة الأولى فقط)</h3>
                      <p className="text-body-xs text-on-surface-variant">
                        يتم إنشاء هذا الحساب لمرة واحدة فقط كمسؤول أعلى للنظام، ثم تُقفل شاشة التسجيل تلقائياً.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Mode 1: LOGIN TAB ── */}
                {stationTab === 'login' && (
                  <>
                    {/* Active Selected User Profile Banner */}
                    {selectedUser && (
                      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl mb-6 border border-outline-variant/30">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-13 h-13 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs p-2.5">
                            <span className="material-symbols-outlined text-[28px]">
                              {selectedUser.avatarIcon || 'person'}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <h2 className="font-bold text-headline-sm text-on-surface truncate">
                                {selectedUser.displayName}
                              </h2>
                              <span className="bg-primary text-on-primary font-caption text-[11px] px-2 py-0.5 rounded-full font-bold">
                                {selectedUser.role === 'admin'
                                  ? 'مدير النظام'
                                  : selectedUser.role === 'educator'
                                  ? 'معلمة صف'
                                  : selectedUser.role === 'accountant'
                                  ? 'محاسب مالي'
                                  : 'كادر الروضة'}
                              </span>
                            </div>
                            <span className="text-body-sm text-on-surface-variant truncate mt-0.5">
                              {selectedUser.roleTitle || selectedUser.username}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPin('')
                            setPassword('')
                            setFeedback(null)
                          }}
                          title="إعادة تعيين الحقول"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">refresh</span>
                        </button>
                      </div>
                    )}

                    {/* Auth Mode Tabs Switcher */}
                    <div className="flex items-center gap-2 mb-6 bg-surface-container p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('pin')
                          setFeedback(null)
                        }}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-label-md flex items-center justify-center gap-2 transition-all ${
                          authMode === 'pin'
                            ? 'bg-surface-container-lowest text-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">dialpad</span>
                        <span>رمز PIN السريع (للفصول والحضور)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('password')
                          setFeedback(null)
                        }}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-label-md flex items-center justify-center gap-2 transition-all ${
                          authMode === 'password'
                            ? 'bg-surface-container-lowest text-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        <span>كلمة المرور الرئيسية</span>
                      </button>
                    </div>

                    {/* Auth Mode: PIN Code */}
                    {authMode === 'pin' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-label-md text-on-surface">
                            أدخل رمز PIN المكون من 4 إلى 6 أرقام:
                          </label>
                          <span className="text-caption text-on-surface-variant">
                            التبديل بين المعلمات دون خروج كامل
                          </span>
                        </div>

                        <PinKeypad
                          pin={pin}
                          onChange={setPin}
                          onSubmit={handleLogin}
                          disabled={loading}
                          maxDigits={6}
                        />
                      </div>
                    )}

                    {/* Auth Mode: Master Password */}
                    {authMode === 'password' && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-semibold text-label-md text-on-surface" htmlFor="master-pwd-input">
                              كلمة المرور المحلية:
                            </label>
                            <button
                              type="button"
                              onClick={() => setHelpOpen(true)}
                              className="text-label-sm text-primary hover:underline"
                            >
                              نسيت كلمة المرور؟
                            </button>
                          </div>

                          <div className="relative">
                            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                              vpn_key
                            </span>
                            <input
                              id="master-pwd-input"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="أدخل كلمة مرور الحساب المحلي..."
                              className="w-full h-12 bg-surface-container pr-11 pl-11 rounded-xl text-body-md text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {showPassword ? 'visibility_off' : 'visibility'}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-2.5 text-on-surface-variant border border-outline-variant/20">
                          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                          <span className="text-caption">
                            صلاحية مدير النظام تتطلب التحقق الثنائي لكلمات المرور عند التعديل الشامل.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Keep Session Active */}
                    <div className="flex items-center justify-between mt-5 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberSession}
                          onChange={(e) => setRememberSession(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                        />
                        <span className="font-medium text-label-md text-on-surface">
                          إبقاء جلسة اليوم نشطة على هذا الحاسوب
                        </span>
                      </label>
                      <span className="text-caption text-on-surface-variant">
                        انتهاء القفل التلقائي: 30 دقيقة
                      </span>
                    </div>

                    {/* Action Buttons & Feedback */}
                    <div className="space-y-3 mt-6">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleLogin}
                        className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold text-headline-sm rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-[22px]">login</span>
                        )}
                        <span>تسجيل الدخول للنظام</span>
                        <kbd className="bg-on-primary/20 text-on-primary font-mono text-[11px] px-2 py-0.5 rounded">
                          Enter ↵
                        </kbd>
                      </button>

                      {/* RFID / Card Alternate Button */}
                      <button
                        type="button"
                        disabled={loading || rfidScanning}
                        onClick={handleRfidScan}
                        className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-label-md rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all border border-outline-variant/30"
                      >
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          contactless
                        </span>
                        <span>تمرير بطاقة المعلمة الذكية (RFID) أو باركود الحضور</span>
                      </button>

                      {/* Switch to Registration Callout */}
                      {isFirstRun ? (
                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                          <span className="text-body-sm text-on-surface-variant">
                            تهيئة المشرف العام للنظام لأول مرة:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setStationTab('register')
                              setFeedback(null)
                            }}
                            className="text-primary font-bold text-label-md hover:underline flex items-center gap-1"
                          >
                            <span>تهيئة حساب مدير النظام الآن</span>
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-on-surface-variant text-body-xs">
                            <span className="material-symbols-outlined text-base text-primary">security</span>
                            <span>إضافة وتعديل حسابات المعلمات والموظفين تتم حصراً من داخل لوحة التحكم بواسطة المشرف الإداري.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── Mode 2: REGISTER TAB (تهيئة مدير النظام للمرة الأولى فقط) ── */}
                {isFirstRun && stationTab === 'register' && (
                  <form onSubmit={handleRegisterUser} className="space-y-4">
                    {/* Welcome Callout if First Run */}
                    <div className="p-3.5 bg-primary-container/40 text-on-primary-container rounded-xl border border-primary/30 flex items-start gap-2.5 mb-2">
                      <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
                        waving_hand
                      </span>
                      <div className="text-body-sm">
                        <strong className="block font-bold">مرحباً بك في نظام روضتي المكتبي!</strong>
                        هذه أول عملية تشغيل بعد تثبيت البرنامج. يرجى إنشاء حساب مدير النظام (المسؤول الأعلى). سيتم قفل إمكانية إنشاء الحسابات الخارجية بعد هذه الخطوة مباشرة.
                      </div>
                    </div>

                    {/* Role Locked Card */}
                    <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0">
                        <span className="material-symbols-outlined text-[24px]">shield_person</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-label-md text-primary">نوع الحساب: مدير النظام الأعلى (Super Admin)</div>
                        <div className="text-body-xs text-on-surface-variant">
                          كامل الصلاحيات الإدارية والمالية والأمنية • يُنشأ لمرة واحدة فقط
                        </div>
                      </div>
                    </div>

                    {/* Display Name & Username */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-label-sm text-on-surface block mb-1">
                          الاسم الكامل للمستخدم:
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                            person
                          </span>
                          <input
                            type="text"
                            required
                            value={regDisplayName}
                            onChange={(e) => setRegDisplayName(e.target.value)}
                            placeholder="مثال: أ. ليلى المنصوري"
                            className="w-full h-11 bg-surface-container pr-10 pl-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-label-sm text-on-surface block mb-1">
                          اسم المستخدم للدخول (Username):
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                            alternate_email
                          </span>
                          <input
                            type="text"
                            required
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            placeholder="مثال: laila_admin"
                            className="w-full h-11 bg-surface-container pr-10 pl-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password & Quick PIN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-label-sm text-on-surface block mb-1">
                          كلمة المرور (8 خانات على الأقل):
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                            lock
                          </span>
                          <input
                            type={regShowPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="كلمة مرور قوية..."
                            className="w-full h-11 bg-surface-container pr-10 pl-9 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30"
                          />
                          <button
                            type="button"
                            onClick={() => setRegShowPassword(!regShowPassword)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {regShowPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-label-sm text-on-surface block mb-1">
                          رمز PIN السريع (اختياري 4-6 أرقام):
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                            dialpad
                          </span>
                          <input
                            type="password"
                            maxLength={6}
                            value={regPin}
                            onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="مثال: 1234"
                            className="w-full h-11 bg-surface-container pr-10 pl-3 rounded-xl text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-high border border-outline-variant/30 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Avatar Icon Selector */}
                    <div>
                      <label className="font-semibold text-label-sm text-on-surface block mb-1.5">
                        اختر أيقونة الحساب الشخصية:
                      </label>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {avatarOptions.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setRegAvatar(av.id)}
                            className={`p-2 rounded-xl flex items-center gap-1.5 transition-all text-xs border ${
                              regAvatar === av.id
                                ? 'bg-primary text-on-primary border-primary shadow-xs'
                                : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/20'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{av.id}</span>
                            <span>{av.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Registration Button */}
                    <div className="space-y-3 pt-2">
                      <button
                        type="submit"
                        disabled={regLoading}
                        className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold text-headline-sm rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {regLoading ? (
                          <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                        )}
                        <span>إنشاء حساب مدير النظام وبدء الاستخدام</span>
                      </button>

                      {/* Super Admin Wizard Link */}
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-body-sm text-on-surface-variant">
                          تريد تهيئة مدير النظام الأعلى مع شهادة أمان ورقية؟
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate('/register')}
                          className="text-primary font-bold text-label-md hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">badge</span>
                          <span>معالج التثبيت الشامل (F12)</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Feedback Banner */}
                {feedback && (
                  <div
                    className={`p-3 rounded-xl font-medium text-label-md flex items-center gap-2.5 transition-all animate-in fade-in mt-4 ${
                      feedback.type === 'error'
                        ? 'bg-error-container text-on-error-container'
                        : feedback.type === 'success'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30'
                        : 'bg-primary-container text-on-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {feedback.type === 'error' ? 'error' : feedback.type === 'success' ? 'check_circle' : 'info'}
                    </span>
                    <span>{feedback.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Technical Status Bar Footer ─────────────────── */}
      <footer className="w-full bg-surface-container-high px-4 py-2 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant font-label-sm text-label-sm shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-primary">database</span>
            <span className="text-on-surface-variant">الملف المحلي:</span>
            <span className="bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/20 max-w-xs truncate" title={dbPath || 'قاعدة البيانات المحلية'}>
              {dbPath ? dbPath.split(/[/\\]/).pop() || dbPath : 'قاعدة البيانات المحلية النشطة'}
            </span>
          </div>

          <span className="h-3 w-px bg-outline-variant/50 hidden md:inline-block" />

          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>قاعدة البيانات متصلة وسليمة</span>
            <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.2 rounded font-bold">
              100% محلي دون إنترنت
            </span>
          </div>
        </div>

        {/* Shortcuts & Emergency Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden lg:flex items-center gap-2 text-caption text-on-surface-variant">
            <span>اختصارات:</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20"><kbd>Enter</kbd> دخول</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20"><kbd>Esc</kbd> تبديل</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20"><kbd>F12</kbd> صيانة</span>
            <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20"><kbd>F1</kbd> مساعدة</span>
          </div>

          <button
            type="button"
            onClick={() => setEmergencyOpen(true)}
            className="flex items-center gap-1 text-tertiary hover:bg-tertiary-container/30 px-2.5 py-1 rounded-lg transition-colors font-semibold text-label-sm border border-tertiary/20"
          >
            <span className="material-symbols-outlined text-[16px]">build_circle</span>
            <span>وضع الطوارئ والصيانة (F12)</span>
          </button>
        </div>
      </footer>

      {/* ── Modals ───────────────────────────────────────── */}
      <OfflineHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <EmergencyMaintenanceModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  )
}

export default AuthStationPage
