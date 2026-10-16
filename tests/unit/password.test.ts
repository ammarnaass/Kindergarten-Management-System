import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../src/main/security/password'

describe('password (scrypt)', () => {
  it('hashes and verifies', () => {
    const h = hashPassword('admin123')
    expect(verifyPassword('admin123', h)).toBe(true)
    expect(verifyPassword('wrong', h)).toBe(false)
  })
})
