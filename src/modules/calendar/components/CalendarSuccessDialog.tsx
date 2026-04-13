import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const CalendarSuccessDialog = ({
  open,
  title,
  onClose,
}: {
  open: boolean
  title: string
  onClose: () => void
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="w-62.5 rounded-[20px] bg-white p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-paragraph-md text-black">{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} variant="outline" className="h-11 rounded-[12px] border-neutral-400 bg-white text-neutral-800">
            確認
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
