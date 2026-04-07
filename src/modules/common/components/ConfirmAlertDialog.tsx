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

type ConfirmAlertDialogProps = {
  open: boolean
  mode: 'confirm' | 'success'
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmAlertDialog = ({ open, mode, onConfirm, onClose }: ConfirmAlertDialogProps) => {
  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (mode === 'confirm') {
      event.preventDefault()
      onConfirm()
      return
    }

    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      {mode === 'confirm' ? (
        <AlertDialogContent className="flex h-[228px] w-[320px] flex-col gap-4 rounded-[20px] bg-white p-8 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-h4">確定要刪除嗎？</AlertDialogTitle>
            <AlertDialogDescription className="font-paragraph-sm text-neutral-600">
              刪除後將無法恢復所有資訊
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={onClose}
              variant={'ghost'}
              className="font-label-sm h-11 w-full justify-center rounded-[12px] border border-neutral-400 bg-white/10 text-neutral-800"
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionClick}
              variant={'ghost'}
              className="bg-danger-300 font-label-sm h-11 w-full justify-center rounded-[12px] text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent className="flex h-[140px] w-[250px] flex-col gap-4 rounded-[20px] bg-white p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-paragraph-md text-[#000000]">
              已刪除此件穿搭
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleActionClick}
              className="font-label-sm h-11 w-full justify-center rounded-[12px] border border-neutral-400 bg-white/10 text-neutral-800 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            >
              確定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
