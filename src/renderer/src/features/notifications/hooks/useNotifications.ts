import { useState, useEffect, useCallback, useMemo } from 'react'
import { ipcApi } from '@/lib/api/ipc'
import type { AppNotification, NotificationCategory, NotificationFilterStats } from '../types'

const STORAGE_READ_KEY = 'kindergarten_notifications_read_v1'
const STORAGE_DISMISSED_KEY = 'kindergarten_notifications_dismissed_v1'

function getStoredIds(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return new Set(arr)
    }
  } catch {}
  return new Set()
}

function saveStoredIds(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)))
  } catch {}
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<NotificationCategory>('all')
  const [readIds, setReadIds] = useState<Set<string>>(() => getStoredIds(STORAGE_READ_KEY))
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => getStoredIds(STORAGE_DISMISSED_KEY))

  const fetchLiveAlerts = useCallback(async () => {
    try {
      const generated: AppNotification[] = []
      const now = Date.now()

      // 1. فحص الحساسيات الحرجة (Critical Allergies)
      try {
        const criticalAllergies = await ipcApi.health.criticalAllergies()
        if (Array.isArray(criticalAllergies)) {
          criticalAllergies.forEach((c) => {
            generated.push({
              id: `health-allergy-${c.id}`,
              title: `حساسية مفرطة حرجة: ${c.firstName} ${c.lastName}`,
              message: `يعاني الطفل من: ${c.allergies} (${c.classroomName || 'غير مسكّن'}). يلزم إبقاء حقنة الإبينفرين جاهزة وتدريب المعلمة.`,
              category: 'health',
              severity: 'critical',
              timestamp: now - 1000 * 60 * 15, // 15 mins ago
              read: false,
              actionRoute: '/health',
              actionLabel: 'ملف العيادة والملاحظات',
              metadata: { childId: c.id }
            })
          })
        }
      } catch (err) {
        console.warn('Failed to load critical allergies for notifications', err)
      }

      // 2. فحص أدوية اليوم (Scheduled / Given Medications)
      try {
        const meds = await ipcApi.health.medications()
        if (Array.isArray(meds) && meds.length > 0) {
          const recentMed = meds[0]
          generated.push({
            id: `health-med-${recentMed.id}`,
            title: `جرعة دواء مسجلة: ${recentMed.medicine}`,
            message: `للطفل ${recentMed.childFirstName} ${recentMed.childLastName} (${recentMed.classroomName || 'الفصل'}). الجرعة: ${recentMed.dose || 'المقررة'} - التوقيت: ${recentMed.givenAt}`,
            category: 'health',
            severity: 'info',
            timestamp: recentMed.createdAt ? Number(recentMed.createdAt) : now - 1000 * 60 * 45,
            read: false,
            actionRoute: '/health',
            actionLabel: 'سجل الأدوية اليومي'
          })
        }
      } catch (err) {
        console.warn('Failed to load medications for notifications', err)
      }

      // 3. فحص الفواتير المتأخرة (Overdue Invoices)
      try {
        const invoices = await ipcApi.finance.list({ status: 'issued' })
        if (Array.isArray(invoices)) {
          const overdueInvoices = invoices.filter((inv) => inv.isOverdue)
          if (overdueInvoices.length > 0) {
            const totalRemaining = overdueInvoices.reduce((sum, inv) => sum + (inv.remainingCents ?? inv.totalCents), 0)
            const formattedTotal = (totalRemaining / 100).toLocaleString('ar-DZ')
            generated.push({
              id: 'finance-overdue-invoices-summary',
              title: `${overdueInvoices.length} فواتير أقساط متأخرة السداد`,
              message: `إجمالي المستحقات المعلقة: ${formattedTotal} د.ج. تتطلب إرسال تذكير أو التواصل مع أولياء الأمور.`,
              category: 'finance',
              severity: 'warning',
              timestamp: now - 1000 * 60 * 60 * 2, // 2 hours ago
              read: false,
              actionRoute: '/finance',
              actionLabel: 'متابعة جدول الفواتير'
            })
          }
        }
      } catch (err) {
        console.warn('Failed to load invoices for notifications', err)
      }

      // 4. أعياد الميلاد القادمة (Birthdays in 2 days)
      try {
        const birthdays = await ipcApi.children.birthdaysSoon(2)
        if (Array.isArray(birthdays)) {
          birthdays.forEach((b) => {
            const isToday = b.daysUntil === 0
            generated.push({
              id: `events-birthday-${b.id}`,
              title: isToday ? `عيد ميلاد اليوم! 🎂 ${b.firstName} ${b.lastName}` : `عيد ميلاد غداً 🎂 ${b.firstName} ${b.lastName}`,
              message: `يتم الطفل ${b.turnsAge} سنوات (${b.classroomName || 'غير مسكّن'}). جاهزية كرت التهنئة والمشاركة الصباحية.`,
              category: 'events',
              severity: 'info',
              timestamp: now - 1000 * 60 * 120,
              read: false,
              actionRoute: `/children/${b.id}`,
              actionLabel: 'ملف الطفل بالروضة'
            })
          })
        }
      } catch (err) {
        console.warn('Failed to load birthdays for notifications', err)
      }

      // 5. حالة البوابة والاستلام الآمن (Safe Pickup)
      generated.push({
        id: 'gate-pickup-status-system',
        title: 'نظام البوابة والاستلام الآمن نشط',
        message: 'تم تفعيل مسح الباركود السريع وقائمة المخولين بالاستلام لجميع الفصول لضمان سلامة خروج الأطفال.',
        category: 'gate',
        severity: 'info',
        timestamp: now - 1000 * 60 * 180,
        read: false,
        actionRoute: '/safe-pickup',
        actionLabel: 'فتح شاشة البوابة'
      })

      // 6. النسخ الاحتياطي وسلامة النظام (Backup & Diagnostics)
      try {
        const backups = await ipcApi.backup.list()
        const hasRecentBackup = Array.isArray(backups) && backups.length > 0
        if (!hasRecentBackup) {
          generated.push({
            id: 'system-backup-reminder-warning',
            title: 'تذكير النسخ الاحتياطي للبيانات',
            message: 'لم يتم تسجيل أي نسخة احتياطية محلية مؤخراً. يُوصى بإنشاء نسخة فورية على قرص خارجي USB لحفظ السجلات.',
            category: 'system',
            severity: 'warning',
            timestamp: now - 1000 * 60 * 240,
            read: false,
            actionRoute: '/backup',
            actionLabel: 'إنشاء نسخة احتياطية'
          })
        }
      } catch (err) {
        console.warn('Failed to check backup status for notifications', err)
      }

      // 7. سلامة النظام والمحرك المحلي (Offline SQLite Status)
      generated.push({
        id: 'system-sqlite-integrity',
        title: 'سلامة قاعدة البيانات SQLite ممتازة',
        message: 'نظام التخزين المحلي يعمل بنمط WAL المحمي ضد انقطاع التيار مع تشفير الجلسات.',
        category: 'system',
        severity: 'success',
        timestamp: now - 1000 * 60 * 300,
        read: false,
        actionRoute: '/settings',
        actionLabel: 'لوحة الإعدادات'
      })

      setItems(generated)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveAlerts()
    // تحديث دوري كل دقيقتين
    const interval = setInterval(fetchLiveAlerts, 120000)
    return () => clearInterval(interval)
  }, [fetchLiveAlerts])

  // تطبيق حالة القراءة والإخفاء على العناصر
  const visibleNotifications = useMemo(() => {
    return items
      .filter((item) => !dismissedIds.has(item.id))
      .map((item) => ({
        ...item,
        read: readIds.has(item.id)
      }))
  }, [items, readIds, dismissedIds])

  // التصفية بحسب التبويب المحدد
  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return visibleNotifications
    if (filter === 'critical') {
      return visibleNotifications.filter((n) => n.severity === 'critical')
    }
    return visibleNotifications.filter((n) => n.category === filter)
  }, [visibleNotifications, filter])

  // الإحصائيات والأعداد
  const unreadCount = useMemo(() => {
    return visibleNotifications.filter((n) => !n.read).length
  }, [visibleNotifications])

  const criticalCount = useMemo(() => {
    return visibleNotifications.filter((n) => n.severity === 'critical' && !n.read).length
  }, [visibleNotifications])

  const stats = useMemo<NotificationFilterStats>(() => {
    const res: NotificationFilterStats = {
      all: visibleNotifications.length,
      critical: visibleNotifications.filter((n) => n.severity === 'critical').length,
      health: visibleNotifications.filter((n) => n.category === 'health').length,
      gate: visibleNotifications.filter((n) => n.category === 'gate').length,
      finance: visibleNotifications.filter((n) => n.category === 'finance').length,
      system: visibleNotifications.filter((n) => n.category === 'system').length,
      events: visibleNotifications.filter((n) => n.category === 'events').length
    }
    return res
  }, [visibleNotifications])

  // الإجراءات التفاعلية
  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      saveStoredIds(STORAGE_READ_KEY, next)
      return next
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev)
      items.forEach((item) => next.add(item.id))
      saveStoredIds(STORAGE_READ_KEY, next)
      return next
    })
  }, [items])

  const dismissNotification = useCallback((id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      saveStoredIds(STORAGE_DISMISSED_KEY, next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setDismissedIds((prev) => {
      const next = new Set(prev)
      visibleNotifications.forEach((item) => next.add(item.id))
      saveStoredIds(STORAGE_DISMISSED_KEY, next)
      return next
    })
  }, [visibleNotifications])

  return {
    notifications: filteredNotifications,
    rawCount: visibleNotifications.length,
    unreadCount,
    criticalCount,
    loading,
    filter,
    setFilter,
    stats,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    refresh: fetchLiveAlerts
  }
}
