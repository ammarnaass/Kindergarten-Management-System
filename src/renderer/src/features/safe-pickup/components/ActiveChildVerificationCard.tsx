import { useState } from 'react'
import { ActiveChildProfileHeader } from './ActiveChildProfileHeader'
import { AuthorizedGuardianCards } from './AuthorizedGuardianCards'
import { GateCctvAndIntercom } from './GateCctvAndIntercom'

export interface SafePickupGuardian {
  id: string
  name: string
  profession?: string
  relationship: string
  nationalId: string
  phone: string
  photoUrl: string
  isPermanent?: boolean
}

interface ActiveChildVerificationCardProps {
  childName?: string
  childAge?: string
  classroom?: string
  childIdNumber?: string
  entryTime?: string
  photoUrl?: string
  lockerNumber?: string
  allergiesNote?: string
  teacherNote?: string
  guardians?: SafePickupGuardian[]
  onConfirmDelivery: (guardian: SafePickupGuardian) => void
  onIntercomCall?: () => void
}

export function ActiveChildVerificationCard({
  childName = 'ريان بن ماجد الصالح',
  childAge = '4 سنوات ونصف',
  classroom = 'فصل العصافير',
  childIdNumber = '#KDG-2026-058',
  entryTime = '07:50 ص',
  photoUrl = 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=160&auto=format&fit=crop&q=80',
  lockerNumber = 'C-09',
  allergiesNote = 'بخاخ فنتولين (Ventolin) متوافر بحقيبة الطفل - يُرجى تجنب إخراجه في الطقس المغبر ومتابعة تنفسه الطبيعي.',
  teacherNote = 'ريان نام قيلولة مريحة، وأخذ وجبته كاملة، معطفه الكحلي وحقيبة الكتب جاهزة.',
  guardians,
  onConfirmDelivery,
  onIntercomCall
}: ActiveChildVerificationCardProps) {
  const defaultGuardians: SafePickupGuardian[] = [
    {
      id: 'g1',
      name: 'ماجد بن عبد الله الصالح',
      profession: 'مهندس كهربائي',
      relationship: 'الأب (ولي أمر دائم)',
      nationalId: '1045928174',
      phone: '0554 12 99 83',
      photoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      isPermanent: true
    },
    {
      id: 'g2',
      name: 'منيرة التميمي',
      profession: 'صيدلانية',
      relationship: 'الخالة (مفوض رسمي)',
      nationalId: '2098411250',
      phone: '0503 34 81 92',
      photoUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'g3',
      name: 'سالم بن ناصر الدوسري',
      profession: 'سائق العائلة المعتمد',
      relationship: 'بطاقة تفويض سنوية',
      nationalId: '2248192033',
      phone: '0567 71 23 90',
      photoUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    }
  ]

  const guardianList = guardians && guardians.length > 0 ? guardians : defaultGuardians
  const [selectedGuardianId, setSelectedGuardianId] = useState(guardianList[0].id)
  const selectedGuardian = guardianList.find((g) => g.id === selectedGuardianId) || guardianList[0]

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

        <AuthorizedGuardianCards
          guardians={guardianList}
          selectedGuardianId={selectedGuardianId}
          onSelectGuardian={setSelectedGuardianId}
        />

        {/* Security Warning Lock */}
        <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-high flex items-center gap-space-sm text-on-surface">
          <span className="material-symbols-outlined text-error text-xl shrink-0">gpp_maybe</span>
          <p className="font-caption text-caption">
            <strong className="text-error">صمام الأمان المشدد: </strong>
            يُمنع منعاً باتاً تسليم الطفلة لأي شخص آخر غير هؤلاء الثلاثة بدون تفويض إداري استثنائي مسبق موقّع ومؤكد هاتفياً مع ولي الأمر الرئيسي.
          </p>
        </div>

        {/* Master Delivery Confirmation & Actions */}
        <div className="mt-space-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
          <button
            onClick={() => onConfirmDelivery(selectedGuardian)}
            className="flex-1 flex items-center justify-center gap-2 h-14 px-space-lg rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm font-bold shadow-md hover:shadow-lg transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">how_to_reg</span>
            <span>
              تأكيد التسليم إلى: {selectedGuardian.name} ({selectedGuardian.relationship}) [Enter / F10]
            </span>
          </button>

          <button
            onClick={() => alert('تم تفعيل وضع تسليم الإخوة المشترك')}
            className="flex items-center justify-center gap-1.5 h-14 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg shadow-xs transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">family_restroom</span>
            <span>تسليم مع إخوة</span>
          </button>

          <button
            onClick={() => alert('نافذة تسجيل استثناء أمني موثق')}
            className="flex items-center justify-center gap-1.5 h-14 px-space-md rounded-xl bg-surface-container-low hover:bg-error-container text-error font-label-lg text-label-lg shadow-xs transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">lock_person</span>
            <span>استثناء أمني</span>
          </button>
        </div>
      </div>

      <GateCctvAndIntercom onIntercomCall={onIntercomCall} />
    </div>
  )
}
