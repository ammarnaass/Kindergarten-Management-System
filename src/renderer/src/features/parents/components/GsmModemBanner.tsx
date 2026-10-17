import React from 'react'

interface GsmModemBannerProps {
  onCheckNumbers: () => void
}

export const GsmModemBanner: React.FC<GsmModemBannerProps> = ({ onCheckNumbers }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-l from-primary/10 via-surface-container-high/60 to-surface-container-lowest p-space-md shadow-xs flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/20">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[22px]">perm_phone_msg</span>
        </div>
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              بوابة الإرسال والربط المحلي (GSM Modem COM4)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold">
              نشط محلياً • رصيد 1,420 رسالة
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            جاهز لإرسال إشعارات الانصراف والطوارئ الفورية لجميع أولياء الأمور دون اتصال خارجي بالإنترنت
          </p>
        </div>
      </div>
      <div className="flex items-center gap-space-sm self-end md:self-auto">
        <span className="text-on-surface-variant font-caption text-caption">
          قاعدة البيانات المحلية: 0 تأخير تزامن
        </span>
        <button
          onClick={onCheckNumbers}
          className="px-space-md py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">sync</span>
          فحص سلامة الأرقام
        </button>
      </div>
    </div>
  )
}
