import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'

export const CalendarSuccessDialog = ({
  open,
  title,
  onClose,
}: {
  open: boolean
  title: string
  onClose: () => void
}) => {
  return <ConfirmAlertDialog open={open} mode="success" title={title} onClose={onClose} />
}
