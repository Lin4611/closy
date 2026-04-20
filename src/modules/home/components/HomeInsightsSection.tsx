import { OutfitForecastCard } from './OutfitForecastCard'
type HomeInsightsSectionProps = {
  content?: string
}
export const HomeInsightsSection = ({
  content = '您還未新增任何衣物',
}: HomeInsightsSectionProps) => {
  return (
    <section className="flex flex-col items-center justify-center pt-7 pb-9">
      <OutfitForecastCard content={content} />
    </section>
  )
}
