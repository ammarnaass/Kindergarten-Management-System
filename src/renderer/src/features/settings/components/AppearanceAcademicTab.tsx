import { AppearanceSettings } from '../types'
import { AcademicYearTermsCard } from './AcademicYearTermsCard'
import { ShiftsOperatingTimesCard } from './ShiftsOperatingTimesCard'
import { ThemeSelectionCard } from './ThemeSelectionCard'
import { TypographyDensityCard } from './TypographyDensityCard'
import { RegionalLocalizationCard } from './RegionalLocalizationCard'
import { LiveCustomizationPreviewCard } from './LiveCustomizationPreviewCard'

interface AppearanceAcademicTabProps {
  settings: AppearanceSettings
  onChange: (fields: Partial<AppearanceSettings>) => void
  onRollForward: () => void
}

export function AppearanceAcademicTab({
  settings,
  onChange,
  onRollForward
}: AppearanceAcademicTabProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg w-full items-start">
      {/* Column 1: Academic Year & Shifts Management (4 cols) */}
      <div className="xl:col-span-4 flex flex-col gap-space-lg">
        <AcademicYearTermsCard
          settings={settings}
          onChange={onChange}
          onRollForward={onRollForward}
        />
        <ShiftsOperatingTimesCard settings={settings} onChange={onChange} />
      </div>

      {/* Column 2: Appearance & Desktop Theme (4 cols) */}
      <div className="xl:col-span-4 flex flex-col gap-space-lg">
        <ThemeSelectionCard settings={settings} onChange={onChange} />
        <TypographyDensityCard settings={settings} onChange={onChange} />
      </div>

      {/* Column 3: Localization & Live Preview (4 cols) */}
      <div className="xl:col-span-4 flex flex-col gap-space-lg">
        <RegionalLocalizationCard settings={settings} onChange={onChange} />
        <LiveCustomizationPreviewCard />
      </div>
    </div>
  )
}
