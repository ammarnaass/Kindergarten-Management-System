import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

// scrypt (متاح في Node) بدل argon2 لتفادي وحدة أصلية إضافية في v1
const KEYLEN = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEYLEN).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [algo, salt, hash] = stored.split(':')
    if (algo !== 'scrypt' || !salt || !hash) return false
    const derived = scryptSync(password, salt, KEYLEN)
    const expected = Buffer.from(hash, 'hex')
    return derived.length === expected.length && timingSafeEqual(derived, expected)
  } catch { return false }
}
