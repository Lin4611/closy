import { Camera, Images } from 'lucide-react'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Overlay } from '@/modules/common/components/Overlay'

type AddClothingSheetProps = {
  open: boolean
  onClose: () => void
}

export const AddClothingSheet = ({ open, onClose }: AddClothingSheetProps) => {
  const router = useRouter()

  if (!open) return null

  const handleNavigateCamera = () => {
    onClose()
    void router.push('/wardrobe/new/camera')
  }

  const handleNavigateAlbum = () => {
    onClose()
    void router.push('/wardrobe/new/album')
  }

  return (
    <div className="fixed inset-0 z-60 mx-auto w-full max-w-93.75">
      <button
        type="button"
        className="absolute inset-0 w-full"
        onClick={onClose}
        aria-label="close sheet"
      >
        <Overlay />
      </button>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-clothing-sheet-title"
        className="absolute right-0 bottom-0 left-0 rounded-t-[28px] bg-white px-6 pt-6 pb-8 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]"
      >
        <h2 id="add-clothing-sheet-title" className="mb-5 text-center font-label-xxl text-neutral-900">
          選擇新增方式
        </h2>
        <div className="space-y-3">
          <Button type="button" variant="outline" size="lg" className="h-12 w-full rounded-[10px]" onClick={handleNavigateCamera}>
            <Camera className="size-4" />
            相機
          </Button>
          <Button type="button" variant="outline" size="lg" className="h-12 w-full rounded-[10px]" onClick={handleNavigateAlbum}>
            <Images className="size-4" />
            從相簿上傳
          </Button>
        </div>
      </section>
    </div>
  )
}
