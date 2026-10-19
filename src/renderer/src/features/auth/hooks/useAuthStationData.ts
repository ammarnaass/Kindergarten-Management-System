import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { LocalUserSummary, AuthMode, StationTab, AuthStationFeedback } from '../types'

export function useAuthStationData() {
  const navigate = useNavigate()

  // Primary Station Mode: 'login' | 'register'
  const [stationTab, setStationTab] = useState<StationTab>('login')
  const [isFirstRun, setIsFirstRun] = useState(false)

  // Login States
  const [usersList, setUsersList] = useState<LocalUserSummary[]>([])
  const [selectedUser, setSelectedUser] = useState<LocalUserSummary | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('pin')
  const [pin, setPin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberSession, setRememberSession] = useState(true)

  const [loading, setLoading] = useState(false)
  const [rfidScanning, setRfidScanning] = useState(false)
  const [feedback, setFeedback] = useState<AuthStationFeedback | null>(null)

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
  const loadInitialData = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

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

  return {
    stationTab,
    setStationTab,
    isFirstRun,
    usersList,
    selectedUser,
    setSelectedUser,
    authMode,
    setAuthMode,
    pin,
    setPin,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberSession,
    setRememberSession,
    loading,
    rfidScanning,
    feedback,
    setFeedback,
    regDisplayName,
    setRegDisplayName,
    regUsername,
    setRegUsername,
    regPassword,
    setRegPassword,
    regShowPassword,
    setRegShowPassword,
    regPin,
    setRegPin,
    regRole,
    setRegRole,
    regAvatar,
    setRegAvatar,
    regLoading,
    helpOpen,
    setHelpOpen,
    emergencyOpen,
    setEmergencyOpen,
    dbPath,
    kindergartenName,
    branchName,
    academicYear,
    loadInitialData,
    cycleNextUser,
    handleLogin,
    handleRegisterUser,
    handleRfidScan,
    handlePromptCustomUser
  }
}
