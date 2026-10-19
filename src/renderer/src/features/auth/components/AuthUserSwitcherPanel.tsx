import React from 'react'
import { QuickUserCard } from './QuickUserCard'
import type { LocalUserSummary, StationTab } from '../types'

interface AuthUserSwitcherPanelProps {
  usersList: LocalUserSummary[]
  selectedUser: LocalUserSummary | null
  stationTab: StationTab
  isFirstRun: boolean
  onSelectUser: (user: LocalUserSummary) => void
  onSwitchToRegister: () => void
  onPromptCustomUser: () => void
}

export const AuthUserSwitcherPanel: React.FC<AuthUserSwitcherPanelProps> = ({
  usersList,
  selectedUser,
  stationTab,
  isFirstRun,
  onSelectUser,
  onSwitchToRegister,
  onPromptCustomUser
}) => {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
            <span className="font-bold text-label-lg">المستخدمون النشطون على هذا الجهاز</span>
          </div>
          <span className="font-caption text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-semibold">
            {usersList.length} حساب
          </span>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
          {usersList.length === 0 ? (
            <div className="p-4 text-center text-on-surface-variant text-body-sm bg-surface-container-low rounded-xl">
              لا توجد حسابات مسجلة بعد. استخدم نموذج إنشاء الحساب لبدء الاستخدام.
            </div>
          ) : (
            usersList.map((u) => (
              <QuickUserCard
                key={u.id || u.username}
                user={u}
                isSelected={stationTab === 'login' && selectedUser?.username === u.username}
                onSelect={onSelectUser}
              />
            ))
          )}
        </div>
      </div>

      {/* Quick Actions at Bottom of Users List */}
      <div className="pt-3 mt-3 border-t border-outline-variant/20 flex flex-col gap-2">
        {isFirstRun && (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-label-md transition-all ${
              stationTab === 'register'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>تهيئة حساب مدير النظام</span>
          </button>
        )}

        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
          <button
            type="button"
            onClick={onPromptCustomUser}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>دخول بحساب مخصص</span>
          </button>
          <span>
            <kbd className="bg-surface-container px-1 py-0.5 rounded">Esc</kbd> للتبديل
          </span>
        </div>
      </div>
    </div>
  )
}
