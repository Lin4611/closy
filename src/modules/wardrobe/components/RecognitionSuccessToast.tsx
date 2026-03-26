import { Toast } from '@/modules/common/components/feedback/Toast'

type RecognitionSuccessToastProps = {
  open: boolean
  message?: string
}

export const RecognitionSuccessToast = ({
  open,
  message = '辨識成功！',
}: RecognitionSuccessToastProps) => {
  return <Toast open={open} message={message} tone="success" />
}