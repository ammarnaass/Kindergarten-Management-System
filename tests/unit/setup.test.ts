import { describe, it, expect } from 'vitest'
import { setupPayloadSchema } from '../../src/shared/schemas/setup'

describe('Setup Payload Schema Validation', () => {
  it('validates a complete and correct setup payload', () => {
    const payload = {
      branch: {
        name: 'روضة نماء النموذجية',
        licenseNumber: 'LIC-2026-9901',
        city: 'جدة',
        phone: '0555112233',
        email: 'info@namaa.edu.sa',
        academicYear: '2024-2025',
        currency: 'SAR',
        timeFormat: '12h'
      },
      admin: {
        username: 'superadmin',
        displayName: 'د. ليلى الشريف',
        password: 'AdminPassword2026!',
        pin: '8841',
        recoveryKey: 'RAW-8841-K9X2-2026'
      },
      classrooms: [
        { name: 'فصل البراعم', room: 'قاعة 101', capacity: 15 },
        { name: 'فصل الفراشات', room: 'قاعة 102', capacity: 18 }
      ],
      printers: {
        documentPrinter: 'Canon LBP6030',
        receiptPrinter: 'Epson TM-T20III',
        cardPrinter: ''
      }
    }

    const result = setupPayloadSchema.safeParse(payload)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.branch.name).toBe('روضة نماء النموذجية')
      expect(result.data.admin.username).toBe('superadmin')
      expect(result.data.classrooms).toHaveLength(2)
    }
  })

  it('rejects payload with missing branch name', () => {
    const payload = {
      branch: {
        name: '',
        city: 'الرياض'
      },
      admin: {
        username: 'admin',
        displayName: 'المدير',
        password: 'password',
        pin: '1234',
        recoveryKey: 'RAW-1234-ABCD-2026'
      },
      classrooms: [{ name: 'فصل', room: '1', capacity: 10 }]
    }

    const result = setupPayloadSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })

  it('rejects payload with empty classrooms list', () => {
    const payload = {
      branch: {
        name: 'روضة الأجيال'
      },
      admin: {
        username: 'admin',
        displayName: 'المدير',
        password: 'password',
        pin: '1234',
        recoveryKey: 'RAW-1234-ABCD-2026'
      },
      classrooms: []
    }

    const result = setupPayloadSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })

  it('rejects payload with short password or PIN', () => {
    const payload = {
      branch: {
        name: 'روضة الأجيال'
      },
      admin: {
        username: 'admin',
        displayName: 'المدير',
        password: '12',
        pin: '12',
        recoveryKey: 'RAW-1234-ABCD-2026'
      },
      classrooms: [{ name: 'فصل 1', room: '1', capacity: 15 }]
    }

    const result = setupPayloadSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })
})
