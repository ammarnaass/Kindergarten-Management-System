import React, { useState } from 'react'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDocument: (title: string, type: string) => void
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  onAddDocument
}: UploadDocumentModalProps) {
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('شهادة طبية')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    onAddDocument(newTitle.trim(), newType)
    setNewTitle('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/30">
            <h3 className="font-bold text-on-surface text-label-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
              <span>إرفاق مستند ورقي بملف الطفل</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                اسم أو نوع المستند
              </label>
              <input
                type="text"
                required
                placeholder="مثال: بطاقة التطعيم الإضافية، صك ولاية..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                تصنيف المستند
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="شهادة طبية">شهادة طبية / تقرير صحي</option>
                <option value="مستند رسمي">مستند رسمي / هوية</option>
                <option value="استمارة ورقية">استمارة ورقية موقعة</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center py-6 cursor-pointer hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary mb-1">cloud_upload</span>
              <span className="text-body-sm font-semibold text-on-surface">اختر ملف من جهازك (PDF أو صورة)</span>
              <span className="text-caption text-on-surface-variant mt-0.5">الحد الأقصى 10 ميغابايت</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-sm font-semibold hover:bg-surface-container-high transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-xs"
              >
                حفظ المستند
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
