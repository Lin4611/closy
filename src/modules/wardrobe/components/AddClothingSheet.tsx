import { useRouter } from 'next/router'

import { Overlay } from '@/modules/common/components/Overlay'

type AddClothingSheetProps = {
  open: boolean
  onClose: () => void
}

export const AddClothingSheet = ({ open, onClose }: AddClothingSheetProps) => {
  const router = useRouter()

  if (!open) return null

  const handleNavigate = () => {
    onClose()
    void router.push('/wardrobe/new/camera')
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto w-full max-w-93.75">
      <button type="button" className="absolute inset-0 w-full" onClick={onClose} aria-label="close sheet">
        <Overlay />
      </button>

      <section className="absolute right-0 bottom-0 left-0 rounded-t-[32px] bg-white px-6 pt-4 pb-8">
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-neutral-300" />
        <h2 className="font-label-xl mb-5 text-center text-neutral-900">選擇新增方式</h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleNavigate}
            className="font-label-md flex h-14 w-full items-center justify-center rounded-[16px] bg-neutral-100 text-neutral-900"
          >
            相機
          </button>
          <button
            type="button"
            onClick={handleNavigate}
            className="font-label-md flex h-14 w-full items-center justify-center rounded-[16px] bg-neutral-100 text-neutral-900"
          >
            從相簿上傳
          </button>
        </div>
      </section>
    </div>
  )
}
