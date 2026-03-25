import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const RECOGNITION_ENTRY_KEY = 'closy:recognition-entry'

const WardrobeAlbumPage = () => {
    const router = useRouter()

    const handleStartRecognition = () => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(RECOGNITION_ENTRY_KEY, 'album')
        }

        void router.push('/wardrobe/new/processing')
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

            <main className="flex flex-1 flex-col px-4 pb-24">
                <section className="flex flex-1 items-center justify-center pb-6">
                    <div className="flex w-full items-center justify-center overflow-hidden rounded-[12px] border border-neutral-200 bg-white p-4">
                        <div className="relative h-80 w-full">
                            <Image
                                src="/wardrobe/cargo-pants.png"
                                alt="相簿預覽圖片"
                                fill
                                sizes="(max-width: 375px) 100vw, 375px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <button
                        type="button"
                        onClick={handleStartRecognition}
                        className="h-11 w-full rounded-full bg-primary-900 font-label-md text-white"
                    >
                        開始辨識
                    </button>
                </div>
            </main>
        </div>
    )
}

export default WardrobeAlbumPage