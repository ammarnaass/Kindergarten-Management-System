import { useState, useMemo } from 'react'
import type { ChildItem, ClassroomItem } from '@/lib/api/types'

interface GateReceiptReportProps {
  childrenList: ChildItem[]
  classrooms?: ClassroomItem[]
  selectedClassroomId: string
  kindergartenName: string
  branchName: string
}

export function GateReceiptReport({
  childrenList,
  classrooms = [],
  selectedClassroomId,
  kindergartenName,
  branchName
}: GateReceiptReportProps) {
  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [pickupReason, setPickupReason] = useState('انصراف اعتيادي من البوابة')
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [format, setFormat] = useState<'80mm' | 'a5'>('80mm')

  const filteredChildren = useMemo(() => {
    if (selectedClassroomId === 'ALL') return childrenList
    return childrenList.filter((c) => c.classroomId === selectedClassroomId)
  }, [childrenList, selectedClassroomId])

  const currentChild = useMemo(() => {
    if (selectedChildId) {
      return childrenList.find((c) => c.id === selectedChildId) || null
    }
    return filteredChildren[0] || childrenList[0] || null
  }, [childrenList, selectedChildId, filteredChildren])

  const currentClassroom = classrooms.find((c) => c.id === currentChild?.classroomId)
  const now = new Date()
  const currentTime = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const currentDate = now.toISOString().slice(0, 10)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Non-print control bar */}
      <div className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-[24px]">receipt_long</span>
          <div>
            <h3 className="font-bold text-on-surface text-label-lg">
              سند الاستلام والتفويض الأمني الفوري (Gate Receipt)
            </h3>
            <p className="text-caption text-on-surface-variant">
              مخصص لطابعات الإيصالات الحرارية 80mm أو قسائم A5 للتوثيق الأمني الفوري عند البوابات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setFormat('80mm')}
              className={`px-3 py-1 rounded text-caption font-bold transition-all ${
                format === '80mm'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              طابعة حرارية 80mm
            </button>
            <button
              type="button"
              onClick={() => setFormat('a5')}
              className={`px-3 py-1 rounded text-caption font-bold transition-all ${
                format === 'a5'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              قسيمة دفترية A5
            </button>
          </div>

          <select
            value={currentChild?.id || ''}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-body-sm text-on-surface focus:outline-none"
          >
            {filteredChildren.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Format 1: 80mm POS Thermal Receipt */}
      {format === '80mm' ? (
        <div className="w-[320px] bg-white text-slate-900 p-6 rounded-xl shadow-xl border border-slate-300 font-mono text-xs select-none print:m-0 print:p-2 print:shadow-none print:border-none print:w-[80mm]">
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-400 space-y-1">
            <div className="font-bold text-sm tracking-tight">{kindergartenName}</div>
            <div className="text-[10px] text-slate-500">{branchName} • بوابة الاستلام الآمن</div>
            <div className="text-[11px] font-bold bg-slate-900 text-white py-1 px-2 rounded mt-2">
              سند تسليم واستلام رسمي
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              رقم السند: SEC-{currentChild?.id.slice(0, 6).toUpperCase() || '2026-01'}
            </div>
          </div>

          <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">التاريخ:</span>
              <span className="font-bold">{currentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">الوقت الدقيق:</span>
              <span className="font-bold dir-ltr">{currentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">بوابة الخروج:</span>
              <span className="font-bold">بوابة رقم 1 (الرئيسية)</span>
            </div>
          </div>

          <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
            <div>
              <span className="text-slate-500 text-[10px] block">اسم الطفل المستلم:</span>
              <span className="font-bold text-slate-900 text-sm block">
                {currentChild ? `${currentChild.firstName} ${currentChild.lastName}` : '—'}
              </span>
              <span className="text-[10px] text-slate-600">
                {currentClassroom?.name || '—'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block">الشخص المستلم:</span>
              <input
                type="text"
                value={recipientName}
                placeholder="اسم الشخص المستلم (اختياري)"
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-1 rounded font-bold text-xs"
              />
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block">سبب الخروج / الاستلام:</span>
              <input
                type="text"
                value={pickupReason}
                onChange={(e) => setPickupReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-1 rounded text-xs"
              />
            </div>
          </div>

          {/* Barcode Graphic */}
          <div className="py-4 text-center border-b border-dashed border-slate-300">
            <div className="flex justify-center gap-0.5 h-10 items-end mb-1">
              {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 4, 8, 2, 4, 6, 2].map((w, i) => (
                <div key={i} className="bg-slate-900 h-full" style={{ width: `${w}px` }} />
              ))}
            </div>
            <span className="text-[9px] tracking-widest font-mono text-slate-600 block">
              *GATE-AUTH-VERIFIED*
            </span>
          </div>

          <div className="pt-4 text-center space-y-8 text-[10px]">
            <div className="flex justify-between items-center text-slate-600 px-2">
              <span>توقيع المستلم: ...........</span>
              <span>توقيع الحارس: ...........</span>
            </div>
            <div className="text-[9px] text-slate-400">
              النظام المكتبي المحلي • روضتي Offline-First OS
            </div>
          </div>
        </div>
      ) : (
        /* Format 2: A5 Half-Page Voucher */
        <div className="w-full max-w-[650px] bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 select-none print:m-0 print:p-6 print:shadow-none print:border-none">
          <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-900">{kindergartenName}</h2>
              <p className="text-xs text-slate-600">سند استلام واستئذان طفل استثنائي (A5)</p>
            </div>
            <div className="text-left font-mono text-xs text-slate-600">
              <div>السند: <strong>#SEC-2026-A5</strong></div>
              <div>التاريخ: {currentDate} | {currentTime}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div className="border border-slate-200 p-3 rounded-xl bg-slate-50">
              <span className="text-slate-500 block text-[10px]">الطفل المسلم:</span>
              <span className="font-bold text-sm text-slate-900 block mt-1">
                {currentChild ? `${currentChild.firstName} ${currentChild.lastName}` : '—'}
              </span>
              <span className="text-slate-600 mt-1 block">{currentClassroom?.name || '—'}</span>
            </div>

            <div className="border border-slate-200 p-3 rounded-xl bg-slate-50">
              <span className="text-slate-500 block text-[10px]">المستلم المصرح له:</span>
              <span className="font-bold text-sm text-slate-900 block mt-1">{recipientName || '—'}</span>
              <span className="font-mono text-slate-600 mt-1 block dir-ltr text-right">{recipientPhone || '—'}</span>
            </div>
          </div>

          <div className="border border-slate-200 p-3 rounded-xl mb-6 text-xs">
            <span className="text-slate-500 block text-[10px]">سبب الخروج وتفاصيل الإذن:</span>
            <span className="font-semibold text-slate-800 block mt-1">{pickupReason}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center text-xs">
            <div className="space-y-8">
              <span>توقيع ولي الأمر / المستلم</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>
            <div className="space-y-8">
              <span>حارس ومسؤول البوابة</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>
            <div className="space-y-8">
              <span>ختم الإدارة واعتماد الخروج</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
