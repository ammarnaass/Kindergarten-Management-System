import { useState, useEffect, useCallback } from 'react'
import { api } from '../../../lib/api'
import type { SystemPrinter } from '../../../lib/api/types'
import type { SetupStep, SetupFormData, SetupClassroomItem } from '../types'
import { DEFAULT_INITIAL_CLASSROOMS } from '../constants'
import { generateRecoveryKey } from '../utils/generateRecoveryKey'
import { validateSetupStep } from '../validators/validateSetupStep'

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
    const validationError = validateSetupStep(step, formData)
    if (validationError) {
      setError(validationError)
      return false
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
