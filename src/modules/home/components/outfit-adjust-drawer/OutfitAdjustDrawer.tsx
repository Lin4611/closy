import { useEffect, useState } from 'react'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { getAdjustQuota } from '@/modules/home/api/adjustQuota'
import { streamOutfitAdjust } from '@/modules/home/api/adjustStream'
import type { ClothingItem } from '@/modules/home/types/dayRecommendationTypes'
import { useAppSelector } from '@/store/hooks'

import { MessageComposer } from './MessageComposer'
import { OutfitAdjustChat } from './OutfitAdjustChat'
import { OutfitAdjustLoadingView } from './OutfitAdjustLoadingView'
import { OutfitAdjustResultView } from './OutfitAdjustResultView'
import { QuickAdjustOptions } from './QuickAdjustOptions'
import type { AdjustStreamResult, OutfitAdjustChatMessage } from '../../types/outfitAdjustChat'

type OutfitAdjustDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dismissible?: boolean
  outfitImageUrl: string
  selectedItems: ClothingItem[]
  day: string
  onConfirmAdjust: (result: AdjustStreamResult) => void
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
  selectedItems,
  day,
  onConfirmAdjust,
}: OutfitAdjustDrawerProps) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<OutfitAdjustChatMessage[]>([])
  const [mode, setMode] = useState<DrawerMode>('initial')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [result, setResult] = useState<AdjustStreamResult | null>(null)

  const name = useAppSelector((state) => state.user.user?.name)
  const isComposerDisabled = isSubmitting || count === null || count <= 0

  useEffect(() => {
    setCount(getInitialCount())
  }, [])

  useEffect(() => {
    if (!open) return
    getAdjustQuota()
      .then((quota) => setCount(quota.remaining))
      .catch(() => {})
  }, [open])

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
    setResult(null)
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

    const step1MessageId = `assistant-step1-${Date.now()}`
    const step1Message: OutfitAdjustChatMessage = {
      id: step1MessageId,
      text: '',
      role: 'assistant',
      status: 'loading',
    }

    setMode('chat')
    setIsSubmitting(true)
    setMessages((prev) => [...prev, userMessage, step1Message])
    setMessage('')
    setCount((prev) => (prev ?? 0) - 1)

    try {
      await streamOutfitAdjust(
        { prompt: trimmed, originalImageUrl: outfitImageUrl, day, selectedItems },
        {
          onStep1: (text) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === step1MessageId ? { ...msg, text, status: 'idle' } : msg,
              ),
            )
          },
          onStep2: (text) => {
            setMessages((prev) => [
              ...prev,
              {
                id: `assistant-step2-${Date.now()}`,
                text,
                role: 'assistant',
                status: 'idle',
              },
            ])
            setMode('loading')
          },
          onCompleted: (data) => {
            setResult(data)
            setMode('result')
          },
          onError: (message) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === step1MessageId ? { ...msg, text: message, status: 'error' } : msg,
              ),
            )
          },
        },
      )
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === step1MessageId
            ? { ...msg, text: '調整失敗，請稍後再試', status: 'error' }
            : msg,
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
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
    if (!nextOpen) resetDrawerState()
    onOpenChange(nextOpen)
  }

  const handleConfirm = () => {
    if (!result) return
    onConfirmAdjust(result)
    onOpenChange(false)
    resetDrawerState()
  }

  const handleRevert = () => {
    onOpenChange(false)
    resetDrawerState()
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} dismissible={dismissible}>
      <DrawerContent className="mx-auto h-166.5 w-full max-w-93.75 gap-10 rounded-t-[40px] border-none bg-[#FFFEFE] px-4 pb-10 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
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
        {mode === 'result' && result && (
          <OutfitAdjustResultView
            result={result}
            onConfirm={handleConfirm}
            onRevert={handleRevert}
          />
        )}
        {mode !== 'loading' && mode !== 'result' && (
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
