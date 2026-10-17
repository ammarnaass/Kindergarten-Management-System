import { describe, it, expect } from 'vitest'
import { userCreateSchema } from '../../src/shared/schemas/auth'

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
})
