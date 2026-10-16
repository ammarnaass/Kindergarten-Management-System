export function AttendanceKeypadHint() {
  return (
    <div className="flex items-center justify-between px-space-md py-2 bg-surface-container-high rounded-lg mb-space-md text-on-surface-variant font-caption text-caption select-none">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-primary">touch_app</span>
        <span>لوحة اللمس المباشر: انقر على حالة الطفل للتبديل الفوري دون فتح نوافذ منبثقة.</span>
      </div>
      <div className="flex items-center gap-3 font-mono">
        <span>مفاتيح الإدخال السريع:</span>
        <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface">1 حاضر</span>
        <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface">2 غائب</span>
        <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface">3 متأخر</span>
      </div>
    </div>
  )
}
