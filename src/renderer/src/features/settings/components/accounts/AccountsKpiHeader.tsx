import React from 'react'
import { Users, Shield, GraduationCap, Calculator } from 'lucide-react'
import type { DetailedUserItem } from '@/lib/api/types'

interface AccountsKpiHeaderProps {
  users: DetailedUserItem[]
}

export const AccountsKpiHeader: React.FC<AccountsKpiHeaderProps> = ({ users }) => {
  const totalUsers = users.length
  const adminCount = users.filter((u) => u.roleName === 'admin').length
  const teacherCount = users.filter((u) => u.roleName === 'educator').length
  const accountantCount = users.filter((u) => u.roleName === 'accountant').length
  const staffCount = users.filter((u) => u.roleName === 'staff').length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Accounts */}
      <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">إجمالي الحسابات</div>
          <div className="text-2xl font-black text-foreground">{totalUsers}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {users.filter((u) => u.isActive).length} حساب نشط
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Administrators */}
      <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">المدراء والمشرفون</div>
          <div className="text-2xl font-black text-foreground">{adminCount}</div>
          <div className="text-[11px] text-muted-foreground">صلاحيات إدارة كاملة</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
      </div>

      {/* Educators */}
      <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">المعلمات والمربيات</div>
          <div className="text-2xl font-black text-foreground">{teacherCount}</div>
          <div className="text-[11px] text-muted-foreground">الحضور والفصول واليوميات</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <GraduationCap className="w-6 h-6" />
        </div>
      </div>

      {/* Finance & Reception */}
      <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">المحاسبة والاستقبال</div>
          <div className="text-2xl font-black text-foreground">{accountantCount + staffCount}</div>
          <div className="text-[11px] text-muted-foreground">
            {accountantCount} محاسبة • {staffCount} استقبال
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
