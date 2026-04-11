import { ImagePlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/sonner'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { getCreationFlowReturnRoute, resolveCreationFlowEntryScope } from '@/modules/wardrobe/utils/creationFlowNavigation'
import { preparePendingRecognitionSource } from '@/modules/wardrobe/utils/preparePendingRecognitionSource'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const WardrobeAlbumPage = () => {
  const router = useRouter()
  const { clearFlow, setPendingSource } = useWardrobeCreationFlow()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const entryScope = resolveCreationFlowEntryScope({ router })
  const backHref = getCreationFlowReturnRoute(entryScope)

  const handleOpenAlbum = () => {
    if (isSubmitting) return
    fileInputRef.current?.click()
  }

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      resetInput()
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      showToast.error('請選擇 jpg、png 或 webp 圖片')
      resetInput()
      return
    }

    setIsSubmitting(true)

    try {
      await preparePendingRecognitionSource({
        router,
        origin: 'album',
        entryScope,
        file,
        clearFlow,
        setPendingSource,
      })
    } finally {
      resetInput()
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href={backHref} className="font-label-sm text-neutral-500">
          ←
        </Link>
        <h1 className="font-label-md text-neutral-900">從相簿上傳</h1>
        <span className="w-4" />
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex flex-1 flex-col px-4 pb-24">
        <section className="flex flex-1 items-center justify-center pb-6">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleOpenAlbum}
            className="h-auto w-full rounded-[12px] border-neutral-200 bg-white p-4 hover:bg-white"
          >
            <div className="flex min-h-80 w-full flex-col items-center justify-center rounded-[12px] border border-dashed border-neutral-200 bg-neutral-50 px-6 text-center">
              <div className="mb-4 flex size-15 items-center justify-center rounded-full bg-primary-100 text-primary-900">
                <ImagePlus className="size-7" />
              </div>
              <div className="space-y-2">
                <p className="font-label-md text-neutral-900">選擇要新增的衣物照片</p>
                <p className="font-paragraph-sm text-neutral-500">
                  開啟系統相簿或檔案選擇器，挑選單一衣物圖片後先確認預覽。
                </p>
              </div>
            </div>
          </Button>
        </section>

        <div className="space-y-3 pt-4">
          <PrimaryButton content="選擇相片" disabled={isSubmitting} loading={isSubmitting} onClick={handleOpenAlbum} />

          <p className="text-center font-paragraph-xs text-neutral-500">
            支援 jpg、png、webp 格式，建議上傳單一衣物且背景乾淨的照片
          </p>
        </div>
      </main>
    </div>
  )
}

export default WardrobeAlbumPage
