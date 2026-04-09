import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { RECOGNITION_ENTRY_KEY } from '@/modules/wardrobe/constants/recognition'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'

const WardrobeCameraPage = () => {
  const router = useRouter()
  const { clearFlow, initializeFlow } = useWardrobeCreationFlow()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const handleOpenCamera = () => {
    if (isSubmitting) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(RECOGNITION_ENTRY_KEY, 'camera')
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const previewUrl = URL.createObjectURL(file)
    previewUrlRef.current = previewUrl

    clearFlow()
    initializeFlow({
      entryType: 'camera',
      file,
      previewUrl,
    })

    setIsSubmitting(true)

    try {
      await router.push('/wardrobe/new/processing')
    } finally {
      event.target.value = ''
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#18181F] text-white">
      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <Link href="/wardrobe" className="font-label-sm text-white/80">
          ×
        </Link>
        <span className="w-4" />
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="px-4 pt-1 pb-6">
        <div className="rounded-none bg-[#D9D9D9] px-3 pt-12 pb-12">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleOpenCamera}
            className="mx-auto mb-3 flex h-10 items-center rounded-[10px] bg-primary-800 px-4 font-label-xs text-white disabled:opacity-60"
          >
            請先拍攝一件上衣
          </button>

          <div className="relative mx-auto h-49.5 w-38.5">
            <Image
              src="/wardrobe/tshirt.png"
              alt="拍攝示意衣物"
              fill
              sizes="154px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-1 rounded-full bg-white/95 px-3 py-1.5 text-center font-label-xxs-r text-neutral-500">
          小訣竅：在乾淨的背景上拍攝，辨識更快速！
        </div>
      </div>

      <div className="absolute right-0 bottom-5 left-0 flex justify-center">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleOpenCamera}
          className="flex h-10.5 w-10.5 items-center justify-center rounded-full border-2 border-white bg-[#D9D9D9] shadow-[0_6px_16px_rgba(0,0,0,0.28)] disabled:opacity-60"
        >
          <span className="h-7 w-7 rounded-full border border-neutral-500 bg-white" />
        </button>
      </div>
    </div>
  )
}

export default WardrobeCameraPage
