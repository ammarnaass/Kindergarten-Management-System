import { useState, useEffect, useCallback } from 'react'
import { api } from '../../../lib/api'
import type { SystemPrinter } from '../../../lib/api/types'
import type { SetupStep, SetupFormData, SetupClassroomItem } from '../types'
import { DEFAULT_INITIAL_CLASSROOMS } from '../constants'

function generateRecoveryKey(): string {
  const segment1 = Math.floor(1000 + Math.random() * 9000)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let segment2 = ''
  for (let i = 0; i < 4; i++) {
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `RAW-${segment1}-${segment2}-${new Date().getFullYear()}`
}

export function useSetupWizard() {
  const [currentStep, setCurrentStep] = useState<SetupStep>(1)
  const [printers, setPrinters] = useState<SystemPrinter[]>([])
  const [diagnostics, setDiagnostics] = useState<{ ok: boolean; path: string; journalMode: string } | null>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [installStepLabel, setInstallStepLabel] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<SetupFormData>({
    agreedToTerms: false,
    branchName: '',
    licenseNumber: '',
    city: 'الرياض',
    phone: '',
    email: '',
    logoDataUrl: '',
    academicYear: '2024-2025',
    currency: 'SAR',
    timeFormat: '12h',
    adminUsername: 'admin',
    adminDisplayName: '',
    adminPassword: '',
    adminConfirmPassword: '',
    adminPin: '',
    recoveryKey: generateRecoveryKey(),
    classrooms: DEFAULT_INITIAL_CLASSROOMS,
    documentPrinter: '',
    receiptPrinter: '',
    cardPrinter: ''
  })

  // Load diagnostics and printers
  useEffect(() => {
    async function loadInitial() {
      try {
        const check = await api.system.integrityCheck()
        setDiagnostics({
          ok: check.ok,
          path: check.dbPath,
          journalMode: check.journalMode
        })
      } catch (err) {
        console.error('Integrity check error:', err)
      }

      try {
        const pList = await api.system.getPrinters()
        setPrinters(pList)
        const defaultPrinter = pList.find((p) => p.isDefault)?.name || pList[0]?.name || ''
        setFormData((prev) => ({
          ...prev,
          documentPrinter: prev.documentPrinter || defaultPrinter,
          receiptPrinter: prev.receiptPrinter || defaultPrinter
        }))
      } catch (err) {
        console.error('Printers check error:', err)
      }
    }
    loadInitial()
  }, [])

  const updateFormData = useCallback((fields: Partial<SetupFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
    setError(null)
  }, [])

  const addClassroom = useCallback((item: Omit<SetupClassroomItem, 'id'>) => {
    setFormData((prev) => ({
      ...prev,
      classrooms: [
        ...prev.classrooms,
        { ...item, id: `cls-${Date.now()}` }
      ]
    }))
  }, [])

  const removeClassroom = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      classrooms: prev.classrooms.filter((c) => c.id !== id)
    }))
  }, [])

  const updateClassroom = useCallback((id: string, updates: Partial<SetupClassroomItem>) => {
    setFormData((prev) => ({
      ...prev,
      classrooms: prev.classrooms.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }))
  }, [])

  const regenerateRecoveryKey = useCallback(() => {
    setFormData((prev) => ({ ...prev, recoveryKey: generateRecoveryKey() }))
  }, [])

  // Validation per step
  const validateStep = (step: SetupStep): boolean => {
    setError(null)
    if (step === 1) {
      if (!formData.agreedToTerms) {
        setError('يرجى الموافقة على شروط الاستخدام والأمان المحلي للمتابعة.')
        return false
      }
      return true
    }
    if (step === 2) {
      if (!formData.branchName.trim()) {
        setError('يرجى إدخال اسم الروضة أو المركز التعليمي.')
        return false
      }
      return true
    }
    if (step === 3) {
      if (!formData.adminDisplayName.trim()) {
        setError('يرجى إدخال الاسم الكامل للمشرف العام.')
        return false
      }
      if (!formData.adminUsername.trim() || formData.adminUsername.length < 3) {
        setError('اسم المستخدم يجب ألا يقل عن 3 أحرف إنجليزية.')
        return false
      }
      if (!formData.adminPassword || formData.adminPassword.length < 4) {
        setError('كلمة المرور يجب أن تكون 4 خانات على الأقل.')
        return false
      }
      if (formData.adminPassword !== formData.adminConfirmPassword) {
        setError('كلمة المرور وتأكيدها غير متطابقين.')
        return false
      }
      if (!formData.adminPin || formData.adminPin.length < 4) {
        setError('رمز PIN للدخول السريع يجب أن يتكون من 4 إلى 6 أرقام.')
        return false
      }
      return true
    }
    if (step === 4) {
      if (formData.classrooms.length === 0) {
        setError('يجب تحديد فصل دراسي واحد على الأقل.')
        return false
      }
      return true
    }
    return true
  }

  const goToNextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((prev) => (prev + 1) as SetupStep)
      }
    }
  }, [currentStep, formData])

  const goToPreviousStep = useCallback(() => {
    setError(null)
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SetupStep)
    }
  }, [currentStep])

  // Execute installation
  const executeInstallation = useCallback(async () => {
    setIsInstalling(true)
    setError(null)
    setInstallProgress(15)
    setInstallStepLabel('فحص سلامة قاعدة البيانات المحلية...')

    try {
      await new Promise((r) => setTimeout(r, 600))
      setInstallProgress(35)
      setInstallStepLabel('حفظ هوية الروضة والبيانات الرسمية والعملة...')

      await new Promise((r) => setTimeout(r, 600))
      setInstallProgress(60)
      setInstallStepLabel('تشفير كلمة المرور وإنشاء حساب المشرف العام الأعلى...')

      await new Promise((r) => setTimeout(r, 600))
      setInstallProgress(80)
      setInstallStepLabel('تهيئة الفصول الدراسية وربط الطابعات الافتراضية...')

      const payload = {
        branch: {
          name: formData.branchName,
          licenseNumber: formData.licenseNumber,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
          logoDataUrl: formData.logoDataUrl,
          academicYear: formData.academicYear,
          currency: formData.currency,
          timeFormat: formData.timeFormat
        },
        admin: {
          username: formData.adminUsername,
          displayName: formData.adminDisplayName,
          password: formData.adminPassword,
          pin: formData.adminPin,
          recoveryKey: formData.recoveryKey
        },
        classrooms: formData.classrooms.map((c) => ({
          name: c.name,
          room: c.room,
          capacity: c.capacity
        })),
        printers: {
          documentPrinter: formData.documentPrinter,
          receiptPrinter: formData.receiptPrinter,
          cardPrinter: formData.cardPrinter
        }
      }

      await api.system.completeSetup(payload)

      setInstallProgress(100)
      setInstallStepLabel('تم التثبيت وتفعيل قفل النظام بنجاح!')
      setIsComplete(true)
    } catch (err: any) {
      console.error('Setup execution failed:', err)
      setError(err?.message || 'حدث خطأ أثناء تنفيذ عملية التثبيت.')
      setIsInstalling(false)
    }
  }, [formData])

  return {
    currentStep,
    setCurrentStep,
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
  }
}
