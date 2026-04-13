import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const CalendarOccasionChangeDialog = ({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="w-62.5 rounded-[20px] bg-white p-6">
        <AlertDialogHeader className="gap-2">
          <AlertDialogTitle className="font-paragraph-md text-black">已變更場合</AlertDialogTitle>
          <AlertDialogDescription className="font-paragraph-sm text-neutral-600">
            請重新選擇穿搭
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} variant="brand" className="h-11 rounded-[12px]">
            重新選擇
          </AlertDialogAction>
          <AlertDialogCancel onClick={onClose} variant="outline" className="h-11 rounded-[12px] border-neutral-400 bg-white text-neutral-800">
            取消
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
