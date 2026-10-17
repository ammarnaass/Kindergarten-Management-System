import { ParentsInfoCard, GuardianItem } from './ParentsInfoCard'
import { AuthorizedPickupsCard, PickupPerson } from './AuthorizedPickupsCard'
import { ScannedDocumentsCard } from './ScannedDocumentsCard'

interface ParentsAndPickupsSectionProps {
  guardians?: GuardianItem[]
  pickups?: PickupPerson[]
  onAddPickup?: () => void
  onAddGuardian?: () => void
}

export function ParentsAndPickupsSection({
  guardians = [],
  pickups = [],
  onAddPickup,
  onAddGuardian,
}: ParentsAndPickupsSectionProps) {
  return (
    <div className="flex flex-col gap-space-lg select-none">
      <ParentsInfoCard guardians={guardians} onAddGuardian={onAddGuardian} />
      <AuthorizedPickupsCard pickups={pickups} onAddPickup={onAddPickup} />
      <ScannedDocumentsCard />
    </div>
  )
}
