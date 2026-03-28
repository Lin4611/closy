import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { GuideToolTip } from '@/modules/guide/components/GuideToolTip'

type AddClothingDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCameraClick?: () => void
  onAlbumClick?: () => void
  dismissible?: boolean
  context?: string
}

export const AddClothingDrawer = ({
  open,
  onOpenChange,
  onCameraClick,
  onAlbumClick,
  dismissible = false,
  context,
}: AddClothingDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={dismissible}>
      <DrawerContent className="mx-auto h-[300px] w-full max-w-[375px] rounded-t-[40px] border-none bg-[#FFFEFE] px-6 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
        <div className="flex justify-center py-4">
          <span className="h-[2.5px] w-15 rounded-full bg-neutral-300" />
        </div>

        <DrawerTitle className="font-h3 text-center text-neutral-900">選擇新增方式</DrawerTitle>
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 rounded-t-[40px] bg-[#191B23]/50"
        />

        <div className="absolute top-[32px] left-1/2 z-30 max-w-[248px] -translate-x-1/2">
          <GuideToolTip text={context || '請選擇新增方式'} side="top" />
        </div>

        <div className="relative z-20 flex flex-col gap-5 pt-10">
          <button
            type="button"
            onClick={onCameraClick}
            className="font-label-xl bg-primary-200 flex h-[53px] w-full items-center justify-center rounded-[12px] text-neutral-800"
          >
            相機
          </button>

          <button
            type="button"
            onClick={onAlbumClick}
            className="font-label-xl bg-primary-200 flex h-[53px] w-full items-center justify-center rounded-[12px] text-neutral-800"
          >
            從相簿上傳
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
