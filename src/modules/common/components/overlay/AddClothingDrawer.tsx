import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'

type AddClothingDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCameraClick?: () => void
  onAlbumClick?: () => void
  dismissible?: boolean
}

export const AddClothingDrawer = ({
  open,
  onOpenChange,
  onCameraClick,
  onAlbumClick,
  dismissible = false,
}: AddClothingDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={dismissible}>
      <DrawerContent className="mx-auto h-75 w-full max-w-93.75 rounded-t-[40px] border-none bg-[#FFFEFE] px-6 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
        <DrawerTitle className="font-h3 text-center text-neutral-900">選擇新增方式</DrawerTitle>

        <div className="flex flex-col gap-5 pt-10">
          <button
            type="button"
            onClick={onCameraClick}
            className="font-label-xl bg-primary-200 flex h-13.25 w-full items-center justify-center rounded-[12px] text-neutral-800"
          >
            相機
          </button>

          <button
            type="button"
            onClick={onAlbumClick}
            className="font-label-xl bg-primary-200 flex h-13.25 w-full items-center justify-center rounded-[12px] text-neutral-800"
          >
            從相簿上傳
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
