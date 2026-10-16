import { BranchSettings } from '../types'
import { BranchLogoCard } from './BranchLogoCard'
import { BranchIdentityForm } from './BranchIdentityForm'

interface BranchIdentityTabProps {
  settings: BranchSettings
  onChange: (fields: Partial<BranchSettings>) => void
  onSave: () => void
}

export function BranchIdentityTab({
  settings,
  onChange,
  onSave
}: BranchIdentityTabProps) {
  return (
    <div className="flex flex-col gap-space-lg w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <BranchLogoCard settings={settings} onChange={onChange} />
        <BranchIdentityForm
          settings={settings}
          onChange={onChange}
          onSave={onSave}
        />
      </div>
    </div>
  )
}
