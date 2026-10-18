import type { SetupClassroomItem, StepMeta } from './types'

export const STEPS_META: StepMeta[] = [
  {
    step: 1,
    title: 'فحص المتطلبات',
    subtitle: 'جاهزية النظام والتخزين المحلي',
    iconName: 'ShieldCheck'
  },
  {
    step: 2,
    title: 'هوية الروضة',
    subtitle: 'البيانات الرسمية والعملة والتوقيت',
    iconName: 'Building2'
  },
  {
    step: 3,
    title: 'المشرف العام',
    subtitle: 'حساب المدير ورمز PIN والاسترداد',
    iconName: 'UserCheck'
  },
  {
    step: 4,
    title: 'الفصول الدراسية',
    subtitle: 'تهيئة المراحل والقاعات المبدئية',
    iconName: 'GraduationCap'
  },
  {
    step: 5,
    title: 'فحص العتاد',
    subtitle: 'ربط الطابعات وقارئ الباركود',
    iconName: 'Printer'
  },
  {
    step: 6,
    title: 'التثبيت والبدء',
    subtitle: 'تهيئة قاعدة البيانات وقفل التثبيت',
    iconName: 'Sparkles'
  }
]

export const DEFAULT_INITIAL_CLASSROOMS: SetupClassroomItem[] = [
  { id: 'cls-1', name: 'فصل البراعم (الحضانة)', room: 'قاعة 101', capacity: 15 },
  { id: 'cls-2', name: 'فصل النجوم (روضة أولى KG1)', room: 'قاعة 102', capacity: 18 },
  { id: 'cls-3', name: 'فصل الفراشات (روضة ثانية KG2)', room: 'قاعة 103', capacity: 20 },
  { id: 'cls-4', name: 'فصل العباقرة (تمهيدي KG3)', room: 'قاعة 104', capacity: 20 }
]

export const CURRENCY_OPTIONS = [
  { code: 'SAR', label: 'ريال سعودي (SAR)' },
  { code: 'AED', label: 'درهم إماراتي (AED)' },
  { code: 'KWD', label: 'دينار كويتي (KWD)' },
  { code: 'BHD', label: 'دينار بحريني (BHD)' },
  { code: 'OMR', label: 'ريال عماني (OMR)' },
  { code: 'QAR', label: 'ريال قطري (QAR)' },
  { code: 'EGP', label: 'جنيه مصري (EGP)' },
  { code: 'USD', label: 'دولار أمريكي (USD)' }
]
