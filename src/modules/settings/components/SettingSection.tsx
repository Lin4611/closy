import { OccasionSettingCard } from './OccasionSettingCard'
import { PreferenceSettingCard } from './PreferenceSettingsCard'

type SettingSectionProps = {
  defaultOccasion: string
  defaultStyle: string[]
  defaultColor: string[]
}

export const SettingSection = ({
  defaultOccasion,
  defaultStyle,
  defaultColor,
}: SettingSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      <OccasionSettingCard defaultOccasion={defaultOccasion} />
      <PreferenceSettingCard defaultStyle={defaultStyle} defaultColor={defaultColor} />
    </div>
  )
}
