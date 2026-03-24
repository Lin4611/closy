type RecognitionSuccessToastProps = {
  open: boolean
  message?: string
}

export const RecognitionSuccessToast = ({
  open,
  message = '辨識成功！',
}: RecognitionSuccessToastProps) => {
  if (!open) return null

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-success-100 px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
      <p className="font-label-sm text-success-300">{message}</p>
    </div>
  )
}
