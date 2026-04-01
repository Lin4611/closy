export const TextBubble = ({ text }: { text: string }) => {
  return (
    <div className="flex h-[36px] w-fit items-center gap-1 rounded-[20px] bg-white/80 px-3 py-1 backdrop-blur-xs">
      <span className="font-label-xl text-neutral-600">{text}</span>
    </div>
  )
}
