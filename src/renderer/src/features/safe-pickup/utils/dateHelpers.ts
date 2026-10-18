export function getTodayString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatTime(timestamp?: number | string | null): string {
  if (!timestamp) return ''
  try {
    const d = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export function getAgeString(birthDateStr?: string): string {
  if (!birthDateStr) return ''
  try {
    const birth = new Date(birthDateStr)
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--
      months += 12
    }
    if (years <= 0) return `${months} أشهر`
    if (months === 0) return `${years} سنوات`
    return `${years} سنوات و ${months} أشهر`
  } catch {
    return ''
  }
}
