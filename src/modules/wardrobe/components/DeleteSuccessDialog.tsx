import { Overlay } from '@/modules/common/components/Overlay'

type DeleteSuccessDialogProps = {
  open: boolean
  onClose: () => void
}

export const DeleteSuccessDialog = ({ open, onClose }: DeleteSuccessDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 mx-auto w-full max-w-[375px]">
      <button
        type="button"
        className="absolute inset-0 w-full"
        onClick={onClose}
        aria-label="close success dialog"
      >
        <Overlay />
      </button>

      <section className="absolute top-1/2 left-1/2 w-[276px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-white px-5 py-7 text-center shadow-[0_8px_24px_rgba(15,23,42,0.18)]">
        <p className="mb-4 font-label-sm text-neutral-700">已刪除此件衣服</p>
        <button
          type="button"
          onClick={onClose}
          className="h-10 w-full rounded-[10px] border border-neutral-400 bg-white font-label-sm text-neutral-700"
        >
          確定
        </button>
      </section>
    </div>
  )
}