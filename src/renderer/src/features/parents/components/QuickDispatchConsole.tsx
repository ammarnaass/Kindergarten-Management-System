import React from 'react'
import type { GuardianItem } from '../types'

interface QuickDispatchConsoleProps {
  guardian: GuardianItem
  dispatchText: string
  onDispatchTextChange: (text: string) => void
  dispatchFeedback: string | null
  onSendDispatch: (text?: string) => void
}

export const QuickDispatchConsole: React.FC<QuickDispatchConsoleProps> = ({
  guardian,
  dispatchText,
  onDispatchTextChange,
  dispatchFeedback,
  onSendDispatch
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/20">
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[18px] text-primary">send_to_mobile</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            إرسال فوري لولي الأمر المختار
          </span>
        </div>
        <span className="font-caption text-caption bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-mono">
          {guardian.phone}
        </span>
      </div>

      {dispatchFeedback && (
        <div className="p-2 mb-2 rounded-lg bg-primary/10 text-primary text-caption font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>{dispatchFeedback}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() =>
              onDispatchTextChange(
                `السيد ${guardian.firstName}، نود إحاطتكم بضرورة الحضور لاستلام الطفل من بوابة الروضة في الموعد المحدد.`
              )
            }
            className="px-2 py-1 rounded bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors"
            type="button"
          >
            استدعاء للاستلام
          </button>
          <button
            onClick={() =>
              onDispatchTextChange(
                `السيد ${guardian.firstName}، تقرير صحي عاجل من عيادة روضتي: الطفل بحالة جيدة ويرجى التواصل للاطمئنان.`
              )
            }
            className="px-2 py-1 rounded bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors"
            type="button"
          >
            تقرير صحي عاجل
          </button>
          <button
            onClick={() =>
              onDispatchTextChange(
                `السيد ${guardian.firstName}، نذكركم بموعد الفعالية القادمة في روضتي غداً بإذن الله.`
              )
            }
            className="px-2 py-1 rounded bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors"
            type="button"
          >
            تذكير بفعالية
          </button>
        </div>
        <textarea
          value={dispatchText}
          onChange={(e) => onDispatchTextChange(e.target.value)}
          className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
          placeholder="اكتب نص الرسالة الفورية ليتم إرسالها محلياً عبر المودم فوراً..."
          rows={2}
        />
        <div className="flex items-center justify-between">
          <span className="font-caption text-caption text-on-surface-variant">
            تكلفة الرسالة: 0.00 ر.س (شريحة محلية مدمجة)
          </span>
          <button
            onClick={() => onSendDispatch()}
            disabled={!dispatchText.trim()}
            className="px-3 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container flex items-center gap-1 transition-colors disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">send</span>
            إرسال SMS الآن
          </button>
        </div>
      </div>
    </div>
  )
}
