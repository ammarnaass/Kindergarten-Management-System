import React from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

interface AuthStationTopBarProps {
  onOpenHelp: () => void
}

export const AuthStationTopBar: React.FC<AuthStationTopBarProps> = ({ onOpenHelp }) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-full bg-surface-container-low px-4 py-2 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-primary font-bold text-headline-sm">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            security
          </span>
          <span>محطة الدخول والتسجيل المكتبي الموحد</span>
        </div>

        <span className="h-4 w-px bg-outline-variant/50 hidden sm:inline-block" />

        <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-full text-on-surface shadow-xs border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-label-sm font-semibold">SQLite 3.44 WAL</span>
          <span className="text-caption text-on-surface-variant">(AES-256 محلي)</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">wifi_off</span>
          <span>100% دون إنترنت — معالجة مشفرة</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="تبديل المظهر (داكن / فاتح)"
          className="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Help Button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container px-3 py-1 rounded-lg text-on-surface font-label-md text-label-md border border-outline-variant/30 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">help</span>
          <span>المساعدة</span>
          <kbd className="bg-surface-container-high text-on-surface-variant font-mono text-[10px] px-1 py-0.5 rounded">
            F1
          </kbd>
        </button>
      </div>
    </div>
  )
}
