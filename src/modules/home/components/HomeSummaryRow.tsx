import { WeatherSummaryCard } from './WeatherSummaryCard'

export const HomeSummaryRow = () => {
  return (
    <section className="flex items-center justify-between">
      <WeatherSummaryCard
        temperature={25}
        conditonLabel="多雲時晴"
        CityLabel="高雄市"
        iconSrc="https://openweathermap.org/img/wn/02d@2x.png"
      />
    </section>
  )
}
