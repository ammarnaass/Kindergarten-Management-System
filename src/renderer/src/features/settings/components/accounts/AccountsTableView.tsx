import React from 'react'
import {
  Shield,
  School,
  Badge,
  Calculator,
  User,
  KeyRound,
  Lock,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react'
import type { DetailedUserItem } from '@/lib/api/types'

interface AccountsTableViewProps {
  users: DetailedUserItem[]
  onEdit: (user: DetailedUserItem) => void
  onResetPassword: (user: DetailedUserItem) => void
  onResetPin: (user: DetailedUserItem) => void
  onToggleActive: (id: string, currentStatus: boolean) => void
  onDelete: (id: string, username: string) => void
}

const ROLE_CONFIG: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  admin: {
    label: 'مدير النظام',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: Shield
  },
  educator: {
    label: 'معلمة / مربية',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    icon: School
  },
  accountant: {
    label: 'محاسب مالي',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: Calculator
  },
  staff: {
    label: 'استقبال وكادر',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: Badge
  }
}

export const AccountsTableView: React.FC<AccountsTableViewProps> = ({
  users,
  onEdit,
  onResetPassword,
  onResetPin,
  onToggleActive,
  onDelete
}) => {
  if (users.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40">
        <User className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h4 className="text-sm font-bold text-foreground">لم يتم العثور على أي حسابات مطابقة</h4>
        <p className="text-xs text-muted-foreground mt-1">
          جرب تغيير معايير البحث أو تصفية الأدوار والحالة أعلاه.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-2xl bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[760px] text-right text-xs">
          <thead>
            <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <th className="py-3 px-4">المستخدم</th>
              <th className="py-3 px-4">الدور والصلاحيات</th>
              <th className="py-3 px-4">رمز PIN السريع</th>
              <th className="py-3 px-4">بيانات التواصل</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4">آخر دخول</th>
              <th className="py-3 px-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => {
              const roleCfg = ROLE_CONFIG[u.roleName] || ROLE_CONFIG.staff
              const RoleIcon = roleCfg.icon

              return (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  {/* User Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {u.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                          <span>{u.displayName}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          @{u.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${roleCfg.badgeClass}`}
                      >
                        <RoleIcon className="w-3.5 h-3.5" />
                        <span>{roleCfg.label}</span>
                      </span>
                      {u.roleTitle && (
                        <div className="text-[10px] text-muted-foreground max-w-[160px] truncate">
                          {u.roleTitle}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* PIN Status */}
                  <td className="py-3.5 px-4">
                    {u.hasPin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                        <KeyRound className="w-3 h-3" />
                        <span>•••• مُفعل</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">غير مفعل</span>
                    )}
                  </td>

                  {/* Contacts */}
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] space-y-0.5">
                      <div className="font-mono text-foreground">{u.phone || '—'}</div>
                      <div className="text-muted-foreground truncate max-w-[150px]">{u.email || '—'}</div>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleActive(u.id, u.isActive)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        u.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {u.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{u.isActive ? 'نشط' : 'معطل'}</span>
                    </button>
                  </td>

                  {/* Last Login */}
                  <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('ar-SA', { dateStyle: 'short' }) : 'لم يسجل بعد'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        title="تعديل الحساب"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onResetPassword(u)}
                        title="تغيير كلمة المرور"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onResetPin(u)}
                        title="تعديل رمز PIN"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(u.id, u.username)}
                        title="حذف الحساب"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
