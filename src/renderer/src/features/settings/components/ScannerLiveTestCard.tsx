import { useState, useEffect, KeyboardEvent } from 'react'
import { api, type ChildItem } from '@/lib/api'

interface ScannerLiveTestCardProps {
  scannedCodeFeedback: string | null
  onScanCode: (code: string) => void
}

export function ScannerLiveTestCard({
  scannedCodeFeedback,
  onScanCode
}: ScannerLiveTestCardProps) {
  const [testInput, setTestInput] = useState('')
  const [matchedChild, setMatchedChild] = useState<ChildItem | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchAttempted, setSearchAttempted] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (testInput.trim()) {
        onScanCode(testInput.trim())
        setTestInput('')
      }
    }
  }

  // Live lookup in SQLite database when a code is received
  useEffect(() => {
    if (!scannedCodeFeedback) return

    let isMounted = true
    setIsSearching(true)
    setSearchAttempted(true)

    // Search children by ID or national identifier or search
    api.children
      .list({ search: scannedCodeFeedback, limit: 1 })
      .then((res) => {
        if (!isMounted) return
        if (res && res.items && res.items.length > 0) {
          setMatchedChild(res.items[0])
        } else {
          setMatchedChild(null)
        }
      })
      .catch(() => {
        if (isMounted) setMatchedChild(null)
      })
      .finally(() => {
        if (isMounted) setIsSearching(false)
      })

    return () => {
      isMounted = false
    }
  }, [scannedCodeFeedback])

  return (
    <div className="lg:col-span-5 flex flex-col gap-space-md">
      {/* Live Scanner Test Playground */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col border border-surface-variant/40">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-bold text-on-surface">
            منصة اختبار مسح الباركود الحقيقي (Live Input Test)
          </span>
          <span className="material-symbols-outlined text-secondary text-[20px]">
            sensors
          </span>
        </div>

        <p className="font-caption text-caption text-on-surface-variant mb-space-sm">
          قم بتوجيه قارئ الباركود/QR أو إدخال كود الطالب للتأكد من وصول إشارة القراءة ومطابقتها مع قاعدة بيانات الروضة:
        </p>

        <div className="relative mb-space-md">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="مرر كود الطالب أو بطاقة ولي الأمر (واضغط Enter)..."
            className="w-full pr-10 pl-3 py-3 bg-surface-container-low rounded-xl text-on-surface font-mono text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-transparent focus:border-primary/20"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary text-[20px]">
            barcode_scanner
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm border border-surface-variant/30">
          {scannedCodeFeedback ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-md text-label-md font-bold text-on-surface">
                  تم استلام الكود:{' '}
                  <span className="font-mono text-primary font-bold">{scannedCodeFeedback}</span>
                </div>
                <div className="font-caption text-caption text-outline">
                  استجابة فورية عبر منفذ لوحة المفاتيح الافتراضي (USB HID)
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              </div>
              <div>
                <div className="font-label-md text-label-md font-semibold text-on-surface">
                  بانتظار إشارة القارئ أو الإدخال...
                </div>
                <div className="font-caption text-caption text-outline">
                  القارئ السلكي/اللاسلكي يعمل بنظام Keyboard Wedge المباشر
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-space-md pt-space-sm border-t border-surface-variant flex items-center justify-between text-outline font-caption text-caption">
          <span>نظام التشفير: Base64 / Code128</span>
          <span>المطابقة: مباشرة مع SQLite</span>
        </div>
      </div>

      {/* Real Live Database Identification Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs flex items-center gap-space-md border border-surface-variant/40">
        {isSearching ? (
          <div className="p-4 flex items-center gap-2 text-on-surface-variant text-body-sm w-full justify-center">
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>جاري مطابقة الرمز في قاعدة البيانات...</span>
          </div>
        ) : matchedChild ? (
          <>
            <div className="w-16 h-16 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-2xl shrink-0 border border-primary/20 shadow-xs">
              {matchedChild.firstName.charAt(0)}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                طالب مسجل في النظام
              </span>
              <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                {matchedChild.firstName} {matchedChild.lastName}
              </span>
              <span className="font-caption text-caption text-outline">
                الحالة: {matchedChild.status === 'active' ? 'نشط ومسجل' : matchedChild.status} • الكود: {matchedChild.id.slice(0, 8)}
              </span>
            </div>
          </>
        ) : searchAttempted ? (
          <div className="flex items-center gap-space-md w-full">
            <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">person_off</span>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-label-sm text-label-sm text-error font-bold">
                لم يتم العثور على طالب
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                الكود المستلم غير مقترن بأي طفل مسجل في قاعدة البيانات
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-space-md text-on-surface-variant py-2">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-outline text-[22px]">badge</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                نتائج التحقق الفوري من الطلاب
              </span>
              <span className="font-caption text-caption text-outline">
                مرر بطاقة طالب لمعاينة بياناته الحقيقية من السجل المحلي
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
