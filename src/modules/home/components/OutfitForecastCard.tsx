import { Sparkles } from 'lucide-react'

export const OutfitForecastCard = () => {
  return (
    <section className="flex w-full max-w-[343px] flex-col items-start gap-2 rounded-[20px] bg-white p-4 shadow-[0px_4px_12px_0px_#18181B1F]">
      <div className="flex w-full items-center justify-start gap-2 py-0.5">
        <span className="flex size-6 items-center justify-center">
          <Sparkles size={16} strokeWidth={1.5} />
        </span>
        <h3 className="font-label-xl text-neutral-800">穿搭預報</h3>
      </div>
      <p className="font-paragraph-sm text-neutral-800">
        今天最高溫只有24度、早晚會冷，穿一件厚實不透風的牛仔外套當外搭，時尚又保暖！
      </p>
    </section>
  )
}
