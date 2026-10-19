import type { SetupStep, SetupFormData } from '../types'

export function validateSetupStep(step: SetupStep, formData: SetupFormData): string | null {
  if (step === 1) {
    if (!formData.agreedToTerms) {
      return 'يرجى الموافقة على شروط الاستخدام والأمان المحلي للمتابعة.'
    }
    return null
  }
  if (step === 2) {
    if (!formData.branchName.trim()) {
      return 'يرجى إدخال اسم الروضة أو المركز التعليمي.'
    }
    return null
  }
  if (step === 3) {
    if (!formData.adminDisplayName.trim()) {
      return 'يرجى إدخال الاسم الكامل للمشرف العام.'
    }
    if (!formData.adminUsername.trim() || formData.adminUsername.length < 3) {
      return 'اسم المستخدم يجب ألا يقل عن 3 أحرف إنجليزية.'
    }
    if (!formData.adminPassword || formData.adminPassword.length < 4) {
      return 'كلمة المرور يجب أن تكون 4 خانات على الأقل.'
    }
    if (formData.adminPassword !== formData.adminConfirmPassword) {
      return 'كلمة المرور وتأكيدها غير متطابقين.'
    }
    if (!formData.adminPin || formData.adminPin.length < 4) {
      return 'رمز PIN للدخول السريع يجب أن يتكون من 4 إلى 6 أرقام.'
    }
    return null
  }
  if (step === 4) {
    if (formData.classrooms.length === 0) {
      return 'يجب تحديد فصل دراسي واحد على الأقل.'
    }
    return null
  }
  return null
}
