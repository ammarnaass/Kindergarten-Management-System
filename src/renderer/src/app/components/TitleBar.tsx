import { useState, useEffect } from 'react'
import { ipc } from '@/lib/ipc'
import { AppLogo } from './AppLogo'

interface TitleBarProps {
  appName?: string
}

export function TitleBar({ appName = 'روضتي — نظام إدارة الروضة المكتبي' }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    ipc<boolean>('window:isMaximized')
      .then((val) => {
        if (typeof val === 'boolean') setIsMaximized(val)
      })
      .catch(() => {})
  }, [])

  const handleMinimize = async () => {
    try {
      await ipc('window:minimize')
    } catch {}
  }

  const handleToggleMaximize = async () => {
    try {
      const res = await ipc<boolean>('window:maximize')
      setIsMaximized(Boolean(res))
    } catch {}
  }

  const handleClose = async () => {
    try {
      await ipc('window:close')
    } catch {}
  }

  return (
    <div
      onDoubleClick={handleToggleMaximize}
      style={{ WebkitAppRegion: 'drag' } as any}
      className="fixed top-0 left-0 right-0 h-[38px] bg-surface-container-high/95 backdrop-blur-md text-on-surface-variant z-50 flex items-center justify-between px-space-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] select-none border-b border-outline-variant/30"
    >
      {/* 1. Right side: Brand Icon, Name & Offline Telemetry */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as any}
        className="flex items-center gap-space-sm"
      >
        <AppLogo size="xs" iconOnly />
        <div className="flex items-center gap-1.5">
          <span className="font-label-sm text-label-sm font-bold text-on-surface tracking-wide">
            {appName}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-primary-container/20 text-primary font-caption text-[11px] font-bold">
            2026/2027
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-caption text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>نظام محلي 100% • دون اتصال</span>
          </span>
        </div>
      </div>

      {/* 2. Left side: Native-Styled Window Controls */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as any}
        className="flex items-stretch h-full -ml-space-md"
      >
        <button
          onClick={handleMinimize}
          className="w-11 h-full flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
          title="تصغير (Minimize)"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>

        <button
          onClick={handleToggleMaximize}
          className="w-11 h-full flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
          title={isMaximized ? 'استعادة الحجم (Restore)' : 'تكبير النافذة (Maximize)'}
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">
            {isMaximized ? 'filter_none' : 'crop_square'}
          </span>
        </button>

        <button
          onClick={handleClose}
          className="w-11 h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white text-on-surface-variant transition-colors group"
          title="إغلاق البرنامج (Close)"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
            close
          </span>
        </button>
      </div>
    </div>
  )
}
