import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { RecognitionLoading } from '@/modules/wardrobe/components/RecognitionLoading'
import { mockRecognitionDraft } from '@/modules/wardrobe/data/mockWardrobeItems'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'

const runMockRecognition = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 1500))
    return mockRecognitionDraft
}

const WardrobeProcessingPage = () => {
    const router = useRouter()
    const { saveRecognitionDraft } = useWardrobeMock()
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        let isCancelled = false

        const startRecognition = async () => {
            try {
                const draft = await runMockRecognition()

                if (isCancelled) return

                saveRecognitionDraft(draft)
                void router.replace('/wardrobe/new/review')
            } catch {
                if (isCancelled) return

                setErrorMessage('辨識失敗，將返回拍攝頁面')

                window.setTimeout(() => {
                    void router.replace('/wardrobe/new/camera')
                }, 1200)
            }
        }

        void startRecognition()

        return () => {
            isCancelled = true
        }
    }, [router, saveRecognitionDraft])

    return (
        <MobileLayout>
            {errorMessage ? (
                <section className="flex min-h-screen items-center justify-center px-6 text-center">
                    <p className="font-label-md text-neutral-900">{errorMessage}</p>
                </section>
            ) : (
                <RecognitionLoading />
            )}
        </MobileLayout>
    )
}

export default WardrobeProcessingPage