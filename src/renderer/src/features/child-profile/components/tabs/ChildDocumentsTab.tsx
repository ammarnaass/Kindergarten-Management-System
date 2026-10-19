import { useState } from 'react'
import { toast } from '@/components/ui/toast'

interface ChildDocumentsTabProps {
  childId: string
  childName: string
}

interface DocumentItem {
  id: string
  title: string
  type: string
  size: string
  date: string
  icon: string
  status: 'verified' | 'pending'
}

export function ChildDocumentsTab({ childId, childName }: ChildDocumentsTabProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      title: 'شهادة الميلاد الرسمية',
      type: 'PDF',
      size: '1.2 MB',
      date: '2026-10-19',
      icon: 'picture_as_pdf',
      status: 'verified'
    },
    {
      id: 'doc-2',
      title: 'دفتر التلقيحات المحدث',
      type: 'PDF',
      size: '2.8 MB',
      date: '2026-10-19',
      icon: 'medical_information',
      status: 'verified'
    },
    {
      id: 'doc-3',
      title: 'استمارة التسجيل وعقد الروضة الموقع',
      type: 'PDF',
      size: '890 KB',
      date: '2026-10-19',
      icon: 'edit_document',
      status: 'verified'
    }
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('شهادة طبية')

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      toast({
        title: 'يرجى إدخال عنوان المستند',
        variant: 'warning'
      })
      return
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      type: 'PDF',
      size: '1.5 MB',
      date: new Date().toISOString().slice(0, 10),
      icon: 'description',
      status: 'verified'
    }

    setDocuments((prev) => [newDoc, ...prev])
    setNewTitle('')
    setIsAddModalOpen(false)
    toast({
      title: 'تم إرفاق المستند بنجاح',
      description: `تم حفظ «${newDoc.title}» محلياً في أرشيف الطفل.`
    })
  }

  const handlePreview = (title: string) => {
    toast({
      title: 'معاينة المستند',
      description: `جاري فتح المستند «${title}» في نافذة المعاينة الآمنة.`
    })
  }

  return (
    <div className="space-y-space-lg select-none animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">folder_open</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-label-lg">أرشيف المستندات والملفات الممسوحة</h3>
            <p className="text-caption text-on-surface-variant">
              الملفات الورقية والمستندات الرسمية المحفوظة محلياً للطفل «{childName}»
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary/90 transition-all shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-base">upload_file</span>
          <span>إرفاق مستند جديد</span>
        </button>
      </div>

      {/* 2. Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-space-md group"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center shrink-0 group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">{doc.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-on-surface text-label-md truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 text-caption text-on-surface-variant font-mono mt-1">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                مستند موثق
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePreview(doc.title)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-caption font-semibold transition-colors flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>معاينة</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/30">
                <h3 className="font-bold text-on-surface text-label-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
                  <span>إرفاق مستند ورقي بملف الطفل</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <form onSubmit={handleAddDocument} className="space-y-4">
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
                    onClick={() => setIsAddModalOpen(false)}
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
      )}
    </div>
  )
}
