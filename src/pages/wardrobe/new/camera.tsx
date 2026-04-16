import { Camera, CameraOff, ChevronLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { showToast } from '@/components/ui/sonner'
import { useCameraPreview } from '@/modules/wardrobe/hooks/useCameraPreview'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { getCreationFlowReturnRoute, resolveCreationFlowEntryScope } from '@/modules/wardrobe/utils/creationFlowNavigation'
import { normalizeRecognitionImage } from '@/modules/wardrobe/utils/normalizeRecognitionImage'
import { preparePendingRecognitionSource } from '@/modules/wardrobe/utils/preparePendingRecognitionSource'

const WardrobeCameraPage = () => {
  const router = useRouter()
  const { clearFlow, setPendingSource } = useWardrobeCreationFlow()
  const { videoRef, status, errorMessage, startCamera, capture } = useCameraPreview()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const entryScope = resolveCreationFlowEntryScope({ router })
  const backHref = getCreationFlowReturnRoute(entryScope)

  const handleCapture = async () => {
    if (isSubmitting || status !== 'ready') {
      return
    }

    setIsSubmitting(true)

    try {
      const file = await capture()
      const normalizedFile = await normalizeRecognitionImage(file, {
        fileNamePrefix: 'closy-camera',
      })

      await preparePendingRecognitionSource({
        router,
        origin: 'camera',
        entryScope,
        file: normalizedFile,
        clearFlow,
        setPendingSource,
      })
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : '拍照失敗，請重新嘗試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCameraReady = status === 'ready'
  const canRetry = status === 'denied' || status === 'unsupported' || status === 'error'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#18181F] text-white">
      <header className="relative flex items-center justify-center px-4 pt-5 pb-3">
        <Link href={backHref} className="absolute left-4 flex size-10 items-center justify-center" aria-label="返回上一頁">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <span className="font-label-sm text-white/80">拍攝衣物</span>
        <span className="w-10" />
      </header>

      <div className="px-4 pt-1 pb-6">
        <div className="overflow-hidden rounded-[16px] bg-[#D9D9D9] p-3">
          <div className="relative flex min-h-124 items-center justify-center overflow-hidden rounded-[12px] bg-[#22232C]">
            {status === 'loading' && <Skeleton className="h-full min-h-124 w-full rounded-[12px] bg-white/10" />}

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={status === 'ready' ? 'h-full min-h-124 w-full object-cover' : 'hidden'}
            />

            {status !== 'ready' && status !== 'loading' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
                <div className="flex size-15 items-center justify-center rounded-full bg-white/10">
                  {status === 'unsupported' ? <CameraOff className="size-7" /> : <Camera className="size-7" />}
                </div>
                <div className="space-y-2">
                  <p className="font-label-md text-white">無法啟動相機預覽</p>
                  <p className="font-paragraph-sm text-white/70">{errorMessage}</p>
                </div>
                {canRetry ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="rounded-full bg-white text-neutral-900 hover:bg-white/90"
                    onClick={() => {
                      void startCamera()
                    }}
                  >
                    <RefreshCw className="size-4" />
                    重新嘗試
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 rounded-full bg-white/95 px-3 py-1.5 text-center font-label-xxs-r text-neutral-500">
          小訣竅：在乾淨的背景上拍攝，辨識更快速！
        </div>
      </div>

      <div className="absolute right-0 bottom-5 left-0 flex justify-center">
        <button
          type="button"
          aria-label="拍攝衣物"
          disabled={!isCameraReady || isSubmitting}
          onClick={() => {
            void handleCapture()
          }}
          className="flex h-13 w-13 items-center justify-center rounded-full border-2 border-white bg-[#D9D9D9] shadow-[0_6px_16px_rgba(0,0,0,0.28)] disabled:opacity-50"
        >
          <span className="h-8.5 w-8.5 rounded-full border border-neutral-500 bg-white" />
        </button>
      </div>
    </div>
  )
}

export default WardrobeCameraPage
