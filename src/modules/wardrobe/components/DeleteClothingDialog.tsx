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
    <div className="fixed inset-0 z-50 mx-auto w-full max-w-[375px]">
      <button
        type="button"
        className="absolute inset-0 w-full"
        onClick={onClose}
        aria-label="close dialog"
      >
        <Overlay />
      </button>

      <section className="absolute top-1/2 left-1/2 w-[304px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-white px-5 pt-5 pb-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.18)]">
        <h2 className="font-label-xl text-neutral-900">確定要刪除嗎？</h2>
        <p className="mt-2 mb-5 font-paragraph-sm text-neutral-600">刪除後將無法恢復所有資訊</p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 w-full rounded-[8px] bg-danger-300 font-label-sm text-white"
          >
            刪除
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-[8px] border border-neutral-400 bg-white font-label-sm text-neutral-700"
          >
            取消
          </button>
        </div>
      </section>
    </div>
  )
}