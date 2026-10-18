import React from 'react'
import type { ChildItem } from '../types'

interface ChildPickerModalProps {
  isOpen: boolean
  onClose: () => void
  search: string
  onSearchChange: (val: string) => void
  childrenData?: { items: ChildItem[]; total: number }
  isLoading: boolean
  classroomMap: Map<string, string>
  onSelectChild: (child: ChildItem) => void
}

export const ChildPickerModal: React.FC<ChildPickerModalProps> = ({
  isOpen,
  onClose,
  search,
  onSearchChange,
  childrenData,
  isLoading,
  classroomMap,
  onSelectChild,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-outline-variant flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">person_search</span>
            <span className="font-headline-sm font-bold text-on-surface">
              اختيار الطفل لسداد الرسوم (F2)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم أو اللقب..."
            className="w-full h-10 pr-9 pl-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
        </div>

        {/* Children results list */}
        <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-2xl mb-1">sync</span>
              <p className="text-xs">جاري البحث في قاعدة البيانات...</p>
            </div>
          ) : !childrenData?.items || childrenData.items.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-low rounded-xl">
              <p className="text-on-surface font-semibold text-sm">لم يتم العثور على أطفال</p>
              <p className="text-on-surface-variant text-xs mt-1">تأكد من كتابة الاسم بشكل صحيح</p>
            </div>
          ) : (
            childrenData.items.map((c) => {
              const cName = c.classroomId ? classroomMap.get(c.classroomId) || 'فصل مسجل' : 'غير مسكن'
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectChild(c)}
                  className="w-full text-right p-3 rounded-xl hover:bg-surface-container transition-colors flex items-center justify-between group border border-transparent hover:border-outline-variant/60"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold shadow-2xs">
                      {c.firstName[0]}
                    </div>
                    <div>
                      <p className="font-label-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        {cName} • {c.gender === 'male' ? 'ذكر' : 'أنثى'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                    arrow_back
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
