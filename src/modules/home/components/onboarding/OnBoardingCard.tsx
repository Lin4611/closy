import { cn } from '@/lib/utils'

type OnBoardingCardProps = {
  title: string
  description: string
  step: number
  onClose?: () => void
  totalSteps: number
}

export const OnBoardingCard = ({
  title,
  description,
  step,
  onClose,
  totalSteps,
}: OnBoardingCardProps) => {
  return (
    <div className="inline-flex max-w-[288px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-[16px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col gap-1">
        <h4 className="font-h4">{title}</h4>
        <p className="font-paragraph-md whitespace-pre-line text-neutral-700">{description}</p>
      </div>
      <div className="flex w-full items-center justify-between gap-2.5">
        <span className="flex w-full items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((item: number) => (
            <span
              key={item}
              className={cn(
                'size-2 rounded-full',
                step === item ? 'bg-neutral-500' : 'bg-neutral-300',
              )}
            />
          ))}
        </span>
        {step === totalSteps && (
          <button
            type="button"
            className="bg-primary-800 font-label-sm w-20 cursor-pointer rounded-[12px] px-4 py-1.5 text-white"
            onClick={onClose}
          >
            關閉
          </button>
        )}
      </div>
    </div>
  )
}
