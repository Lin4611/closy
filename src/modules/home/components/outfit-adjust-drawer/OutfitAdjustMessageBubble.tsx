import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type OutfitAdjustMessageBubbleProps = {
  text: string
  role: 'user' | 'assistant'
  status?: 'idle' | 'loading' | 'error'
}
export const OutfitAdjustMessageBubble = ({
  text,
  role,
  status,
}: OutfitAdjustMessageBubbleProps) => {
  const userClassName = 'bg-primary-800 text-white rounded-tr-none self-end'
  const assistantClassName = 'bg-neutral-100 text-neutral-800 rounded-bl-none self-start'
  const baseClassName = 'px-3 py-[15px] font-paragraph-md  rounded-[25px]'
  const isAssistantLoading = role === 'assistant' && status === 'loading'
  return (
    <div className={cn(baseClassName, role === 'user' ? userClassName : assistantClassName)}>
      {isAssistantLoading ? <Spinner /> : <p>{text}</p>}
    </div>
  )
}
