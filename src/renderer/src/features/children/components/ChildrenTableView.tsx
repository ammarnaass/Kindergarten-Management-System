interface ChildTableItem {
  id: string
  firstName: string
  lastName: string
  birthDate?: string
  classroomId?: string
  allergies?: string | null
}

interface ChildrenTableViewProps {
  children: ChildTableItem[]
  onOpenProfile: (id: string) => void
  onDeleteChild?: (id: string, name: string) => void
}

export function ChildrenTableView({ children, onOpenProfile, onDeleteChild }: ChildrenTableViewProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] text-right border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md border-b border-outline-variant/40">
            <th className="py-3 px-4">الطفل</th>
            <th className="py-3 px-4">الفصل</th>
            <th className="py-3 px-4">تاريخ الميلاد</th>
            <th className="py-3 px-4">الحالة الصحية</th>
            <th className="py-3 px-4">الحالة</th>
            <th className="py-3 px-4 text-left">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30 font-body-sm text-body-sm">
          {children.map((child) => (
            <tr
              key={child.id}
              onClick={() => onOpenProfile(child.id)}
              className="hover:bg-surface-container-low cursor-pointer transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {child.firstName?.[0] || 'ط'}
                  </div>
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">
                    {child.firstName} {child.lastName}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-on-surface-variant">
                {child.classroomId || 'غير مسكن بفصل'}
              </td>
              <td className="py-3 px-4 font-mono text-on-surface-variant">
                {child.birthDate || '-'}
              </td>
              <td className="py-3 px-4">
                {child.allergies ? (
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-caption text-caption font-bold">
                    {child.allergies}
                  </span>
                ) : (
                  <span className="text-on-surface-variant font-caption text-caption">سليم ومحدث</span>
                )}
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-caption text-caption font-semibold">
                  نشط
                </span>
              </td>
              <td className="py-3 px-4 text-left">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenProfile(child.id)
                    }}
                    className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors"
                    type="button"
                  >
                    عرض التفاصيل
                  </button>
                  {onDeleteChild && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChild(child.id, `${child.firstName} ${child.lastName}`)
                      }}
                      className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                      title="حذف ملف الطفل"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
