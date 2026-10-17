import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ipc } from '@/lib/ipc'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onOpenQuickPayment?: () => void
  onOpenNewChild?: () => void
  onOpenNotifications?: () => void
}

export function CommandPalette({
  open,
  onClose,
  onOpenQuickPayment,
  onOpenNewChild,
  onOpenNotifications
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      return
    }

    const searchChildren = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const res = await ipc<any>('children:list', { search: query, limit: 10, offset: 0 })
        setResults(res?.items ?? [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchChildren, 150)
    return () => clearTimeout(timer)
  }, [query, open])

  if (!open) return null

  const handleSelectChild = (id: string) => {
    onClose()
    navigate(`/children/${id}`)
  }

  const quickNav = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 select-none animate-toast-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center mb-space-md border-b border-surface-container-high pb-space-sm">
          <span className="material-symbols-outlined text-primary text-2xl mr-1">
            search
          </span>
          <input
            autoFocus
            className="w-full h-12 pr-3 pl-12 rounded-xl bg-transparent text-on-surface font-headline-sm text-headline-sm focus:outline-none"
            placeholder="بحث فوري عن طفل، ولي أمر، صف، أو إجراء..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
            }}
          />
          <kbd className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption font-semibold">
            Esc
          </kbd>
        </div>

        {/* Quick Actions Shortcuts */}
        {!query && (
          <div className="space-y-space-sm">
            <span className="font-caption text-caption text-outline font-bold block mb-1">
              إجراءات سريعة واختصارات:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose()
                  onOpenQuickPayment?.() || navigate('/finance')
                }}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">payments</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">تسجيل دفعة نقدية</div>
                  <div className="font-caption text-caption text-on-surface-variant">اختصار: Ctrl+D</div>
                </div>
              </button>

              <button
                onClick={() => quickNav('/attendance')}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">checklist</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">وضع الفصول والحضور</div>
                  <div className="font-caption text-caption text-on-surface-variant">اختصار: Ctrl+A</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose()
                  onOpenNewChild?.() || navigate('/children')
                }}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">person_add</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">تسجيل طفل جديد</div>
                  <div className="font-caption text-caption text-on-surface-variant">اختصار: Ctrl+N</div>
                </div>
              </button>

              <button
                onClick={() => quickNav('/safe-pickup')}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">بوابة الاستلام الآمن</div>
                  <div className="font-caption text-caption text-on-surface-variant">التحقق بالباركود</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose()
                  onOpenNotifications?.()
                }}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">notifications_active</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">مركز التنبيهات والإشعارات</div>
                  <div className="font-caption text-caption text-on-surface-variant">اختصار: Ctrl+J</div>
                </div>
              </button>

              <button
                onClick={() => quickNav('/parents')}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">family_restroom</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">أولياء الأمور والتفويضات</div>
                  <div className="font-caption text-caption text-on-surface-variant">البطاقات وقناة SMS</div>
                </div>
              </button>

              <button
                onClick={() => quickNav('/timetable')}
                className="flex items-center gap-2.5 p-space-sm rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">schedule</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold">التوقيت والجدول اليومي</div>
                  <div className="font-caption text-caption text-on-surface-variant">الفترات والحصص والمناوبة</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Search Results */}
        {query && (
          <div className="max-h-80 overflow-y-auto space-y-1">
            {loading && (
              <div className="p-4 text-center text-on-surface-variant font-body-sm text-body-sm">
                جاري البحث محلياً في SQLite...
              </div>
            )}
            {!loading && results.length === 0 && (
              <div className="p-4 text-center text-on-surface-variant font-body-sm text-body-sm">
                لم يتم العثور على أطفال يطابقون "{query}"
              </div>
            )}
            {results.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectChild(c.id)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-primary-container hover:text-on-primary-container text-on-surface cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-primary">
                    {c.firstName?.[0] || 'ط'}
                  </div>
                  <div>
                    <div className="font-label-md text-label-md font-bold">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant">
                      الميلاد: {c.birthDate} • الحالة: {c.status}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
