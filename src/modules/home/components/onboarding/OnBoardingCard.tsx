import { cn } from '@/lib/utils'

type OnBoardingCardProps = {
  title: string
  description: string
  step: number
  onClose?: () => void
}

export const OnBoardingCard = ({ title, description, step, onClose }: OnBoardingCardProps) => {
  return (
    <div className="inline-flex max-w-[288px] flex-col items-center justify-center gap-2.5 rounded-[16px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col gap-1">
        <h4 className="font-h4">{title}</h4>
        <p className="font-paragraph-md whitespace-pre-line text-neutral-700">{description}</p>
      </div>
      <span className="flex items-center justify-center gap-2">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((item: number) => (
          <span
            key={item}
            className={cn(
              'size-2 rounded-full',
              step === item ? 'bg-neutral-500' : 'bg-neutral-300',
            )}
          />
        ))}
        {step === 6 && (
          <button
            type="button"
            className="bg-primary-800 h-[27px] w-[52px] rounded-[12px] px-4 py-1.5 text-[10px] font-bold text-white"
            onClick={onClose}
          >
            關閉
          </button>
        )}
      </span>
    </div>
  )
}
