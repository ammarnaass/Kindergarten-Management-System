import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import { validateSaudiId } from '../utils/validateSaudiId'

export function useRegistrationWizard() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [roleTitle, setRoleTitle] = useState('مدير النظام / المشرف العام')
  const [nationalId, setNationalId] = useState('')
  const [phone, setPhone] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pinCode, setPinCode] = useState('')

  // Offline Recovery Key
  const [recoveryKey] = useState(() => {
    const r1 = Math.floor(1000 + Math.random() * 9000)
    const r2 = Math.random().toString(36).substring(2, 6).toUpperCase()
    const r3 = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `RAW-${r1}-${r2}-${r3}-2026`
  })

  const [q1, setQ1] = useState('')
  const [a1, setA1] = useState('')
  const [q2, setQ2] = useState('')
  const [a2, setA2] = useState('')

  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  // Redirect to /login if admin is already registered (one-time setup lock)
  useEffect(() => {
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
  const isLuhnValid = useMemo(() => (!nationalId.trim() ? true : validateSaudiId(nationalId)), [nationalId])
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const isFormValid =
    fullName.trim().length >= 3 &&
    username.trim().length >= 3 &&
    password.length >= 8 &&
    passwordsMatch &&
    agreed

  const copyMasterKey = () => {
    navigator.clipboard.writeText(recoveryKey)
    toast({
      title: 'تم نسخ مفتاح الطوارئ بنجاح',
      description: 'احتفظ به في مكان آمن بعيداً عن أيدي الموظفين والأطفال.',
      variant: 'success'
    })
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      toast({
        title: 'يرجى استكمال البيانات المطلوبة',
        description: 'تأكد من مطابقة كلمة المرور وصحة اسم المستخدم والموافقة على التعهد.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await api.auth.registerSuperAdmin({
        fullName: fullName.trim(),
        roleTitle,
        nationalId: nationalId.trim() || undefined,
        phone: phone.trim() || undefined,
        adminEmail: adminEmail.trim() || undefined,
        username: username.trim().toLowerCase(),
        password,
        pinCode: pinCode.trim() || undefined,
        recoveryKey,
        securityQuestions: q1 && a1 ? [{ question: q1, answer: a1 }, { question: q2, answer: a2 }] : undefined
      })

      toast({
        title: 'تم تثبيت واعتماد حساب المشرف الأعلى بنجاح!',
        description: 'تم قفل معالج التثبيت نهائياً. سيتم نقلك إلى لوحة القيادة...',
        variant: 'success'
      })

      setShowCertificate(true)
    } catch (err: any) {
      toast({
        title: 'فشل في تثبيت الحساب',
        description: err.message || 'حدث خطأ غير متوقع أثناء حفظ الحساب في قاعدة البيانات المحلية.',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  return {
    fullName,
    setFullName,
    roleTitle,
    setRoleTitle,
    nationalId,
    setNationalId,
    phone,
    setPhone,
    adminEmail,
    setAdminEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    pinCode,
    setPinCode,
    recoveryKey,
    q1,
    setQ1,
    a1,
    setA1,
    q2,
    setQ2,
    a2,
    setA2,
    agreed,
    setAgreed,
    loading,
    showCertificate,
    setShowCertificate,
    emergencyOpen,
    setEmergencyOpen,
    isLuhnValid,
    passwordsMatch,
    isFormValid,
    copyMasterKey,
    handleSubmit
  }
}
