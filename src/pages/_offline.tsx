import Head from 'next/head'
import Image from 'next/image'

const OfflinePage = () => {
  return (
    <>
      <Head>
        <title>Closy</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center gap-20 pt-40 pb-[104px]">
      <section className="flex flex-col items-center gap-5">
        <Image src="/Logo.webp" alt="logo" width={117} height={117} />
        <h1 className="font-display">CLOSY</h1>
      </section>

      <section className="flex flex-col items-center gap-2 text-center">
        <p className="font-label-xxl">目前沒有網路連線</p>
        <span className="font-paragraph-md text-neutral-500">請確認網路後重試</span>
      </section>

      <button
        className="font-label-md rounded-full bg-neutral-900 px-8 py-3 text-white"
        onClick={() => window.location.reload()}
      >
        重新整理
      </button>

      <div className="mt-auto flex flex-col items-center text-center text-neutral-400">
        <p className="font-paragraph-xs">此產品為學生專題作品，僅學習與展示用，</p>
        <p className="font-paragraph-xs">並沒有提供任何服務及商業行為。</p>
      </div>
    </main>
    </>
  )
}

export default OfflinePage
