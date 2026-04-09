import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { RECOGNITION_ENTRY_KEY } from '@/modules/wardrobe/constants/recognition'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'

const WardrobeAlbumPage = () => {
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

  const handleOpenAlbum = () => {
    if (isSubmitting) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(RECOGNITION_ENTRY_KEY, 'album')
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const previewUrl = URL.createObjectURL(file)
    previewUrlRef.current = previewUrl

    clearFlow()
    initializeFlow({
      entryType: 'album',
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
    <div className="relative flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
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
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleOpenAlbum}
            className="flex w-full items-center justify-center overflow-hidden rounded-[12px] border border-neutral-200 bg-white p-4 disabled:opacity-60"
          >
            <div className="relative h-80 w-full">
              <Image
                src="/wardrobe/cargo-pants.png"
                alt="相簿上傳示意圖片"
                fill
                sizes="(max-width: 375px) 100vw, 375px"
                className="object-contain"
              />
            </div>
          </button>
        </section>

        <div className="space-y-3 pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleOpenAlbum}
            className="h-11 w-full rounded-full bg-primary-900 font-label-md text-white disabled:opacity-60"
          >
            選擇相片
          </button>

          <p className="text-center font-paragraph-xs text-neutral-500">
            支援 jpg、png、webp 格式，建議上傳單一衣物且背景乾淨的照片
          </p>
        </div>
      </main>
    </div>
  )
}

export default WardrobeAlbumPage
