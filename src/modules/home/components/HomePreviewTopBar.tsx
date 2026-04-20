import { getWeatherIconUrl, isDaytime } from '@/lib/weather'

import { AdjustOutfitButton } from './AdjustOutfitButton'
import { CalendarButton } from './CalendarButton'
import { WeatherSummaryCard } from './WeatherSummaryCard'
import { type Weather } from '../types/dayRecommendationTypes'
type HomePreviewTopBarProps = {
  expanded?: boolean
  disabled?: boolean
  weather?: Weather
  city?: string
  onClick?: () => void
  onCalendarClick?: () => void
}

export const HomePreviewTopBar = ({
  expanded = false,
  disabled = false,
  weather,
  city,
  onClick,
  onCalendarClick,
}: HomePreviewTopBarProps) => {
  return (
    <div className="absolute top-6 left-1/2 z-4 flex w-full max-w-85.75 -translate-x-1/2 items-start justify-between">
      <WeatherSummaryCard
        temperature={weather?.temperature ?? ''}
        conditionLabel={weather?.weather ?? ''}
        cityLabel={city ?? ''}
        iconSrc={getWeatherIconUrl(weather?.weatherCode ?? '01', isDaytime())}
      />
      <div className="flex flex-col gap-4">
        <AdjustOutfitButton onClick={onClick} expanded={expanded} disabled={disabled} />
        <CalendarButton onClick={onCalendarClick} />
      </div>
    </div>
  )
}
