import Image from 'next/image'

type WeatherSummaryCardProps = {
  temperature: string
  conditionLabel: string
  cityLabel: string
  iconSrc: string
}

export const WeatherSummaryCard = ({
  temperature,
  conditionLabel,
  cityLabel,
  iconSrc,
}: WeatherSummaryCardProps) => {
  return (
    <section className="flex w-full max-w-15 flex-col items-start justify-center gap-5 px-0.5">
      <div className="flex w-full flex-col items-center justify-between">
        <Image src={iconSrc} alt={conditionLabel} width={40} height={40} />
        <p className="font-paragraph-sm text-neutral-800">{conditionLabel}</p>
      </div>
      <div className="flex w-full flex-col items-start gap-2 px-[3px]">
        <p className="font-h3">{temperature ? `${temperature}°` : '--'}</p>
        <p className="font-paragraph-sm text-neutral-800">{cityLabel}</p>
      </div>
    </section>
  )
}
