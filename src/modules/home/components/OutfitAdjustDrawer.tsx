import { useState } from 'react'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useAppSelector } from '@/store/hooks'

import { MessageComposer } from './MessageComposer'
import { OutfitAdjustChat } from './OutfitAdjustChat'
import { QuickAdjustOptions } from './QuickAdjustOptions'
import type { OutfitAdjustChatMessage } from '../types/outfitAdjustChat'

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
  const [messages, setMessages] = useState<OutfitAdjustChatMessage[]>([])
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [count, setCount] = useState(3)

  const name = useAppSelector((state) => state.user.user?.name)
  const isComposerDisabled = isSubmitting || count <= 0

  const submitPrompt = async (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) return
    if (count <= 0) return
    if (isSubmitting) return

    const userMessage: OutfitAdjustChatMessage = {
      id: `user-${Date.now()}`,
      text: trimmed,
      role: 'user',
      status: 'idle',
    }

    const loadingMessage: OutfitAdjustChatMessage = {
      id: `assistant-${Date.now()}`,
      text: '好的，我將為您調整今天的穿搭',
      role: 'assistant',
      status: 'idle',
    }

    setIsChatStarted(true)
    setIsSubmitting(true)

    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setMessage('')
    handleUpdateCount()

    try {
      // 之後 API ready 時放這裡
      // const response = await submitOutfitAdjust(...)
      // const aiText = response.message

      const aiText = '好的，我將為您調整今天的穿搭'

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                text: aiText,
                status: 'idle',
              }
            : msg,
        ),
      )
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                text: '調整失敗，請稍後再試',
                status: 'error',
              }
            : msg,
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleUpdateCount = () => {
    if (count <= 0) return
    setCount((prev) => prev - 1)
  }

  const handleQuickOptionClick = (option: string) => {
    submitPrompt(option)
  }

  const handleSubmit = () => {
    submitPrompt(message)
  }

  const handleVoiceInput = () => {
    console.log('voice input')
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={dismissible}>
      <DrawerContent className="mx-auto h-[600px] w-full max-w-[375px] gap-10 rounded-t-[40px] border-none bg-[#FFFEFE] px-4 pb-10 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
        {isChatStarted ? (
          <OutfitAdjustChat messages={messages} />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center text-center">
              <h4 className="font-h4 text-neutral-800">{name}</h4>
              <p className="font-h3 text-neutral-800">今天的穿搭需要調整嗎？</p>
            </div>
            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
              <QuickAdjustOptions onSelectOption={handleQuickOptionClick} />
            </div>
          </>
        )}
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
