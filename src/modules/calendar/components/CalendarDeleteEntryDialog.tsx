import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'

export const CalendarDeleteEntryDialog = ({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}) => {
  return <ConfirmAlertDialog open={open} mode="confirm" onConfirm={onConfirm} onClose={onClose} />
}
