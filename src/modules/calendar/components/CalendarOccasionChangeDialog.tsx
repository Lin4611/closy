import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'

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
    <ConfirmAlertDialog
      open={open}
      mode="confirm"
      title="已變更場合"
      description="請重新選擇穿搭"
      confirmLabel="重新選擇"
      confirmButtonClassName="bg-primary-800 text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
      hideCancel
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
