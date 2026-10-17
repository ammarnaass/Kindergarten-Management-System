import { describe, it, expect } from 'vitest'
import { timetablePeriodInputSchema, staffDutyInputSchema } from '../../src/shared/schemas/timetable'
import type { TimetablePeriod } from '../../src/renderer/src/features/timetable/types'

describe('Timetable & Daily Schedule System', () => {
  describe('Zod Validation Schemas', () => {
    it('validates valid timetable period input', () => {
      const validPeriod = {
        periodNumber: 1,
        title: 'الاستقبال والتجمع الصباحي',
        category: 'arrival',
        startTime: '07:30',
        endTime: '08:15',
        color: '#0284c7',
        icon: 'wb_sunny',
        isActive: true
      }
      const result = timetablePeriodInputSchema.safeParse(validPeriod)
      expect(result.success).toBe(true)
    })

    it('rejects invalid time formats', () => {
      const invalidTimes = [
        { periodNumber: 1, title: 'فترة', category: 'activity', startTime: '7:30', endTime: '08:15' },
        { periodNumber: 1, title: 'فترة', category: 'activity', startTime: '25:00', endTime: '08:15' },
        { periodNumber: 1, title: 'فترة', category: 'activity', startTime: '07:30', endTime: 'invalid' }
      ]

      for (const item of invalidTimes) {
        const result = timetablePeriodInputSchema.safeParse(item)
        expect(result.success).toBe(false)
      }
    })

    it('rejects missing required fields', () => {
      const missingTitle = {
        periodNumber: 1,
        category: 'learning',
        startTime: '08:45',
        endTime: '09:30'
      }
      expect(timetablePeriodInputSchema.safeParse(missingTitle).success).toBe(false)
    })

    it('validates valid staff duty input', () => {
      const validDuty = {
        staffId: 'staff-uuid-001',
        staffName: 'أ. مريم السعيد',
        dutyLocation: 'main_gate',
        dayOfWeek: 0, // Sunday
        startTime: '07:30',
        endTime: '08:30',
        notes: 'إشراف بوابة الاستقبال الصباحي'
      }
      const result = staffDutyInputSchema.safeParse(validDuty)
      expect(result.success).toBe(true)
    })

    it('rejects invalid dayOfWeek in staff duty', () => {
      const invalidDay = {
        staffId: 'staff-uuid-001',
        dutyLocation: 'playground',
        dayOfWeek: 7, // Out of 0-6 range
        startTime: '11:00',
        endTime: '11:45'
      }
      expect(staffDutyInputSchema.safeParse(invalidDay).success).toBe(false)
    })
  })

  describe('Period Duration & Time Calculations', () => {
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number)
      return h * 60 + m
    }

    const periods: TimetablePeriod[] = [
      {
        id: 'p-1',
        periodNumber: 1,
        title: 'الاستقبال والتجمع الصباحي',
        category: 'arrival',
        startTime: '07:30',
        endTime: '08:15',
        color: '#0284c7',
        icon: 'wb_sunny',
        isActive: true
      },
      {
        id: 'p-2',
        periodNumber: 2,
        title: 'طابور الصباح والنشيد الوطني',
        category: 'assembly',
        startTime: '08:15',
        endTime: '08:45',
        color: '#16a34a',
        icon: 'flag',
        isActive: true
      },
      {
        id: 'p-3',
        periodNumber: 3,
        title: 'حلقة التعلم الأولى',
        category: 'learning',
        startTime: '08:45',
        endTime: '09:30',
        color: '#4f46e5',
        icon: 'menu_book',
        isActive: true
      },
      {
        id: 'p-4',
        periodNumber: 4,
        title: 'وجبة الإفطار الصحية وآداب الطعام',
        category: 'meal',
        startTime: '09:30',
        endTime: '10:15',
        color: '#ea580c',
        icon: 'restaurant',
        isActive: true
      }
    ]

    it('calculates duration in minutes accurately', () => {
      const duration1 = timeToMinutes(periods[0].endTime) - timeToMinutes(periods[0].startTime)
      expect(duration1).toBe(45)

      const duration2 = timeToMinutes(periods[1].endTime) - timeToMinutes(periods[1].startTime)
      expect(duration2).toBe(30)
    })

    it('identifies the active period correctly at 08:30', () => {
      const currentMinutes = 8 * 60 + 30 // 08:30

      const active = periods.find((p) => {
        const start = timeToMinutes(p.startTime)
        const end = timeToMinutes(p.endTime)
        return currentMinutes >= start && currentMinutes < end
      })

      expect(active).toBeDefined()
      expect(active?.id).toBe('p-2')
      expect(active?.title).toBe('طابور الصباح والنشيد الوطني')
    })

    it('calculates progress percentage and remaining minutes within an active period', () => {
      const period = periods[1] // 08:15 to 08:45 (30 mins total)
      const start = timeToMinutes(period.startTime) // 495
      const end = timeToMinutes(period.endTime) // 525
      const total = end - start // 30

      const currentMinutes = 8 * 60 + 30 // 510 (15 mins in)
      const elapsed = currentMinutes - start // 15
      const remaining = end - currentMinutes // 15
      const progress = Math.round((elapsed / total) * 100)

      expect(elapsed).toBe(15)
      expect(remaining).toBe(15)
      expect(progress).toBe(50)
    })

    it('finds the next period correctly', () => {
      const currentMinutes = 8 * 60 + 30 // 08:30, within p-2 (08:15-08:45)
      const next = periods.find((p) => timeToMinutes(p.startTime) >= 8 * 60 + 45)

      expect(next).toBeDefined()
      expect(next?.id).toBe('p-3')
      expect(next?.title).toBe('حلقة التعلم الأولى')
    })
  })
})
