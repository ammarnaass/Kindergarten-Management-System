import React from 'react'

interface AuthStationFooterProps {
  dbPath: string
  onOpenEmergency: () => void
}

export const AuthStationFooter: React.FC<AuthStationFooterProps> = ({ dbPath, onOpenEmergency }) => {
  return (
    <footer className="w-full bg-surface-container-high px-4 py-2 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant font-label-sm text-label-sm shadow-xs">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface">
          <span className="material-symbols-outlined text-[16px] text-primary">database</span>
          <span className="text-on-surface-variant">الملف المحلي:</span>
          <span
            className="bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/20 max-w-xs truncate"
            title={dbPath || 'قاعدة البيانات المحلية'}
          >
            {dbPath ? dbPath.split(/[/\\]/).pop() || dbPath : 'قاعدة البيانات المحلية النشطة'}
          </span>
        </div>

        <span className="h-3 w-px bg-outline-variant/50 hidden md:inline-block" />

        <div className="flex items-center gap-1.5 text-on-surface">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>قاعدة البيانات متصلة وسليمة</span>
          <span className="bg-secondary-container text-on-secondary-container text-[10px] px-1.5 py-0.2 rounded font-bold">
            100% محلي دون إنترنت
          </span>
        </div>
      </div>

      {/* Shortcuts & Emergency Button */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="hidden lg:flex items-center gap-2 text-caption text-on-surface-variant">
          <span>اختصارات:</span>
          <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
            <kbd>Enter</kbd> دخول
          </span>
          <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
            <kbd>Esc</kbd> تبديل
          </span>
          <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
            <kbd>F12</kbd> صيانة
          </span>
          <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
            <kbd>F1</kbd> مساعدة
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenEmergency}
          className="flex items-center gap-1 text-tertiary hover:bg-tertiary-container/30 px-2.5 py-1 rounded-lg transition-colors font-semibold text-label-sm border border-tertiary/20"
        >
          <span className="material-symbols-outlined text-[16px]">build_circle</span>
          <span>وضع الطوارئ والصيانة (F12)</span>
        </button>
      </div>
    </footer>
  )
}
