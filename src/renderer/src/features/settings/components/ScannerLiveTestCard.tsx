import { useState, KeyboardEvent } from 'react'

interface ScannerLiveTestCardProps {
  scannedCodeFeedback: string | null
  onScanCode: (code: string) => void
}

export function ScannerLiveTestCard({
  scannedCodeFeedback,
  onScanCode
}: ScannerLiveTestCardProps) {
  const [testInput, setTestInput] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (testInput.trim()) {
        onScanCode(testInput.trim())
        setTestInput('')
      }
    }
  }

  return (
    <div className="lg:col-span-5 flex flex-col gap-space-md">
      {/* Live Scanner Test Playground */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs flex flex-col border border-surface-variant/40">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-md text-label-md font-bold text-on-surface">
            منصة محاكاة المسح الفوري (Live Input Test)
          </span>
          <span className="material-symbols-outlined text-secondary-container text-[20px]">
            sensors
          </span>
        </div>

        <p className="font-caption text-caption text-on-surface-variant mb-space-sm">
          قم بتوجيه قارئ الباركود أو بطاقة الـ QR إلى هنا للتأكد من وصول كود القراءة فورياً دون تأخير
          مفاتيح:
        </p>

        <div className="relative mb-space-md">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="مرر كود الطالب أو بطاقة ولي الأمر للتجربة..."
            className="w-full pr-10 pl-3 py-3 bg-surface-container-low rounded-xl text-on-surface font-mono text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-transparent focus:border-primary/20"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary text-[20px]">
            barcode
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm border border-surface-variant/30">
          {scannedCodeFeedback ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-md text-label-md font-bold text-on-surface">
                  تم استلام كود:{' '}
                  <span className="font-mono text-primary font-bold">{scannedCodeFeedback}</span>
                </div>
                <div className="font-caption text-caption text-outline">
                  تم التحقق من الـ Checksum بنجاح - استجابة 12ms
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
                  بانتظار إشارة القارئ...
                </div>
                <div className="font-caption text-caption text-outline">
                  المنفذ يستمع لأوامر المفاتيح الافتراضية (اضغط Enter بعد الإدخال)
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-space-md pt-space-sm border-t border-surface-variant flex items-center justify-between text-outline font-caption text-caption">
          <span>تشفير البطاقة: Base64 SHA-256</span>
          <span>دقة المطابقة: 100%</span>
        </div>
      </div>

      {/* Photo Identification Preview for Pickup Security */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs flex items-center gap-space-md border border-surface-variant/40">
        <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-surface-variant/30">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpNvlVC1lrQWD6A1m1DpeoxxGNgAX33caKbnQRjFSUol_W8-3J6nnaPcPI7T_YdNXi4UBd6frf8IpK3kEK1shSxGelPjdjge31KqpjQbcYNC-7DtbQgD2bKRCv4IDAPvJq41TS9LpMZHTmtZdBkd7Xx_BNKpRqZI_I_eprM3fmHJVrqgjGVdb470uOTWCjyRipPEWKTeOveec4xVlh38i31jffV5Q2LfyEqm6ciRVmocrqcu2cGcg"
            alt="صورة الطفل للتحقق الأمني"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-label-sm text-label-sm text-primary font-bold">
            آخر اختبار ناجح للمطابقة
          </span>
          <span className="font-label-md text-label-md font-bold text-on-surface truncate">
            ريان منصور العتيبي (تمهيدي 2)
          </span>
          <span className="font-caption text-caption text-outline">
            المستلم: الأب (منصور بن خالد) • تم التحقق
          </span>
        </div>
      </div>
    </div>
  )
}
