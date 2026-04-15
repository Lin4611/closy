import SpeechBubble from '@/modules/common/components/SpeechBubble'

export const WardrobeEmptyState = () => {
  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-24">
      <div className="flex flex-1 items-center justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="font-label-xl text-neutral-600">尚未新增衣服</p>
      </div>

      <div className="pointer-events-none fixed bottom-19 left-1/2 z-50 -translate-x-1/2">
        <SpeechBubble className="whitespace-nowrap">點選+號開始新增衣物</SpeechBubble>
      </div>
    </section>
  )
}
