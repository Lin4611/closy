import Image from 'next/image'

const Guide = () => {
  return (
    <div className="flex max-w-93.75">
      <section className="max-w-70.25">
        <Image
          src="/guide/guide-intro-slide-1.webp"
          alt="guide-intro-slide-1"
          width={281}
          height={281}
        />
      </section>
    </div>
  )
}
export default Guide
