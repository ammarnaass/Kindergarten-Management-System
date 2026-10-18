import React from 'react'
import type { StaffMember } from '../types'

interface StaffDirectoryCardProps {
  staff: StaffMember
  onEdit: (staff: StaffMember) => void
  onToggleActive: (staff: StaffMember) => void
  onOpenCard: (staff: StaffMember) => void
}

export const StaffDirectoryCard: React.FC<StaffDirectoryCardProps> = ({
  staff,
  onEdit,
  onToggleActive,
  onOpenCard
}) => {
  return (
    <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between gap-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shadow-xs">
            {staff.firstName.charAt(0)}.{staff.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-label-lg leading-tight">
              {staff.firstName} {staff.lastName}
            </h3>
            <span className="inline-block px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container text-caption font-semibold mt-1">
              {staff.role}
            </span>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            staff.isActive
              ? 'bg-primary/10 text-primary'
              : 'bg-surface-container-highest text-on-surface-variant'
          }`}
        >
          {staff.isActive ? 'على رأس العمل' : 'متوقف'}
        </span>
      </div>

      <div className="space-y-1.5 text-body-sm text-on-surface border-t border-outline-variant/20 pt-3">
        <div className="flex items-center justify-between text-caption text-on-surface-variant">
          <span>الهاتف:</span>
          <span className="font-mono text-on-surface font-semibold dir-ltr">
            {staff.phone || 'غير مسجل'}
          </span>
        </div>
        <div className="flex items-center justify-between text-caption text-on-surface-variant">
          <span>الراتب الأساسي:</span>
          <span className="font-mono text-on-surface font-bold">
            {(staff.salaryCents / 100).toLocaleString('ar-SA')} ر.س
          </span>
        </div>
        <div className="flex items-center justify-between text-caption text-on-surface-variant">
          <span>تاريخ المباشرة:</span>
          <span className="font-mono text-on-surface">{staff.hiredAt || '—'}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpenCard(staff)}
          className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-caption font-semibold flex items-center justify-center gap-1 transition-colors"
          title="طباعة بطاقة العمل (CR80)"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
          <span>بطاقة العمل</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(staff)}
          className="py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-caption font-semibold transition-colors"
        >
          تعديل
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(staff)}
          className={`py-1.5 px-2.5 rounded-lg text-caption font-semibold transition-colors ${
            staff.isActive
              ? 'text-error hover:bg-error-container/20'
              : 'text-primary hover:bg-primary/10'
          }`}
          title={staff.isActive ? 'إيقاف الموظف مؤقتاً' : 'إعادة التنشيط'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {staff.isActive ? 'pause_circle' : 'play_circle'}
          </span>
        </button>
      </div>
    </div>
  )
}
