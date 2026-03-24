import SpeechBubble from '@/modules/common/components/SpeechBubble'

export const WardrobeEmptyState = () => {
  return (
    <section className="flex min-h-[calc(100vh-220px)] flex-col px-6 pb-20">
      <div className="flex flex-1 items-center justify-center">
        <p className="font-label-xl text-neutral-700">尚未新增衣服</p>
      </div>

      <div className="flex justify-center pb-2">
        <SpeechBubble>點選+號開始新增衣物</SpeechBubble>
      </div>
    </section>
  )
}