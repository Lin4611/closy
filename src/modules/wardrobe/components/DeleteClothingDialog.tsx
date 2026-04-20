import { AlertDialog } from '@/modules/common/components/overlay/AlertDialog'

type DeleteClothingDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteClothingDialog = ({
  open,
  onClose,
  onConfirm,
}: DeleteClothingDialogProps) => {
  return (
    <AlertDialog
      open={open}
      title="確定要刪除嗎？"
      description="刪除後將無法恢復所有資訊"
      confirmText="刪除"
      cancelText="取消"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  )
}