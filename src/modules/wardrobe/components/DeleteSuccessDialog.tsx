import { Overlay } from '@/modules/common/components/Overlay'

type DeleteSuccessDialogProps = {
  open: boolean
  onClose: () => void
}

export const DeleteSuccessDialog = ({ open, onClose }: DeleteSuccessDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 mx-auto w-full max-w-93.75">
      <button type="button" className="absolute inset-0 w-full" onClick={onClose} aria-label="close success dialog">
        <Overlay />
      </button>

      <section className="absolute top-1/2 left-1/2 w-70 -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white px-5 py-6 text-center shadow-[0_12px_36px_rgba(15,23,42,0.18)]">
        <p className="font-label-md mb-4 text-neutral-900">已刪除此件衣服</p>
        <button
          type="button"
          onClick={onClose}
          className="font-label-md h-11 w-full rounded-[12px] border border-neutral-300 bg-white text-neutral-700"
        >
          確定
        </button>
      </section>
    </div>
  )
}
