export function ScannedDocumentsCard() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-xl">attach_file</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            المستندات الورقية الممسوحة والمخزنة محلياً
          </h3>
        </div>
        <span className="font-caption text-caption text-on-surface-variant font-mono">
          SQLite Local Blob Archive
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
        <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-error text-2xl">picture_as_pdf</span>
            <div>
              <h6 className="font-label-md text-label-md font-semibold text-on-surface">
                شهادة الميلاد الرسمية
              </h6>
              <p className="font-caption text-caption text-on-surface-variant">PDF • 1.2 MB</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-base">
            visibility
          </span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-2xl">
              medical_information
            </span>
            <div>
              <h6 className="font-label-md text-label-md font-semibold text-on-surface">
                دفتر التلقيحات المحدث
              </h6>
              <p className="font-caption text-caption text-on-surface-variant">كامل التطعيمات • 2.8 MB</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-base">
            visibility
          </span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-2xl">
              edit_document
            </span>
            <div>
              <h6 className="font-label-md text-label-md font-semibold text-on-surface">
                استمارة التسجيل الموقعة
              </h6>
              <p className="font-caption text-caption text-on-surface-variant">توقيع الولي • 890 KB</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-base">
            visibility
          </span>
        </div>
      </div>
    </section>
  )
}
