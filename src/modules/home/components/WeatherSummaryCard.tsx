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
    <section className="flex h-16 w-full max-w-[124px] flex-col items-center justify-center rounded-[16px] bg-white px-[11px] py-1 shadow-[0px_4px_12px_0px_#18181B1F]">
      <div className="flex w-full items-center justify-between">
        <Image src={iconSrc} alt={conditonLabel} width={36} height={36} />
        <p className="font-h3">{temperature}°C</p>
      </div>
      <div className="flex w-full items-center justify-between px-[5px]">
        <p className="font-paragraph-xs text-neutral-500">{conditonLabel}</p>
        <p className="font-paragraph-xs text-neutral-800">{CityLabel}</p>
      </div>
    </section>
  )
}
