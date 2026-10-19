export function generateRecoveryKey(): string {
  const segment1 = Math.floor(1000 + Math.random() * 9000)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let segment2 = ''
  for (let i = 0; i < 4; i++) {
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `RAW-${segment1}-${segment2}-${new Date().getFullYear()}`
}
