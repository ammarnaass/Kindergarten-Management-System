import { ParentsInfoCard } from './ParentsInfoCard'
import { AuthorizedPickupsCard, PickupPerson } from './AuthorizedPickupsCard'
import { ScannedDocumentsCard } from './ScannedDocumentsCard'

interface Guardian {
  id: string
  name: string
  relationship: string
  phone: string
}

interface ParentsAndPickupsSectionProps {
  guardians?: Guardian[]
  pickups?: PickupPerson[]
  onAddPickup?: () => void
}

export function ParentsAndPickupsSection({
  pickups,
  onAddPickup
}: ParentsAndPickupsSectionProps) {
  const defaultPickups: PickupPerson[] = [
    {
      id: 'p1',
      name: 'طارق بن علي',
      relationship: 'الأب (وصي شرعي)',
      phone: '0550123456',
      photoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tag: 'مخوّل دائم',
      tagClass: 'bg-emerald-100 text-emerald-800',
      note: 'بصمة بيومترية مسجلة'
    },
    {
      id: 'p2',
      name: 'د. أمينة حمدي',
      relationship: 'الأم (وصية شرعية)',
      phone: '0661234567',
      photoUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      tag: 'مخوّلة دائمة',
      tagClass: 'bg-emerald-100 text-emerald-800',
      note: 'بصمة بيومترية مسجلة'
    },
    {
      id: 'p3',
      name: 'فاطمة بوعزيز',
      relationship: 'الجدة (من طرف الأم)',
      phone: '0558774411',
      photoUrl:
        'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=150&auto=format&fit=crop&q=80',
      tag: 'مع بطاقة الهوية',
      tagClass: 'bg-secondary-fixed text-on-secondary-fixed',
      note: 'بطاقة تعريف رقم: 1098442'
    }
  ]

  const displayPickups = pickups && pickups.length > 0 ? pickups : defaultPickups

  return (
    <div className="flex flex-col gap-space-lg select-none">
      <ParentsInfoCard />
      <AuthorizedPickupsCard pickups={displayPickups} onAddPickup={onAddPickup} />
      <ScannedDocumentsCard />
    </div>
  )
}
