import { useState } from 'react'
import { BackupItem, DEFAULT_BACKUPS } from '../types'
import { BackupSafetyNotice } from './BackupSafetyNotice'
import { BackupTableRow } from './BackupTableRow'

interface BackupTableSectionProps {
  backups?: BackupItem[]
  onRestore: (backup: BackupItem) => void
  onRefresh: () => void
  onDelete?: (backup: BackupItem) => void
}

export function BackupTableSection({
  backups,
  onRestore,
  onRefresh,
  onDelete
}: BackupTableSectionProps) {
  const [filter, setFilter] = useState('')

  const items = backups && backups.length > 0 ? backups : DEFAULT_BACKUPS

  const filteredItems = items.filter(
    (b) =>
      !filter ||
      b.date.includes(filter) ||
      b.type.includes(filter) ||
      b.path.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-space-md select-none">
      <BackupSafetyNotice />

      {/* Available Local Backups Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-space-md bg-surface-container-low/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl">dataset</span>
            <div>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                سجل النسخ الاحتياطية المتوفرة محلياً
              </span>
              <span className="font-caption text-caption text-on-surface-variant block">
                مفهرسة من الأحدث إلى الأقدم وجاهزة للاستعادة الفورية
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs self-stretch sm:self-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute right-2.5 top-2 text-outline text-base">
                filter_list
              </span>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="تصفية النسخ بالتاريخ أو النوع..."
                className="w-full h-8 pr-8 pl-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none ring-1 ring-outline-variant/30"
              />
            </div>
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant transition-colors"
              title="تحديث القائمة"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-high/60 text-on-surface-variant font-label-md text-label-md">
                <th className="py-2.5 px-space-md font-semibold">تاريخ ووقت النسخة</th>
                <th className="py-2.5 px-space-md font-semibold">النوع ونقطة الإنشاء</th>
                <th className="py-2.5 px-space-md font-semibold">الحجم</th>
                <th className="py-2.5 px-space-md font-semibold">محتوى السجلات الموثقة</th>
                <th className="py-2.5 px-space-md font-semibold">مسار الملف</th>
                <th className="py-2.5 px-space-md font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-body-sm text-body-sm text-on-surface">
              {filteredItems.map((item) => (
                <BackupTableRow
                  key={item.id}
                  item={item}
                  onRestore={onRestore}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
