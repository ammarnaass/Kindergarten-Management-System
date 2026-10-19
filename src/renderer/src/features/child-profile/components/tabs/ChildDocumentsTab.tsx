import { useState } from 'react'
import { toast } from '@/components/ui/toast'
import { UploadDocumentModal } from './UploadDocumentModal'

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

export function ChildDocumentsTab({ childId: _childId, childName: _childName }: ChildDocumentsTabProps) {
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

  const handleAddDocument = (title: string, _type: string) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title,
      type: 'PDF',
      size: '1.5 MB',
      date: new Date().toISOString().slice(0, 10),
      icon: 'description',
      status: 'verified'
    }

    setDocuments((prev) => [newDoc, ...prev])
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
              الأرشيف الإلكتروني الآمن للوثائق الرسمية والشهادات الصحية وعقود التسجيل
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">upload_file</span>
          <span>إرفاق مستند جديد</span>
        </button>
      </div>

      {/* 2. Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-fixed/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">{doc.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-on-surface text-body-md truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-caption text-on-surface-variant font-mono">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-outline-variant/30 text-caption">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>وثيقة معتمدة</span>
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

      {/* 3. Add Document Modal Component */}
      <UploadDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDocument={handleAddDocument}
      />
    </div>
  )
}
