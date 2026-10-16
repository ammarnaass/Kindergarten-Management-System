import { BackupItem } from '../types'

interface BackupTableRowProps {
  item: BackupItem
  onRestore: (backup: BackupItem) => void
  onDelete?: (backup: BackupItem) => void
}

export function BackupTableRow({ item, onRestore, onDelete }: BackupTableRowProps) {
  return (
    <tr
      className={`hover:bg-surface-container-low/50 transition-colors ${
        item.isLatest ? 'bg-primary-fixed/10' : ''
      }`}
    >
      <td className="py-3 px-space-md whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              item.isLatest ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          />
          <span className="font-bold">{item.date}</span>
          <span className="font-mono text-caption text-on-surface-variant font-semibold">
            {item.time}
          </span>
          {item.isLatest && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-caption text-caption font-bold">
              الأحدث
            </span>
          )}
        </div>
      </td>

      <td className="py-3 px-space-md whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${item.typeClass}`}
        >
          <span className="material-symbols-outlined text-xs">{item.typeIcon}</span>
          <span>{item.type}</span>
        </span>
      </td>

      <td className="py-3 px-space-md whitespace-nowrap font-mono font-bold text-on-surface">
        {item.size}
      </td>

      <td className="py-3 px-space-md whitespace-nowrap">
        <div className="flex items-center gap-2 font-caption text-caption">
          <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-semibold">
            {item.childrenCount} طفلاً مسجلاً
          </span>
          <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-semibold">
            {item.invoicesCount} فاتورة وسند
          </span>
        </div>
      </td>

      <td
        className="py-3 px-space-md whitespace-nowrap font-mono text-caption text-on-surface-variant max-w-[200px] truncate"
        title={item.path}
      >
        {item.path}
      </td>

      <td className="py-3 px-space-md whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onRestore(item)}
            className="px-3 py-1 rounded bg-primary text-on-primary hover:bg-primary-container font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            <span>استعادة</span>
          </button>
          <button
            onClick={() => alert(`مسار النسخة: ${item.path}`)}
            className="p-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors"
            title="نسخ المسار أو التصدير"
            type="button"
          >
            <span className="material-symbols-outlined text-base">download</span>
          </button>
          <button
            onClick={() => onDelete?.(item)}
            className="p-1 rounded bg-surface-container-high hover:bg-error hover:text-on-error text-outline transition-colors"
            title="حذف النسخة"
            type="button"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
