import { ChevronLeft, ImagePlus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useRef, useState, type ChangeEvent } from 'react'

import { showToast } from '@/components/ui/sonner'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { getCreationFlowReturnRoute, resolveCreationFlowEntryScope } from '@/modules/wardrobe/utils/creationFlowNavigation'
import {
  SUPPORTED_RECOGNITION_IMAGE_ACCEPT,
  SUPPORTED_RECOGNITION_IMAGE_FORMAT_TEXT,
  normalizeRecognitionImage,
  isSupportedRecognitionImageFile,
} from '@/modules/wardrobe/utils/normalizeRecognitionImage'
import { preparePendingRecognitionSource } from '@/modules/wardrobe/utils/preparePendingRecognitionSource'

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

    if (!isSupportedRecognitionImageFile(file)) {
      showToast.error(`請選擇 ${SUPPORTED_RECOGNITION_IMAGE_FORMAT_TEXT} 圖片`)
      resetInput()
      return
    }

    setIsSubmitting(true)

    try {
      const normalizedFile = await normalizeRecognitionImage(file, {
        fileNamePrefix: 'closy-album',
      })

      await preparePendingRecognitionSource({
        router,
        origin: 'album',
        entryScope,
        file: normalizedFile,
        clearFlow,
        setPendingSource,
      })
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : '圖片處理失敗，請重新選擇照片')
    } finally {
      resetInput()
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-100">
      <header className="relative flex items-center justify-center h-16 px-4 pt-5 pb-4">
        <button
          type="button"
          onClick={() => {
            void router.push(backHref)
          }}
          className="absolute left-4 flex size-10 items-center justify-center text-neutral-500"
          aria-label="返回上一頁"
        >
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-label-xxl text-neutral-900">從相簿上傳</h1>
        <span className="w-10" />
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_RECOGNITION_IMAGE_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex flex-1 flex-col px-6 pb-16">
        <section className="rounded-[12px] bg-white p-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleOpenAlbum}
            className="flex min-h-[50vh] w-full flex-col items-center justify-center rounded-[12px] bg-neutral-50 px-6 text-center"
          >
            <div className="mb-6 text-neutral-900">
              <ImagePlus className="size-10" />
            </div>
            <div className="w-full max-w-65 space-y-3">
              <p className="font-label-xl text-neutral-900">選擇要新增的衣物照片</p>
              <p className="wrap-break-word font-paragraph-sm leading-6 text-neutral-500">
                開啟系統相簿或檔案選擇器，挑選單一衣物圖片後先確認預覽。
              </p>
            </div>
          </button>
        </section>

        <div className="space-y-4 pt-8">
          <PrimaryButton
            content={isSubmitting ? '處理中...' : '選擇相片'}
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={handleOpenAlbum}
          />

          <p className="px-2 text-center font-paragraph-xs leading-6 text-neutral-500">
            支援 {SUPPORTED_RECOGNITION_IMAGE_FORMAT_TEXT} 格式，系統會先整理圖片後再進入預覽
          </p>
        </div>
      </main>
    </div>
  )
}

export default WardrobeAlbumPage
