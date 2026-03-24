import SpeechBubble from "@/modules/common/components/SpeechBubble"

export const WardrobeEmptyState = () => {
  return (
    <section className="flex min-h-[calc(100vh-240px)] flex-col px-6">
      <div className="flex flex-1 items-center justify-center">
        <p className="font-label-xl text-neutral-600">尚未新增衣服</p>
      </div>

      <SpeechBubble className="absolute left-21 bottom-0.75">點選+號開始新增衣物</SpeechBubble>
    </section>
  )
}