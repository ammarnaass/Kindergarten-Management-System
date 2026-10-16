export function LiveCustomizationPreviewCard() {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md border border-surface-variant/40">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">preview</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            معاينة مباشرة للتخصيص الحالي
          </h2>
        </div>
        <span className="font-caption text-caption text-outline">تحديث تلقائي</span>
      </div>

      {/* Mini Student Badge / Card Preview */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-inner border border-surface-variant/30">
        <div className="flex items-center justify-between border-b border-surface-variant pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-label-md">
              ف
            </div>
            <div>
              <div className="font-label-md text-label-md font-bold text-on-surface">
                فارس سلطان المطيري
              </div>
              <div className="font-caption text-caption text-outline">
                فصل الفراشات • تمهيدي أول (KG1)
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary text-on-primary shadow-xs">
            حاضر اليوم
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 font-caption text-caption">
          <div>
            <span className="text-outline">وقت الحضور:</span>
            <span className="font-mono font-bold text-on-surface mr-1">07:22 ص</span>
          </div>
          <div>
            <span className="text-outline">الرسوم المستحقة:</span>
            <span className="font-mono font-bold text-on-surface mr-1">0.00 ر.س</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption bg-surface-container-low p-2 rounded-lg border border-surface-variant/30">
        <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
        <span>يتم حفظ جميع التعديلات في قرص التخزين المحلي فوراً بدون الحاجة لأي اتصال بالإنترنت.</span>
      </div>
    </div>
  )
}
