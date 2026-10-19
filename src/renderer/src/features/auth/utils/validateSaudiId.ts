/**
 * Helper: Saudi National ID / Iqama Luhn checksum validation
 */
export function validateSaudiId(id: string): boolean {
  if (!/^[12]\d{9}$/.test(id)) return false
  let sum = 0
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(id.charAt(i), 10)
    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}
