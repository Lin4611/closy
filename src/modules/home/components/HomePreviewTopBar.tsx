import { AdjustOutfitButton } from './AdjustOutfitButton'
import { CalendarButton } from './CalendarButton'
import { WeatherSummaryCard } from './WeatherSummaryCard'
type HomePreviewTopBarProps = {
  expanded?: boolean
  disabled?: boolean
  onClick?: () => void
  onCalendarClick?: () => void
}

export const HomePreviewTopBar = ({
  expanded = false,
  disabled = false,
  onClick,
  onCalendarClick,
}: HomePreviewTopBarProps) => {
  return (
    <div className="absolute top-6 left-1/2 z-4 flex w-full max-w-85.75 -translate-x-1/2 items-start justify-between">
      <WeatherSummaryCard
        temperature={22}
        conditonLabel="多雲時晴"
        CityLabel="高雄市"
        iconSrc="https://openweathermap.org/img/wn/02d@2x.png"
      />
      <div className="flex flex-col gap-4">
        <AdjustOutfitButton onClick={onClick} expanded={expanded} disabled={disabled} />
        <CalendarButton onClick={onCalendarClick} />
      </div>
    </div>
  )
}
