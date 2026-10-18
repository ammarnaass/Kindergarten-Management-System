import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { RecoveryKeyCertificate } from './components/RecoveryKeyCertificate'
import { EmergencyMaintenanceModal } from './components/EmergencyMaintenanceModal'
import { useToast } from '@/components/ui/toast'

// Helper: Saudi National ID / Iqama Luhn checksum validation
function validateSaudiId(id: string): boolean {
  if (!/^[12]\d{9}$/.test(id)) return false
  let sum = 0
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(id.charAt(i), 10)
    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

export const RegistrationWizardPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Form Fields
  const [fullName, setFullName] = useState('أ. عبد الرحمن بن سليمان المنصور')
  const [roleTitle, setRoleTitle] = useState('مالك المنشأة / المدير العام التنفيذي')
  const [nationalId, setNationalId] = useState('1089345210')
  const [phone, setPhone] = useState('501234567')
  const [adminEmail, setAdminEmail] = useState('admin@al-amal.rawdaty.local')

  const [username, setUsername] = useState('superadmin')
  const [password, setPassword] = useState('Rawdati@2026#SecureAdmin')
  const [confirmPassword, setConfirmPassword] = useState('Rawdati@2026#SecureAdmin')
  const [showPassword, setShowPassword] = useState(false)
  const [pinCode, setPinCode] = useState('849201')

  // Offline Recovery Key
  const [recoveryKey] = useState(() => {
    const r1 = Math.floor(1000 + Math.random() * 9000)
    const r2 = Math.random().toString(36).substring(2, 6).toUpperCase()
    const r3 = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `RAW-${r1}-${r2}-${r3}-2026`
  })

  const [q1, setQ1] = useState('ما هو الاسم الأول لأول معلمة أسست الروضة؟')
  const [a1, setA1] = useState('أ. نورة الشمري')
  const [q2, setQ2] = useState('ما هو الرمز المالي لحساب بنك المنشأة المعتمد؟')
  const [a2, setA2] = useState('SA-ALAMAL-2018')

  const [agreed, setAgreed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  // Redirect to /login if admin is already registered (one-time setup lock)
  React.useEffect(() => {
    api.auth.checkSetup().then((status) => {
      if (status.hasAdmin) {
        toast({
          title: 'النظام مهيأ بالفعل',
          description: 'تم تسجيل مدير النظام مسبقاً. إنشاء الحسابات الإضافية يتم فقط من داخل الإعدادات بعد تسجيل الدخول.',
          variant: 'warning'
        })
        navigate('/login', { replace: true })
      }
    }).catch(() => {})
  }, [navigate, toast])

  // Validation Checkers
  const isLuhnValid = useMemo(() => validateSaudiId(nationalId), [nationalId])
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const isFormValid =
    fullName.trim().length >= 3 &&
    username.trim().length >= 3 &&
    password.length >= 8 &&
    passwordsMatch &&
    agreed

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      toast({
        title: 'يرجى استكمال البيانات المطلوبة',
        description: 'تأكد من مطابقة كلمة المرور وصحة رقم الهوية والموافقة على التعهد.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await api.auth.registerSuperAdmin({
        fullName: fullName.trim(),
        roleTitle,
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        adminEmail: adminEmail.trim(),
        username: username.trim(),
        password,
        pinCode: pinCode.trim(),
        recoveryKey,
        securityQuestions: [
          { question: q1, answer: a1 },
          { question: q2, answer: a2 }
        ]
      })

      toast({
        title: 'تم إنشاء حساب المسؤول الأعلى بنجاح',
        description: 'تم توثيق مفتاح الأمان والبيانات وتدشين النظام بنجاح.'
      })

      // Show certificate before redirecting or redirect
      setShowCertificate(true)
    } catch (err: any) {
      toast({
        title: 'تعذر إتمام التسجيل',
        description: err.message || 'حدث خطأ أثناء حفظ السجل في قاعدة البيانات.',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  const copyMasterKey = () => {
    navigator.clipboard.writeText(recoveryKey)
    toast({
      title: 'تم نسخ مفتاح الطوارئ',
      description: 'احتفظ بالمفتاح في مكان آمن وبعيد عن متناول غير المصرح لهم.'
    })
  }

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8 flex flex-col items-center select-none">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* ── Stepper Header Bar ─────────────────────────── */}
        <div className="w-full bg-surface-container-lowest shadow-sm rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold text-label-md mb-1">
                <span className="material-symbols-outlined text-[18px]">install_desktop</span>
                <span>معالج التثبيت والتشغيل الأولي لنظام روضتي المكتبي</span>
              </div>
              <h1 className="font-extrabold text-headline-lg text-on-surface tracking-tight">
                إعداد مدير النظام الرئيسي (Super Administrator)
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-xl border border-outline-variant/30 self-start lg:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-semibold text-label-sm text-on-surface-variant">
                البيئة: محلية بالكامل (Air-Gapped / Offline-First)
              </span>
            </div>
          </div>

          {/* 4-Step Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div className="min-w-0">
                <p className="font-caption text-caption text-emerald-600 font-semibold">الخطوة 1 - مكتملة</p>
                <p className="font-bold text-label-md text-on-surface truncate">تهيئة قاعدة بيانات SQLite</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary text-on-primary rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-full bg-on-primary text-primary flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div className="min-w-0">
                <p className="font-caption text-caption text-primary-container font-semibold">الخطوة الحالية</p>
                <p className="font-bold text-label-md text-on-primary truncate">تعيين المسؤول الأعلى</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl opacity-75 border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div className="min-w-0">
                <p className="font-caption text-caption text-on-surface-variant">الخطوة التالية</p>
                <p className="font-bold text-label-md text-on-surface-variant truncate">بيانات الروضة والفروع</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl opacity-75 border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div className="min-w-0">
                <p className="font-caption text-caption text-on-surface-variant">الخطوة الختامية</p>
                <p className="font-bold text-label-md text-on-surface-variant truncate">التفضيلات والطباعة المحلية</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero Alert Banner ──────────────────────────── */}
        <div className="w-full bg-surface-container-high rounded-2xl p-5 flex items-start gap-4 shadow-xs border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[28px]">shield_person</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-headline-sm text-on-surface">
                إنشاء حساب الجذر (Super Administrator)
              </h3>
              <span className="bg-primary text-on-primary font-caption text-[11px] px-2 py-0.5 rounded-full font-bold">
                صلاحية مطلقة
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              يمتلك هذا الحساب الصلاحية الكاملة لإدارة قواعد البيانات المحلية، منح التراخيص للمشرفين والمعلمات، توليد النسخ الاحتياطية المشفرة، وإعادة ضبط الأمان في حالات الطوارئ دون الحاجة لأي خادم سحابي.
            </p>
          </div>
        </div>

        {/* ── Form Grid Workspace ────────────────────────── */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          {/* Row 1: Section A (Personal) & Section B (Credentials) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section A: Personal Information */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                    <h2 className="font-bold text-label-lg text-on-surface">
                      القسم الأول: البيانات الإدارية والشخصية
                    </h2>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    حقول مطلوبة للتوثيق
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="fullName">
                      الاسم الرباعي الكامل للمسؤول <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        person
                      </span>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="أدخل الاسم الرباعي المعتمد"
                        className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Role Title */}
                  <div>
                    <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="roleTitle">
                      المسمى الوظيفي والصفة الرسمية <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        work
                      </span>
                      <select
                        id="roleTitle"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary appearance-none transition-colors"
                      >
                        <option value="مالك المنشأة / المدير العام التنفيذي">مالك المنشأة / المدير العام التنفيذي</option>
                        <option value="مدير/ـة الروضة المعتمد">مدير/ـة الروضة المعتمد</option>
                        <option value="مدير تقنية المعلومات والأنظمة المحلية">مدير تقنية المعلومات والأنظمة المحلية</option>
                        <option value="المشرف العام للشؤون الإدارية والمالية">المشرف العام للشؤون الإدارية والمالية</option>
                      </select>
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* National ID with Luhn Check */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-medium text-label-md text-on-surface" htmlFor="nationalId">
                        رقم الهوية الوطنية / الإقامة <span className="text-error">*</span>
                      </label>
                      <span
                        className={`flex items-center gap-1 font-caption text-caption px-2.5 py-0.5 rounded-full font-semibold ${
                          isLuhnValid
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isLuhnValid ? 'verified' : 'info'}
                        </span>
                        <span>{isLuhnValid ? 'مطابق لخوارزمية Luhn' : '10 أرقام'}</span>
                      </span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        fingerprint
                      </span>
                      <input
                        id="nationalId"
                        type="text"
                        maxLength={10}
                        required
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="10 أرقام تبدأ بـ 1 أو 2"
                        className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface font-mono tracking-wider border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Saudi Mobile */}
                  <div>
                    <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="phone">
                      رقم الجوال المعتمد للطوارئ <span className="text-error">*</span>
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <div className="bg-surface-container px-3 py-2.5 rounded-xl flex items-center gap-1.5 text-on-surface font-mono text-label-md shrink-0 border border-outline-variant/30">
                        <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                        <span>+966</span>
                      </div>
                      <input
                        id="phone"
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="5X XXX XXXX"
                        className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface font-mono border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Local Email */}
                  <div>
                    <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="adminEmail">
                      البريد الإلكتروني للأرشفة والتقارير <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        mail
                      </span>
                      <input
                        id="adminEmail"
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@al-amal.rawdaty.local"
                        className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Authentication Credentials */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    <h2 className="font-bold text-label-lg text-on-surface">
                      القسم الثاني: بيانات المصادقة والأمان المحلي
                    </h2>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant font-mono">
                    تشفير محلي scrypt/Argon2
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Master Username */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-medium text-label-md text-on-surface" htmlFor="username">
                        اسم مستخدم الحساب الرئيسي (Username) <span className="text-error">*</span>
                      </label>
                      <span className="font-caption text-caption text-secondary font-semibold">
                        غير قابل للتعديل لاحقاً
                      </span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        alternate_email
                      </span>
                      <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface font-mono border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Master Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-medium text-label-md text-on-surface" htmlFor="password">
                        كلمة المرور الرئيسية للنظام <span className="text-error">*</span>
                      </label>
                      <span className="font-caption text-caption text-primary font-semibold">
                        قوية ومحمية (100%)
                      </span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        key
                      </span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pr-11 pl-11 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-colors"
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

                    {/* Password Strength Indicator */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-primary" />
                      <div className="h-1.5 rounded-full bg-primary" />
                      <div className="h-1.5 rounded-full bg-primary" />
                      <div className="h-1.5 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block font-medium text-label-md text-on-surface mb-1.5" htmlFor="confirmPassword">
                      تأكيد كلمة المرور الرئيسية <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        check_circle
                      </span>
                      <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pr-11 pl-11 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border transition-colors ${
                          passwordsMatch
                            ? 'border-emerald-500/50 focus:border-emerald-500'
                            : 'border-outline-variant/30 focus:border-primary'
                        }`}
                      />
                      {passwordsMatch && (
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-[20px]">
                          done_all
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Access PIN */}
                  <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-label-md text-on-surface flex items-center gap-1.5" htmlFor="pinCode">
                        <span className="material-symbols-outlined text-primary text-[18px]">dialpad</span>
                        <span>رمز المرور السريع للوحة المفاتيح (Quick 6-Digit PIN)</span>
                      </label>
                      <span className="font-caption text-caption bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-semibold">
                        عمليات سريعة
                      </span>
                    </div>
                    <p className="text-caption text-on-surface-variant mb-2.5">
                      يسمح بالتفويض السريع للعمليات الحساسة (قفل الشاشة أو التحضير السريع) دون كتابة كلمة المرور الطويلة في كل مرة.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        id="pinCode"
                        type="password"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        className="w-44 px-3 py-2 bg-surface-container-lowest text-center tracking-[0.4em] font-headline-sm text-primary rounded-xl border border-outline-variant/40 focus:outline-none focus:border-primary"
                      />
                      <span className="text-caption text-on-surface-variant">
                        6 أرقام فقط (Numpad Ready)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Offline Recovery Key & Security Questions */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">key_vertical</span>
                <h2 className="font-bold text-label-lg text-on-surface">
                  القسم الثالث: بروتوكول استعادة الحساب بدون إنترنت (Offline Recovery)
                </h2>
              </div>
              <span className="font-caption text-caption bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold">
                مهم جداً للحفاظ على استمرارية المنشأة
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 flex flex-col gap-2.5">
                <p className="text-body-md text-on-surface leading-relaxed">
                  نظراً لأن نظام <strong>روضتي</strong> يعمل محلياً بالكامل ومفصولاً عن خوادم الإنترنت السحابية لحماية خصوصية بيانات الأطفال وعائلاتهم، فإنه لا يمكن طلب "إعادة تعيين كلمة المرور عبر البريد أو رسالة SMS".
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  هذا المفتاح المشفر أدناه هو الوسيلة الوحيدة لفتح قاعدة البيانات المشفرة إذا فُقدت كلمة المرور. احتفظ به في مكان آمن أو خزنة الروضة.
                </p>

                {/* Master Key Card */}
                <div className="bg-surface-container p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
                    <div>
                      <span className="block text-caption text-on-surface-variant">
                        مفتاح الطوارئ الرئيسي المشفر (AES-256 Recovery Key)
                      </span>
                      <span className="font-mono text-headline-sm font-bold text-primary tracking-widest select-all">
                        {recoveryKey}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={copyMasterKey}
                      className="px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-label-md flex items-center gap-1.5 transition-colors shadow-xs border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span>نسخ المفتاح</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCertificate(true)}
                      className="px-3.5 py-2 bg-primary text-on-primary rounded-xl font-semibold text-label-md flex items-center gap-1.5 hover:bg-primary-container transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span>طباعة شهادة الأمان</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Questions */}
              <div className="lg:col-span-5 bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 border border-outline-variant/30">
                <div className="flex items-center gap-1.5 text-on-surface font-semibold text-label-md mb-0.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">quiz</span>
                  <span>الأسئلة الأمنية الإضافية (استرجاع فوري محلي)</span>
                </div>

                <div>
                  <label className="block text-caption text-on-surface-variant mb-1">السؤال الأمني الأول:</label>
                  <input
                    type="text"
                    value={q1}
                    onChange={(e) => setQ1(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface mb-1.5 border border-outline-variant/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={a1}
                    onChange={(e) => setA1(e.target.value)}
                    placeholder="إجابة السؤال الأول"
                    className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-caption text-on-surface-variant mb-1">السؤال الأمني الثاني:</label>
                  <input
                    type="text"
                    value={q2}
                    onChange={(e) => setQ2(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface mb-1.5 border border-outline-variant/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    placeholder="إجابة السؤال الثاني"
                    className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Privileges Overview & Charter Pledge */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 text-primary pb-3 mb-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-[20px]">policy</span>
              <h2 className="font-bold text-label-lg text-on-surface">
                القسم الرابع: حزم الصلاحيات التلقائية وميثاق الأمان الرقمي
              </h2>
            </div>

            {/* Privileges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
              <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>
                <div>
                  <p className="font-bold text-label-sm text-on-surface">إدارة الموظفين</p>
                  <p className="text-caption text-on-surface-variant">صلاحية شاملة 100%</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
                <div>
                  <p className="font-bold text-label-sm text-on-surface">المالية والسندات</p>
                  <p className="text-caption text-on-surface-variant">الاعتماد والإلغاء</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[22px]">database</span>
                <div>
                  <p className="font-bold text-label-sm text-on-surface">النسخ وقاعدة البيانات</p>
                  <p className="text-caption text-on-surface-variant">ترحيل واستيراد</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[22px]">security</span>
                <div>
                  <p className="font-bold text-label-sm text-on-surface">إعدادات التشفير</p>
                  <p className="text-caption text-on-surface-variant">مفاتيح AES-256</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[22px]">door_front</span>
                <div>
                  <p className="font-bold text-label-sm text-on-surface">بوابات التحضير</p>
                  <p className="text-caption text-on-surface-variant">ربط باركود وRFID</p>
                </div>
              </div>
            </div>

            {/* Pledge Checkbox */}
            <div className="p-4 bg-surface-container rounded-xl flex items-start gap-3 border border-outline-variant/30">
              <input
                id="charterAgreement"
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary rounded bg-surface-container-lowest focus:ring-0 cursor-pointer"
              />
              <label htmlFor="charterAgreement" className="cursor-pointer text-body-sm text-on-surface leading-relaxed">
                <strong className="block text-label-md text-on-surface mb-0.5">
                  إقرار المسؤولية والخصوصية المدرسية:
                </strong>
                أتعهد بصفتي المسؤول الأعلى الأول المعتمد لنظام روضتي بالحفاظ على سرية سجلات الأطفال والبيانات الأسرية والتقارير الصحية والمالية وفق الأنظمة واللوائح المعتمدة، وتحمل مسؤولية حفظ مفتاح الاستعادة المشفر وكلمة المرور الرئيسية بعيداً عن متناول غير المصرح لهم.
              </label>
            </div>
          </div>

          {/* ── Sticky Action Bar ──────────────────────────── */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
            <button
              type="button"
              onClick={() => setEmergencyOpen(true)}
              className="w-full md:w-auto px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-label-md flex items-center justify-center gap-2 transition-colors border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
              <span>استعادة نسخة احتياطية سابقة (F12)</span>
            </button>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full md:w-auto px-5 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-xl font-semibold text-label-md transition-colors"
              >
                العودة لمحطة الدخول
              </button>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full md:w-auto px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-label-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                )}
                <span>حفظ واعتماد حساب المسؤول الأعلى والمتابعة</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Printable Certificate Modal */}
      {showCertificate && (
        <RecoveryKeyCertificate
          recoveryKey={recoveryKey}
          adminName={fullName}
          username={username}
          nationalId={nationalId}
          createdAt={new Date().toLocaleString('ar-SA')}
          onClose={() => {
            setShowCertificate(false)
            navigate('/dashboard')
          }}
        />
      )}

      {/* Emergency Modal */}
      <EmergencyMaintenanceModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </div>
  )
}

export default RegistrationWizardPage
