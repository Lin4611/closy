import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { updateOccasion } from '@/modules/common/api/occasion'
import type { Occasion } from '@/modules/common/types/occasion'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUserOccasion } from '@/store/slices/userSlice'

import { DaySwitch } from './DaySwitch'
import { OccasionSelect } from './OccasionSelect'
type HomeFilterBarProps = {
  className?: string
  onDayChange?: (day: 'today' | 'tomorrow') => void
  onOccasionChange?: () => void
}

export const HomeFilterBar = ({ className, onDayChange, onOccasionChange }: HomeFilterBarProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedOccasion = useAppSelector((state) => state.user.user?.preferences.occasions ?? '')
  const dispatch = useAppDispatch()
  const handleOccasionChange = async (value: string) => {
    if (isSubmitting || value === selectedOccasion) return

    try {
      setIsSubmitting(true)
      await updateOccasion(value as Occasion)
      dispatch(updateUserOccasion(value as Occasion))
      onOccasionChange?.()
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新場合失敗，請稍後再試')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div
      className={cn(
        'flex h-16 items-center justify-between bg-white px-4 py-[10.5px] shadow-[0px_1px_3px_0px_#18181B0D]',
        className,
      )}
    >
      <DaySwitch onDayChange={onDayChange} />
      <div id="occasion-trigger">
        <OccasionSelect value={selectedOccasion} onValueChange={handleOccasionChange} />
      </div>
    </div>
  )
}
