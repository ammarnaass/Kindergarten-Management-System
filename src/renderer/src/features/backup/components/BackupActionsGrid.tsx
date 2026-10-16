interface BackupActionsGridProps {
  onUsbExport: () => void
  onImportBackup: () => void
  onIntegrityCheck: () => void
}

export function BackupActionsGrid({
  onUsbExport,
  onImportBackup,
  onIntegrityCheck
}: BackupActionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg select-none">
      {/* Card 1: External USB Export */}
      <div className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-md">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-2xl">usb</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-caption text-caption font-semibold">
              حماية فيزيائية
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            تصدير إلى قرص خارجي (USB)
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
            حفظ نسخة مغلّفة ومضغوطة خارج جهاز الروضة لحماية أرشيف الأطفال والمالية ضد تلف القرص الصلب أو تعطل نظام التشغيل.
          </p>
        </div>
        <button
          onClick={onUsbExport}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary font-label-md text-label-md font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">drive_file_move</span>
          <span>اختيار فلاش ميموري والتصدير</span>
        </button>
      </div>

      {/* Card 2: Import & Restore External .rawdatibak */}
      <div className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-md">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-2xl">settings_backup_restore</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-caption text-caption font-semibold">
              استرجاع شامل
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            استيراد واستعادة من ملف خارجي
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
            استعادة أرشيف من ملف امتداد{' '}
            <span className="font-mono text-caption text-primary font-semibold">.rawdatibak</span> منقول من حاسوب إدارة آخر أو نسخة منقذة من وسيط تخزين.
          </p>
        </div>
        <button
          onClick={onImportBackup}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">file_open</span>
          <span>تحديد ملف (.rawdatibak)</span>
        </button>
      </div>

      {/* Card 3: Database Health & Vacuum (Integrity Check) */}
      <div className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-md">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-2xl">health_and_safety</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-caption text-caption font-semibold">
              سلامة: 100%
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            فحص السلامة وإصلاح الفهارس
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
            تنفيذ{' '}
            <span className="font-mono text-caption text-on-surface font-semibold">
              PRAGMA integrity_check
            </span>{' '}
            وإلغاء التجزئة (<span className="font-mono text-caption text-on-surface font-semibold">VACUUM</span>) لتحسين سرعة استعلامات البحث وتطهير المساحة المهدرة.
          </p>
        </div>
        <button
          onClick={onIntegrityCheck}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-tertiary font-label-md text-label-md font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">speed</span>
          <span>بدء فحص السلامة (Integrity Check)</span>
        </button>
      </div>
    </div>
  )
}
