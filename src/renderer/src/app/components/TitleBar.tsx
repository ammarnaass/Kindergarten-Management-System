import { ipc } from '@/lib/ipc'
import { AppLogo } from './AppLogo'

interface TitleBarProps {
  appName?: string
}

export function TitleBar({ appName = 'روضتي — نظام إدارة الروضة المكتبي (الإصدار 2.0)' }: TitleBarProps) {
  const handleMinimize = () => {
    // In Electron, minimize window
    try {
      window.close?.()
    } catch {}
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-[38px] bg-surface-container-high text-on-surface-variant z-50 flex items-center justify-between px-space-md shadow-[0_1px_4px_rgba(0,0,0,0.03)] select-none">
      <div className="flex items-center gap-space-sm">
        <AppLogo size="xs" iconOnly />
        <span className="font-label-sm text-label-sm font-semibold tracking-wide text-on-surface">
          {appName}
        </span>
        <span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-caption text-caption">
          غير متصل بالسحاب • محلي 100%
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleMinimize}
          className="w-7 h-6 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant transition-colors"
          title="تصغير (Minimize)"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">minimize</span>
        </button>
        <button
          className="w-7 h-6 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant transition-colors"
          title="تكبير / استعادة (Maximize)"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">crop_square</span>
        </button>
        <button
          className="w-7 h-6 rounded flex items-center justify-center hover:bg-error hover:text-on-error text-on-surface-variant transition-colors"
          title="إغلاق البرنامج (Close)"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  )
}
