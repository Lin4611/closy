import type { MouseEvent } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type ConfirmAlertDialogProps = {
  open: boolean
  mode: 'confirm' | 'success' | 'settingSuccess'
  onConfirm?: () => void
  onClose?: () => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmButtonClassName?: string
  hideCancel?: boolean
  contentClassName?: string
  headerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  footerClassName?: string
}

const modeConfig = {
  confirm: {
    title: '確定要刪除嗎？',
    description: '刪除後將無法恢復所有資訊',
    confirmLabel: '刪除',
    cancelLabel: '取消',
    confirmButtonClassName: 'bg-danger-300 text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
  },
  success: {
    title: '已刪除此件穿搭',
    description: '',
    confirmLabel: '確定',
    cancelLabel: '取消',
    confirmButtonClassName: 'bg-white/10 text-neutral-800 border border-neutral-400',
  },
  settingSuccess: {
    title: '設定成功',
    description: '',
    confirmLabel: '確定',
    cancelLabel: '取消',
    confirmButtonClassName: 'bg-primary-800 text-white',
  },
} as const

export const ConfirmAlertDialog = ({
  open,
  mode,
  onConfirm,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmButtonClassName,
  hideCancel = false,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
}: ConfirmAlertDialogProps) => {
  const resolvedTitle = title ?? modeConfig[mode].title
  const resolvedDescription = description ?? modeConfig[mode].description
  const resolvedConfirmLabel = confirmLabel ?? modeConfig[mode].confirmLabel
  const resolvedCancelLabel = cancelLabel ?? modeConfig[mode].cancelLabel
  const resolvedConfirmButtonClassName = confirmButtonClassName ?? modeConfig[mode].confirmButtonClassName

  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (mode === 'confirm') {
      event.preventDefault()
      onConfirm?.()
      return
    }

    onClose?.()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      {mode === 'confirm' ? (
        <AlertDialogContent
          className={cn(
            'flex h-57 w-[320px] flex-col gap-4 rounded-[20px] bg-white p-8 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]',
            contentClassName,
          )}
        >
          <AlertDialogHeader className={headerClassName}>
            <AlertDialogTitle className={cn('font-h4', titleClassName)}>{resolvedTitle}</AlertDialogTitle>
            {resolvedDescription ? (
              <AlertDialogDescription className={cn('font-paragraph-sm text-neutral-600', descriptionClassName)}>
                {resolvedDescription}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>

          <AlertDialogFooter className={footerClassName}>
            {!hideCancel ? (
              <AlertDialogCancel
                onClick={onClose}
                variant={'default'}
                className="font-label-sm h-11 w-full justify-center rounded-[12px] border border-neutral-400 bg-white/10 text-neutral-800"
              >
                {resolvedCancelLabel}
              </AlertDialogCancel>
            ) : null}
            <AlertDialogAction
              onClick={handleActionClick}
              variant={'default'}
              className={cn(
                'font-label-sm h-11 w-full justify-center rounded-[12px]',
                resolvedConfirmButtonClassName,
              )}
            >
              {resolvedConfirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent className="flex h-35 w-62.5 flex-col gap-4 rounded-[20px] bg-white p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-paragraph-md text-neutral-900">
              {resolvedTitle}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleActionClick}
              className={cn(
                'font-label-sm h-11 w-full justify-center rounded-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
                resolvedConfirmButtonClassName,
              )}
            >
              {resolvedConfirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
