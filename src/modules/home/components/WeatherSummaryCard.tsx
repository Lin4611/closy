import Image from 'next/image'

type WeatherSummaryCardProps = {
  temperature: number
  conditonLabel: string
  CityLabel: string
  iconSrc: string
}

export const WeatherSummaryCard = ({
  temperature,
  conditonLabel,
  CityLabel,
  iconSrc,
}: WeatherSummaryCardProps) => {
  return (
    <section className="flex h-33.75 w-full max-w-15 flex-col items-start justify-between px-0.5">
      <div className="flex w-full flex-col items-center justify-between">
        <Image src={iconSrc} alt={conditonLabel} width={40} height={40} />
        <p className="font-paragraph-sm text-neutral-800">{conditonLabel}</p>
      </div>
      <div className="flex w-full flex-col items-start justify-between px-[3px]">
        <p className="font-h3">{temperature}°</p>
        <p className="font-paragraph-sm text-neutral-800">{CityLabel}</p>
      </div>
    </section>
  )
}
