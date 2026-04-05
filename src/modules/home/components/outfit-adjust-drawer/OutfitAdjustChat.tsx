import { OutfitAdjustMessageBubble } from './OutfitAdjustMessageBubble'
import type { OutfitAdjustChatMessage } from '../../types/outfitAdjustChat'
type OutfitAdjustChatProps = {
  messages: OutfitAdjustChatMessage[]
}
export const OutfitAdjustChat = ({ messages }: OutfitAdjustChatProps) => {
  return (
    <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto">
      {messages.map((message) => (
        <OutfitAdjustMessageBubble
          key={message.id}
          text={message.text}
          role={message.role}
          status={message.status}
        />
      ))}
    </div>
  )
}
