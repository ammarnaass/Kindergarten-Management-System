import React from 'react'
import type { StaffMember, DirectoryViewMode } from '../types'
import { StaffDirectoryCard } from './StaffDirectoryCard'

interface StaffDirectoryTabProps {
  isLoading: boolean
  filteredStaff: StaffMember[]
  directoryViewMode: DirectoryViewMode
  onEdit: (staff: StaffMember) => void
  onToggleActive: (staff: StaffMember) => void
  onOpenCard: (staff: StaffMember) => void
  onDelete: (staff: StaffMember) => void
}

export const StaffDirectoryTab: React.FC<StaffDirectoryTabProps> = ({
  isLoading,
  filteredStaff,
  directoryViewMode,
  onEdit,
  onToggleActive,
  onOpenCard,
  onDelete
}) => {
  return (
    <div className="p-6 flex-1 flex flex-col">
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-[36px] animate-spin text-primary">
            progress_activity
          </span>
          <span className="text-body-md">جاري تحميل دليل الكادر...</span>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-2">
          <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
          <span className="text-headline-sm font-semibold text-on-surface">لا توجد نتائج مطابقة</span>
          <span className="text-body-sm">جرّب تغيير عبارة البحث أو اختيار مسمى وظيفي آخر.</span>
        </div>
      ) : directoryViewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <StaffDirectoryCard
              key={staff.id}
              staff={staff}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              onOpenCard={onOpenCard}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin rounded-xl border border-outline-variant/30">
          <table className="w-full min-w-[850px] text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-semibold border-b border-outline-variant/30">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">الاسم الكامل</th>
                <th className="py-3 px-4">المسمى الوظيفي</th>
                <th className="py-3 px-4">الهاتف</th>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">الراتب الأساسي</th>
                <th className="py-3 px-4">تاريخ المباشرة</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-body-sm">
              {filteredStaff.map((staff, idx) => (
                <tr key={staff.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 text-caption text-outline font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-caption">
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono text-caption" dir="ltr">
                    {staff.phone || '—'}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono text-caption" dir="ltr">
                    {staff.email || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-on-surface">
                    {(staff.salaryCents / 100).toLocaleString('ar-DZ')} دج
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-caption font-mono">
                    {staff.hiredAt || '—'}
                  </td>
                  <td className="py-3 px-4">
                    {staff.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-caption font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>على رأس العمل</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-caption">
                        <span>متوقف</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenCard(staff)}
                        className="p-1 rounded hover:bg-surface-container-high text-primary transition-colors"
                        title="بطاقة العمل (CR80)"
                      >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(staff)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-caption font-semibold transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(staff)}
                        className="p-1 rounded hover:bg-error-container/20 text-error transition-colors"
                        title="حذف الموظف نهائياً"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
