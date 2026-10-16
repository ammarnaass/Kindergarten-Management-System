export function BackupSafetyNotice() {
  return (
    <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-highest/60 text-on-surface shadow-xs select-none">
      <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
        <span className="material-symbols-outlined text-lg">security</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-label-md text-label-md font-bold block text-primary">
          بروتوكول أمان الاستعادة الذاتي:
        </span>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          عند طلب استعادة أي نسخة احتياطية، يُنشئ النظام تلقائياً نقطة أمان (
          <span className="font-mono text-caption bg-surface-container-low px-1 py-0.5 rounded text-on-surface">
            Pre-Restore Snapshot
          </span>
          ) من الحالة الحالية قبيل بدء الاستبدال، لضمان عدم فقدان أي معاملة حتى في حال انقطاع التيار الكهربائي.
        </p>
      </div>
    </div>
  )
}
