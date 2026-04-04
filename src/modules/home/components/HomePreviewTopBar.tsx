import { AdjustOutfitButton } from './AdjustOutfitButton'
import { WeatherSummaryCard } from './WeatherSummaryCard'
type HomePreviewTopBarProps = {
  expanded?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const HomePreviewTopBar = ({
  expanded = false,
  disabled = false,
  onClick,
}: HomePreviewTopBarProps) => {
  return (
    <div className="absolute top-6 left-1/2 z-4 flex w-full max-w-[343px] -translate-x-1/2 items-start justify-between">
      <WeatherSummaryCard
        temperature={22}
        conditonLabel="多雲時晴"
        CityLabel="高雄市"
        iconSrc="https://openweathermap.org/img/wn/02d@2x.png"
      />
      <AdjustOutfitButton onClick={onClick} expanded={expanded} disabled={disabled} />
    </div>
  )
}
