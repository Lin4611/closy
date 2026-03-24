import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { RecognitionLoading } from '@/modules/wardrobe/components/RecognitionLoading'
import { RecognitionSuccessToast } from '@/modules/wardrobe/components/RecognitionSuccessToast'
import { mockRecognitionDraft } from '@/modules/wardrobe/data/mockWardrobeItems'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'

const WardrobeCameraPage = () => {
  const router = useRouter()
  const { saveRecognitionDraft } = useWardrobeMock()
  const [stage, setStage] = useState<'camera' | 'loading' | 'success'>('camera')

  useEffect(() => {
    if (stage !== 'loading') return

    const loadingTimer = window.setTimeout(() => {
      setStage('success')
    }, 1200)

    const nextTimer = window.setTimeout(() => {
      saveRecognitionDraft(mockRecognitionDraft)
      void router.push('/wardrobe/new/review')
    }, 2100)

    return () => {
      window.clearTimeout(loadingTimer)
      window.clearTimeout(nextTimer)
    }
  }, [router, saveRecognitionDraft, stage])

  if (stage === 'loading') {
    return (
      <MobileLayout>
        <RecognitionLoading />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout className="relative min-h-screen bg-neutral-900 text-white">
      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <Link href="/wardrobe" className="font-label-sm text-white/80">
          ×
        </Link>
        <span className="w-4" />
      </header>

      <div className="px-4 pt-2 pb-6">
        <div className="rounded-[20px] bg-white/10 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setStage('loading')}
            className="font-label-sm mx-auto mb-4 flex rounded-full bg-white px-4 py-2 text-neutral-900"
          >
            請先拍攝一件上身衣服
          </button>

          <div className="flex aspect-3/4 items-center justify-center rounded-[20px] bg-[#2A2E3A] text-8xl">
            👕
          </div>

          <div className="mt-4 rounded-full bg-white/90 px-4 py-2 text-center font-paragraph-sm text-neutral-500">
            小訣竅：在乾淨的背景上拍攝，辨識更快速！
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-8 left-0 flex justify-center">
        <button
          type="button"
          onClick={() => setStage('loading')}
          className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-white bg-neutral-200 text-neutral-900 shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
        >
          <span className="h-14 w-14 rounded-full border border-neutral-400 bg-white" />
        </button>
      </div>

      <RecognitionSuccessToast open={stage === 'success'} />
    </MobileLayout>
  )
}

export default WardrobeCameraPage