import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'

type SuccessAlertDialogProps = {
  open: boolean
  title: string
  onClose: () => void
  confirmLabel?: string
  confirmButtonClassName?: string
}

export const SuccessAlertDialog = ({
  open,
  title,
  onClose,
  confirmLabel,
  confirmButtonClassName,
}: SuccessAlertDialogProps) => {
  return (
    <ConfirmAlertDialog
      open={open}
      mode="success"
      title={title}
      confirmLabel={confirmLabel}
      confirmButtonClassName={confirmButtonClassName}
      onClose={onClose}
    />
  )
}
