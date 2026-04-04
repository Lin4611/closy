import { useState } from 'react'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useAppSelector } from '@/store/hooks'

import { MessageComposer } from './MessageComposer'
import { QuickAdjustOptions } from './QuickAdjustOptions'
type OutfitAdjustDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dismissible?: boolean
  context?: string
  outfitImageUrl: string
  outfitId: string
}
export const OutfitAdjustDrawer = ({
  open,
  onOpenChange,
  dismissible = true,
}: OutfitAdjustDrawerProps) => {
  const [message, setMessage] = useState('')
  const [count, setCount] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const name = useAppSelector((state) => state.user.user?.name)
  const isComposerDisabled = isSubmitting || count <= 0
  const handleUpdateCount = () => {
    if (count <= 0) return
    setCount((prev) => prev - 1)
  }
  const handleSubmit = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || count <= 0) return
    setIsSubmitting(true)
    console.log(trimmedMessage)
    handleUpdateCount()
    setMessage('')
    setIsSubmitting(false)
  }
  const handleVoiceInput = () => {
    console.log('voice input')
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={dismissible}>
      <DrawerContent className="mx-auto h-[600px] w-full max-w-[375px] gap-10 rounded-t-[40px] border-none bg-[#FFFEFE] px-4 pb-10 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center justify-center text-center">
          <h4 className="font-h4 text-neutral-800">{name}</h4>
          <p className="font-h3 text-neutral-800">今天的穿搭需要調整嗎？</p>
        </div>
        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
          <QuickAdjustOptions />
        </div>
        <div className="flex flex-col items-center gap-4">
          <MessageComposer
            value={message}
            onChange={setMessage}
            onSubmit={handleSubmit}
            onVoiceInput={handleVoiceInput}
            disabled={isComposerDisabled}
          />
          <span className="font-paragraph-xs text-neutral-500">
            {count > 0 ? `今天還可以調整${count}次` : '今日調整次數已達上限'}
          </span>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
