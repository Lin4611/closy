import { useEffect, useState } from 'react'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useAppSelector } from '@/store/hooks'

import { MessageComposer } from './MessageComposer'
import { OutfitAdjustChat } from './OutfitAdjustChat'
import { OutfitAdjustLoadingView } from './OutfitAdjustLoadingView'
import { OutfitAdjustResultView } from './OutfitAdjustResultView'
import { QuickAdjustOptions } from './QuickAdjustOptions'
import type { OutfitAdjustChatMessage } from '../../types/outfitAdjustChat'

type OutfitAdjustDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dismissible?: boolean
  context?: string
  outfitImageUrl: string
  outfitId: string
}
type DrawerMode = 'initial' | 'chat' | 'loading' | 'result'
type OutfitAdjustCountStorage = {
  date: string
  remainingCount: number
}

const DAILY_OUTFIT_ADJUST_LIMIT = 3
const OUTFIT_ADJUST_COUNT_STORAGE_KEY = 'closy:outfit-adjust-daily-count'

const getTodayStorageDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getInitialCount = (): number => {
  try {
    const stored = window.localStorage.getItem(OUTFIT_ADJUST_COUNT_STORAGE_KEY)
    if (!stored) return DAILY_OUTFIT_ADJUST_LIMIT

    const parsed = JSON.parse(stored) as OutfitAdjustCountStorage
    if (parsed.date !== getTodayStorageDate()) return DAILY_OUTFIT_ADJUST_LIMIT

    return parsed.remainingCount
  } catch {
    return DAILY_OUTFIT_ADJUST_LIMIT
  }
}

export const OutfitAdjustDrawer = ({
  open,
  onOpenChange,
  dismissible = true,
  outfitImageUrl,
  outfitId,
}: OutfitAdjustDrawerProps) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<OutfitAdjustChatMessage[]>([])

  const [mode, setMode] = useState<DrawerMode>('initial')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [count, setCount] = useState<number | null>(null)

  const name = useAppSelector((state) => state.user.user?.name)
  const isComposerDisabled = isSubmitting || count === null || count <= 0

  useEffect(() => {
    setCount(getInitialCount())
  }, [])

  useEffect(() => {
    if (count === null) return
    const payload: OutfitAdjustCountStorage = {
      date: getTodayStorageDate(),
      remainingCount: count,
    }
    window.localStorage.setItem(OUTFIT_ADJUST_COUNT_STORAGE_KEY, JSON.stringify(payload))
  }, [count])

  const resetDrawerState = () => {
    setMessage('')
    setMessages([])
    setMode('initial')
    setIsSubmitting(false)
  }

  const submitPrompt = async (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) return
    if (count === null || count <= 0) return
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

    setMode('chat')
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
      setTimeout(() => {
        setMode('loading')
        setTimeout(() => {
          setMode('result')
        }, 2000)
      }, 2000)

      // 模擬打完後跳轉
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
    if (count === null || count <= 0) return
    setCount((prev) => (prev ?? 0) - 1)
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

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetDrawerState()
    }

    onOpenChange(nextOpen)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} dismissible={dismissible}>
      <DrawerContent className="mx-auto h-[666px] w-full max-w-[375px] gap-10 rounded-t-[40px] border-none bg-[#FFFEFE] px-4 pb-10 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
        {mode === 'initial' && (
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
        {mode === 'chat' && <OutfitAdjustChat messages={messages} />}
        {mode === 'loading' && <OutfitAdjustLoadingView />}
        {mode === 'result' && <OutfitAdjustResultView />}
        {mode !== 'result' && mode !== 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <MessageComposer
              value={message}
              onChange={setMessage}
              onSubmit={handleSubmit}
              onVoiceInput={handleVoiceInput}
              disabled={isComposerDisabled}
            />
            <span className="font-paragraph-xs text-neutral-500">
              {count === null
                ? null
                : count > 0
                  ? `今天還可以調整${count}次`
                  : '今日調整次數已達上限'}
            </span>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
