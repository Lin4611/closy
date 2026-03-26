import { CalendarSummaryCard } from './CalendarSummaryCard'
import { OutfitForecastCard } from './OutfitForecastCard'

export const HomeInsightsSection = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-6 pt-7 pb-9">
      <CalendarSummaryCard />
      <OutfitForecastCard />
    </section>
  )
}
