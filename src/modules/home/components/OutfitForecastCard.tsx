import { Sparkles } from 'lucide-react'
type OutfitForecastCardProps = {
  content: string
}
export const OutfitForecastCard = ({ content }: OutfitForecastCardProps) => {
  return (
    <section className="flex w-full max-w-[343px] flex-col items-start gap-2 rounded-[20px] border-[0.5px] border-neutral-300 bg-white p-4">
      <div className="flex w-full items-center justify-start gap-2 py-0.5">
        <span className="flex size-6 items-center justify-center">
          <Sparkles size={16} strokeWidth={1.5} />
        </span>
        <h3 className="font-label-xl text-neutral-800">穿搭預報</h3>
      </div>
      <p className="font-paragraph-sm text-neutral-800">{content}</p>
    </section>
  )
}
