import { SuccessAlertDialog } from '@/modules/common/components/SuccessAlertDialog'

type CalendarSuccessDialogProps = {
  open: boolean
  title: string
  onClose: () => void
  confirmButtonClassName?: string
}

export const CalendarSuccessDialog = ({
  open,
  title,
  onClose,
  confirmButtonClassName,
}: CalendarSuccessDialogProps) => {
  return (
    <SuccessAlertDialog
      open={open}
      title={title}
      confirmButtonClassName={confirmButtonClassName}
      onClose={onClose}
    />
  )
}
