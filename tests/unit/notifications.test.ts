import { describe, it, expect } from 'vitest'
import type { AppNotification, NotificationCategory, NotificationFilterStats } from '../../src/renderer/src/features/notifications/types'

describe('Notifications System Logic', () => {
  const mockNotifications: AppNotification[] = [
    {
      id: 'health-1',
      title: 'حساسية مفرطة حرجة',
      message: 'الطفل يعاني من حساسية شديدة للفول السوداني',
      category: 'health',
      severity: 'critical',
      timestamp: Date.now() - 1000,
      read: false,
      actionRoute: '/health'
    },
    {
      id: 'finance-1',
      title: 'فاتورة متأخرة',
      message: 'قسط شهري متأخر 5 أيام',
      category: 'finance',
      severity: 'warning',
      timestamp: Date.now() - 5000,
      read: true,
      actionRoute: '/finance'
    },
    {
      id: 'gate-1',
      title: 'بوابة الاستلام الآمن',
      message: 'نظام التحقق نشط',
      category: 'gate',
      severity: 'info',
      timestamp: Date.now() - 10000,
      read: false,
      actionRoute: '/safe-pickup'
    },
    {
      id: 'system-1',
      title: 'سلامة النظام',
      message: 'محرك SQLite محلي 100%',
      category: 'system',
      severity: 'success',
      timestamp: Date.now() - 20000,
      read: true,
      actionRoute: '/settings'
    }
  ]

  it('correctly calculates unread count and critical count', () => {
    const unreadCount = mockNotifications.filter((n) => !n.read).length
    const criticalCount = mockNotifications.filter((n) => n.severity === 'critical' && !n.read).length

    expect(unreadCount).toBe(2)
    expect(criticalCount).toBe(1)
  })

  it('filters notifications by category properly', () => {
    const filterByCategory = (category: NotificationCategory, items: AppNotification[]) => {
      if (category === 'all') return items
      if (category === 'critical') return items.filter((n) => n.severity === 'critical')
      return items.filter((n) => n.category === category)
    }

    expect(filterByCategory('all', mockNotifications)).toHaveLength(4)
    expect(filterByCategory('critical', mockNotifications)).toHaveLength(1)
    expect(filterByCategory('health', mockNotifications)).toHaveLength(1)
    expect(filterByCategory('finance', mockNotifications)).toHaveLength(1)
    expect(filterByCategory('gate', mockNotifications)).toHaveLength(1)
    expect(filterByCategory('events', mockNotifications)).toHaveLength(0)
  })

  it('computes correct category statistics for tabs', () => {
    const stats: NotificationFilterStats = {
      all: mockNotifications.length,
      critical: mockNotifications.filter((n) => n.severity === 'critical').length,
      health: mockNotifications.filter((n) => n.category === 'health').length,
      gate: mockNotifications.filter((n) => n.category === 'gate').length,
      finance: mockNotifications.filter((n) => n.category === 'finance').length,
      system: mockNotifications.filter((n) => n.category === 'system').length,
      events: mockNotifications.filter((n) => n.category === 'events').length
    }

    expect(stats.all).toBe(4)
    expect(stats.critical).toBe(1)
    expect(stats.health).toBe(1)
    expect(stats.finance).toBe(1)
    expect(stats.gate).toBe(1)
    expect(stats.system).toBe(1)
    expect(stats.events).toBe(0)
  })
})
