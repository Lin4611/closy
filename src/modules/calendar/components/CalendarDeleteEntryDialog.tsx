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

export const CalendarDeleteEntryDialog = ({
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
      <AlertDialogContent className="w-[320px] rounded-[20px] bg-white p-8">
        <AlertDialogHeader className="gap-2">
          <AlertDialogTitle className="font-h4 text-black">確定要刪除嗎？</AlertDialogTitle>
          <AlertDialogDescription className="font-paragraph-sm text-neutral-500">
            刪除後將無法恢復所有資訊
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} variant="default" className="h-11 rounded-[12px] bg-[#E35D59] text-white">
            刪除
          </AlertDialogAction>
          <AlertDialogCancel onClick={onClose} variant="outline" className="h-11 rounded-[12px] border-neutral-400 bg-white text-neutral-800">
            取消
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
