import React from 'react'
import { GuardiansTableView } from './GuardiansTableView'
import { GuardiansCardsView } from './GuardiansCardsView'
import type { GuardianItem } from '../types'

interface GuardiansDirectorySectionProps {
  guardians: GuardianItem[]
  filteredGuardians: GuardianItem[]
  selectedGuardianId: string | null
  viewMode: 'table' | 'cards'
  loading: boolean
  onSortAlpha: () => void
  onRefresh: () => void
  onResetFilters: () => void
  onSelectGuardian: (id: string) => void
  onQuickDispatch: (text: string) => void
  onOpenPickupCard: (g: GuardianItem) => void
}

export const GuardiansDirectorySection: React.FC<GuardiansDirectorySectionProps> = ({
  guardians,
  filteredGuardians,
  selectedGuardianId,
  viewMode,
  loading,
  onSortAlpha,
  onRefresh,
  onResetFilters,
  onSelectGuardian,
  onQuickDispatch,
  onOpenPickupCard
}) => {
  return (
    <div className="col-span-12 lg:col-span-7 2xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20 overflow-hidden flex flex-col">
      {/* Table Header & Counter */}
      <div className="p-space-md bg-surface-container-low/40 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            سجلات أولياء الأمور والمستلمين
          </span>
          <span className="bg-surface-container-high text-primary px-2 py-0.5 rounded-md font-label-sm text-label-sm font-semibold">
            عرض {filteredGuardians.length} من أصل {guardians.length}
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            onClick={onSortAlpha}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
            title="ترتيب أبجدي"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sort_by_alpha</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
            title="تحديث السجلات المحلية"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-2">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>جاري تحميل بيانات السجلات...</span>
        </div>
      ) : filteredGuardians.length === 0 ? (
        <div className="p-12 text-center text-on-surface-variant space-y-2">
          <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
          <p className="font-body-md text-on-surface">لم يتم العثور على أي نتائج مطابقة للتصفية</p>
          <button
            onClick={onResetFilters}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary text-label-sm"
            type="button"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <GuardiansTableView
          guardians={filteredGuardians}
          selectedGuardianId={selectedGuardianId}
          onSelectGuardian={onSelectGuardian}
          onQuickDispatch={onQuickDispatch}
          onOpenPickupCard={onOpenPickupCard}
        />
      ) : (
        <GuardiansCardsView
          guardians={filteredGuardians}
          selectedGuardianId={selectedGuardianId}
          onSelectGuardian={onSelectGuardian}
          onOpenPickupCard={onOpenPickupCard}
        />
      )}

      {/* Table Footer with Shortcuts info */}
      <div className="p-space-md bg-surface-container-low/60 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
          <span>
            التنقل بالأسهم <kbd className="bg-surface-container-highest px-1 rounded">↑</kbd>{' '}
            <kbd className="bg-surface-container-highest px-1 rounded">↓</kbd> للاختيار السريع
          </span>
          <span className="mx-1">•</span>
          <span>
            اضغط <kbd className="bg-surface-container-highest px-1 rounded">F3</kbd> لإضافة ولي أمر
          </span>
        </div>
        <div className="flex items-center gap-space-xs text-caption text-on-surface-variant font-mono">
          إجمالي السجلات: {filteredGuardians.length}
        </div>
      </div>
    </div>
  )
}
