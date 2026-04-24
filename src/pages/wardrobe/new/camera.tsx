import { Camera, CameraOff, RefreshCw, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { showToast } from '@/components/ui/sonner'
import { useCameraPreview } from '@/modules/wardrobe/hooks/useCameraPreview'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { getCreationFlowReturnRoute, resolveCreationFlowEntryScope } from '@/modules/wardrobe/utils/creationFlowNavigation'
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

      await preparePendingRecognitionSource({
        router,
        origin: 'camera',
        entryScope,
        file,
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
      <header className="flex items-center px-4 pt-4 pb-1">
        <Link href={backHref} className="flex size-10 items-center justify-center" aria-label="返回上一頁">
          <X className="text-white" size={24} strokeWidth={2} />
        </Link>
      </header>

      <div className="">
        <div className="overflow-hidden bg-[#D9D9D9]">
          <div className="relative flex min-h-[calc(100vh-250px)] items-center justify-center overflow-hidden bg-[#D9D9D9]">
            {status === 'loading' && <Skeleton className="h-full min-h-124 w-full rounded-[12px] bg-white/10" />}

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={status === 'ready' ? 'h-full min-h-[50vh] w-full object-contain' : 'hidden'}
            />

            {status !== 'ready' && status !== 'loading' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#D9D9D9] px-6 text-center text-neutral-900">
                <div className="flex size-15 items-center justify-center rounded-full bg-black/10">
                  {status === 'unsupported' ? <CameraOff className="size-7" /> : <Camera className="size-7" />}
                </div>
                <div className="space-y-2">
                  <p className="font-label-md text-neutral-900">無法啟動相機預覽</p>
                  <p className="font-paragraph-sm text-neutral-600">{errorMessage}</p>
                </div>
                {canRetry ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="rounded-full bg-neutral-900 text-white hover:bg-neutral-900/90"
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

        <div className="absolute right-3 bottom-28 left-3 rounded-[12px] bg-white p-3 text-center font-paragraph-sm text-neutral-500 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
          小訣竅：在乾淨的背景上拍攝，辨識更快速！
        </div>
      </div>

      <div className="absolute right-0 bottom-6 left-0 flex justify-center">
        <button
          type="button"
          aria-label="拍攝衣物"
          disabled={!isCameraReady || isSubmitting}
          onClick={() => {
            void handleCapture()
          }}
          className="flex h-17.5 w-17.5 items-center justify-center rounded-full border-6 border-primary-200 bg-transparent disabled:opacity-50"
        >
          <span className="h-12 w-12 rounded-full bg-white" />
        </button>
      </div>
    </div>
  )
}

export default WardrobeCameraPage
