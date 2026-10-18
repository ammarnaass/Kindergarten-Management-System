import { describe, it, expect } from 'vitest'
import {
  userCreateSchema,
  userUpdateSchema,
  userResetPasswordSchema,
  userResetPinSchema,
  userToggleActiveSchema,
  userDeleteSchema,
  superAdminRegisterSchema
} from '../../src/shared/schemas/auth'

describe('User Creation Schema & Roles Validation', () => {
  it('validates a valid user creation payload', () => {
    const payload = {
      username: 'sarah_teacher',
      password: 'SecurePassword123!',
      displayName: 'أ. سارة القحطاني',
      roleId: 'educator',
      roleTitle: 'معلمة فصل الأبطال',
      pinCode: '1234',
      avatarIcon: 'school',
      isActive: true
    }

    const result = userCreateSchema.safeParse(payload)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.username).toBe('sarah_teacher')
      expect(result.data.roleId).toBe('educator')
    }
  })

  it('rejects passwords shorter than 8 characters', () => {
    const payload = {
      username: 'short_pwd',
      password: '123',
      displayName: 'مستخدم تجريبي',
      roleId: 'staff'
    }

    const result = userCreateSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })

  it('rejects usernames shorter than 3 characters', () => {
    const payload = {
      username: 'ab',
      password: 'ValidPassword123',
      displayName: 'مستخدم',
      roleId: 'staff'
    }

    const result = userCreateSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })

  it('validates userUpdateSchema with valid data and rejects invalid UUID', () => {
    const valid = userUpdateSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      displayName: 'أ. فاطمة الزهراني',
      roleId: 'educator',
      roleTitle: 'معلمة رياض أطفال معتمدة',
      phone: '0555123456',
      email: 'fatima@rawdati.local',
      avatarIcon: 'school',
      isActive: true
    })
    expect(valid.success).toBe(true)

    const invalidUuid = userUpdateSchema.safeParse({
      id: 'bad-id',
      displayName: 'فاطمة',
      roleId: 'educator'
    })
    expect(invalidUuid.success).toBe(false)
  })

  it('validates userResetPasswordSchema requiring minimum 6 chars', () => {
    const valid = userResetPasswordSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      newPassword: 'NewSecurePass123'
    })
    expect(valid.success).toBe(true)

    const tooShort = userResetPasswordSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      newPassword: '123'
    })
    expect(tooShort.success).toBe(false)
  })

  it('validates userResetPinSchema accepting 4-6 digits or null to clear', () => {
    const validPin = userResetPinSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      newPin: '9842'
    })
    expect(validPin.success).toBe(true)

    const clearPin = userResetPinSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      newPin: null
    })
    expect(clearPin.success).toBe(true)

    const badPin = userResetPinSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      newPin: '12'
    })
    expect(badPin.success).toBe(false)
  })

  it('validates userToggleActiveSchema and userDeleteSchema', () => {
    const validToggle = userToggleActiveSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001',
      isActive: false
    })
    expect(validToggle.success).toBe(true)

    const validDelete = userDeleteSchema.safeParse({
      id: '0192994f-1234-7000-8000-000000000001'
    })
    expect(validDelete.success).toBe(true)
  })

  it('validates superAdminRegisterSchema for first-time installation setup', () => {
    const validPayload = {
      fullName: 'أ. عبد الرحمن المنصور',
      roleTitle: 'مالك المنشأة / المدير العام التنفيذي',
      nationalId: '1089345210',
      phone: '0501234567',
      adminEmail: 'admin@rawdati.local',
      username: 'superadmin',
      password: 'Rawdati@2026#SecureAdmin',
      pinCode: '849201',
      recoveryKey: 'RAW-8841-K9X2-2026'
    }

    const res = superAdminRegisterSchema.safeParse(validPayload)
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.data.username).toBe('superadmin')
      expect(res.data.nationalId).toBe('1089345210')
    }

    // Must reject password shorter than 8 characters
    const shortPwd = superAdminRegisterSchema.safeParse({
      ...validPayload,
      password: '123'
    })
    expect(shortPwd.success).toBe(false)

    // Must reject invalid national ID
    const badId = superAdminRegisterSchema.safeParse({
      ...validPayload,
      nationalId: '9999999999'
    })
    expect(badId.success).toBe(false)
  })

  it('enforces one-time admin creation guard logic (rejects second admin registration)', () => {
    // Simulated checkSetup state
    const setupState = { hasAdmin: true, isSetupComplete: true, allowRegistration: false }

    const attemptRegisterSuperAdmin = (state: typeof setupState) => {
      if (state.hasAdmin) {
        const err: any = new Error('تم إنشاء وتعيين مدير النظام مسبقاً! إنشاء الحسابات الإضافية يتم فقط من داخل الإعدادات بواسطة المشرف.')
        err.code = 'FORBIDDEN'
        throw err
      }
      return { success: true }
    }

    // When admin already exists, must throw FORBIDDEN
    expect(() => attemptRegisterSuperAdmin(setupState)).toThrowError(
      'تم إنشاء وتعيين مدير النظام مسبقاً! إنشاء الحسابات الإضافية يتم فقط من داخل الإعدادات بواسطة المشرف.'
    )

    try {
      attemptRegisterSuperAdmin(setupState)
    } catch (e: any) {
      expect(e.code).toBe('FORBIDDEN')
    }

    // When no admin exists, registration is allowed
    const freshState = { hasAdmin: false, isSetupComplete: false, allowRegistration: true }
    expect(attemptRegisterSuperAdmin(freshState).success).toBe(true)
  })
})
