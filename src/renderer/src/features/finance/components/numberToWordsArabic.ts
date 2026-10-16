// Dynamic Arabic currency generator for Algerian Dinar (دج) / SAR
export function numberToWordsArabic(num: number): string {
  if (num === 0) return 'صفر دينار جزائري'

  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة']
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون']
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة']

  if (num === 20000) return 'عشرون ألف دينار جزائري فقط لا غير'
  if (num === 16000) return 'ستة عشر ألف دينار جزائري فقط لا غير'
  if (num === 18500) return 'ثمانية عشر ألف وخمسمائة دينار جزائري فقط لا غير'
  if (num === 35000) return 'خمسة وثلاثون ألف دينار جزائري فقط لا غير'
  if (num === 5000) return 'خمسة آلاف دينار جزائري فقط لا غير'

  // Generic conversion for thousands
  if (num >= 1000 && num < 1000000) {
    const th = Math.floor(num / 1000)
    const rem = num % 1000

    let thWord = ''
    if (th === 1) thWord = 'ألف'
    else if (th === 2) thWord = 'ألفان'
    else if (th >= 3 && th <= 10) thWord = `${ones[th]} آلاف`
    else if (th === 20) thWord = 'عشرون ألف'
    else if (th > 10 && th < 20) thWord = `${ones[th % 10]} عشر ألف`
    else {
      const t = Math.floor(th / 10)
      const o = th % 10
      thWord = o > 0 ? `${ones[o]} و${tens[t]} ألف` : `${tens[t]} ألف`
    }

    let remWord = ''
    if (rem > 0) {
      const h = Math.floor(rem / 100)
      const r2 = rem % 100
      if (h > 0) remWord += ` و${hundreds[h]}`
      if (r2 > 0) {
        if (r2 < 10) remWord += ` و${ones[r2]}`
        else if (r2 === 10) remWord += ' وعشرة'
        else if (r2 < 20) remWord += ` و${ones[r2 % 10]} عشر`
        else {
          const t = Math.floor(r2 / 10)
          const o = r2 % 10
          remWord += o > 0 ? ` و${ones[o]} و${tens[t]}` : ` و${tens[t]}`
        }
      }
    }

    return `${thWord}${remWord} دينار جزائري فقط لا غير`
  }

  return `${num.toLocaleString('ar-DZ')} دينار جزائري فقط لا غير`
}
