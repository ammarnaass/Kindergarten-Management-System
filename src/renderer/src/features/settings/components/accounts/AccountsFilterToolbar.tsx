import React from 'react'
import { Search, UserPlus, RefreshCw, Filter } from 'lucide-react'
import type { AccountsFilterState, UserRoleFilter, UserStatusFilter } from './types'

interface AccountsFilterToolbarProps {
  filters: AccountsFilterState
  setFilters: React.Dispatch<React.SetStateAction<AccountsFilterState>>
  onAddNew: () => void
  onRefresh: () => void
  isLoading: boolean
}

export const AccountsFilterToolbar: React.FC<AccountsFilterToolbarProps> = ({
  filters,
  setFilters,
  onAddNew,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/60 border border-border p-3.5 rounded-2xl">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="بحث بالاسم أو اسم الدخول..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Filter Dropdowns and Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto">
        {/* Role Filter */}
        <select
          value={filters.role}
          onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value as UserRoleFilter }))}
          className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">كافة الأدوار الوظيفية</option>
          <option value="admin">مدير النظام (Admin)</option>
          <option value="educator">معلمة (Educator)</option>
          <option value="accountant">محاسب (Accountant)</option>
          <option value="staff">كادر واستقبال (Staff)</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as UserStatusFilter }))}
          className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">كافة الحالات</option>
          <option value="active">الحسابات النشطة فقط</option>
          <option value="inactive">الحسابات المعطلة</option>
        </select>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title="تحديث القائمة"
          className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Add User Button */}
        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 transition-all whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>مستخدم جديد</span>
        </button>
      </div>
    </div>
  )
}
