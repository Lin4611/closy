import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { RecognitionLoading } from '@/modules/wardrobe/components/RecognitionLoading'
import {
  mockAlbumRecognitionDraft,
  mockRecognitionDraft,
} from '@/modules/wardrobe/data/mockWardrobeItems'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'

const RECOGNITION_ENTRY_KEY = 'closy:recognition-entry'

const WardrobeProcessingPage = () => {
  const router = useRouter()
  const { saveRecognitionDraft } = useWardrobeMock()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isCancelled = false

    const startRecognition = async () => {
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 1500))

        const recognitionEntry =
          typeof window === 'undefined'
            ? 'camera'
            : (window.sessionStorage.getItem(RECOGNITION_ENTRY_KEY) ?? 'camera')

        const draft =
          recognitionEntry === 'album' ? mockAlbumRecognitionDraft : mockRecognitionDraft

        if (isCancelled) return

        saveRecognitionDraft(draft)
        void router.replace('/wardrobe/new/review')
      } catch {
        if (isCancelled) return

        const recognitionEntry =
          typeof window === 'undefined'
            ? 'camera'
            : (window.sessionStorage.getItem(RECOGNITION_ENTRY_KEY) ?? 'camera')

        const fallbackPath =
          recognitionEntry === 'album' ? '/wardrobe/new/album' : '/wardrobe/new/camera'

        setErrorMessage('辨識失敗，將返回上一頁')

        window.setTimeout(() => {
          void router.replace(fallbackPath)
        }, 1200)
      }
    }

    void startRecognition()

    return () => {
      isCancelled = true
    }
  }, [router, saveRecognitionDraft])

  return errorMessage ? (
    <section className="flex min-h-screen items-center justify-center px-6 text-center">
      <p className="font-label-md text-neutral-900">{errorMessage}</p>
    </section>
  ) : (
    <RecognitionLoading />
  )
}

export default WardrobeProcessingPage
