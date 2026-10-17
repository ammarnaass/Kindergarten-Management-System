import { useState, useEffect } from 'react'
import { ActiveChildProfileHeader } from './ActiveChildProfileHeader'
import { AuthorizedGuardianCards } from './AuthorizedGuardianCards'
import { GateCctvAndIntercom } from './GateCctvAndIntercom'

export interface SafePickupGuardian {
  id: string
  name: string
  profession?: string
  relationship: string
  nationalId?: string
  phone?: string
  photoUrl?: string | null
  isPermanent?: boolean
}

interface ActiveChildVerificationCardProps {
  childName: string
  childAge?: string
  classroom?: string
  childIdNumber?: string
  entryTime?: string
  photoUrl?: string | null
  lockerNumber?: string
  allergiesNote?: string | null
  teacherNote?: string | null
  guardians?: SafePickupGuardian[]
  onConfirmDelivery: (guardian: SafePickupGuardian) => void
  onIntercomCall?: () => void
}

export function ActiveChildVerificationCard({
  childName,
  childAge = '',
  classroom = 'عام',
  childIdNumber = '',
  entryTime = '08:00 ص',
  photoUrl = null,
  lockerNumber = '',
  allergiesNote = null,
  teacherNote = null,
  guardians = [],
  onConfirmDelivery,
  onIntercomCall
}: ActiveChildVerificationCardProps) {
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>(
    guardians[0]?.id || ''
  )
  const [manualReceiver, setManualReceiver] = useState('')

  useEffect(() => {
    if (guardians.length > 0 && (!selectedGuardianId || !guardians.some((g) => g.id === selectedGuardianId))) {
      setSelectedGuardianId(guardians[0].id)
    }
  }, [guardians, selectedGuardianId])

  const selectedGuardian =
    guardians.find((g) => g.id === selectedGuardianId) ||
    guardians[0] || {
      id: 'manual',
      name: manualReceiver.trim() || 'ولي الأمر / مستلم موثق',
      relationship: 'استلام مباشر بمطابقة الهوية',
      nationalId: '',
      phone: '',
      isPermanent: false
    }

  return (
    <div className="flex flex-col gap-space-md select-none">
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs">
        <ActiveChildProfileHeader
          childName={childName}
          childAge={childAge}
          classroom={classroom}
          childIdNumber={childIdNumber}
          entryTime={entryTime}
          photoUrl={photoUrl}
          lockerNumber={lockerNumber}
          allergiesNote={allergiesNote}
          teacherNote={teacherNote}
        />

        {guardians.length > 0 ? (
          <AuthorizedGuardianCards
            guardians={guardians}
            selectedGuardianId={selectedGuardianId}
            onSelectGuardian={setSelectedGuardianId}
          />
        ) : (
          <div className="mt-space-lg p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40">
            <div className="flex items-center gap-2 text-warning mb-2">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h4 className="font-label-lg font-bold text-on-surface">لا يوجد مخوّلون إضافيون مسجلون</h4>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-3">
              لم يتم تسجيل أولياء أمور أو مخولين مسبقاً لهذا الطفل في قاعدة البيانات. يمكنك كتابة اسم المستلم وتأكيد هويته قبل الإفراج.
            </p>
            <input
              type="text"
              placeholder="اكتب اسم الشخص الحاضر لاستلام الطفل ورقم هويته..."
              value={manualReceiver}
              onChange={(e) => setManualReceiver(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        )}

        {/* Security Warning Lock */}
        <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-high flex items-center gap-space-sm text-on-surface">
          <span className="material-symbols-outlined text-error text-xl shrink-0">gpp_maybe</span>
          <p className="font-caption text-caption">
            <strong className="text-error">صمام الأمان المشدد: </strong>
            يُمنع منعاً باتاً تسليم أي طفل لشخص غير مدرج في القائمة المعتمدة أو بدون تفويض استثنائي مؤكد هاتفياً مع ولي الأمر الرسمي.
          </p>
        </div>

        {/* Master Delivery Confirmation & Actions */}
        <div className="mt-space-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
          <button
            onClick={() => onConfirmDelivery(selectedGuardian)}
            className="flex-1 flex items-center justify-center gap-2 h-14 px-space-lg rounded-xl bg-primary hover:opacity-90 text-on-primary font-headline-sm text-headline-sm font-bold shadow-md hover:shadow-lg transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">how_to_reg</span>
            <span>
              تأكيد التسليم إلى: {selectedGuardian.name} ({selectedGuardian.relationship}) [Enter / F10]
            </span>
          </button>
        </div>
      </div>

      <GateCctvAndIntercom onIntercomCall={onIntercomCall} />
    </div>
  )
}
