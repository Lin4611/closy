import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'

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
    <ConfirmAlertDialog
      open={open}
      mode="success"
      title={title}
      confirmButtonClassName={confirmButtonClassName}
      onClose={onClose}
    />
  )
}
