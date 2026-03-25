import { ResultDialog } from '@/modules/common/components/feedback/ResultDialog'

type DeleteSuccessDialogProps = {
  open: boolean
  onClose: () => void
}

export const DeleteSuccessDialog = ({ open, onClose }: DeleteSuccessDialogProps) => {
  return (
    <ResultDialog
      open={open}
      message="已刪除此件衣服"
      confirmText="確定"
      onConfirm={onClose}
      ariaLabel="close success dialog"
    />
  )
}