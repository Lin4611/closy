import { Overlay } from '@/modules/common/components/Overlay'

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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 mx-auto w-full max-w-93.75">
      <button type="button" className="absolute inset-0 w-full" onClick={onClose} aria-label="close dialog">
        <Overlay />
      </button>

      <section className="absolute top-1/2 left-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white px-5 py-6 text-center shadow-[0_12px_36px_rgba(15,23,42,0.18)]">
        <h2 className="font-label-xl text-neutral-900">確定要刪除嗎？</h2>
        <p className="font-paragraph-sm mt-2 mb-5 text-neutral-500">刪除後將無法恢復所有資訊</p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="font-label-md h-12 w-full rounded-[14px] bg-danger-300 text-white"
          >
            刪除
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-label-md h-12 w-full rounded-[14px] border border-neutral-300 bg-white text-neutral-700"
          >
            取消
          </button>
        </div>
      </section>
    </div>
  )
}
