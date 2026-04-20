import Image from 'next/image'
type GuideIntroSlideProps = {
  imageUrl: string
  alt: string
  titleLine1: string
  titleLine2: string
}
export const GuideIntroSlide = ({
  imageUrl,
  alt,
  titleLine1,
  titleLine2,
}: GuideIntroSlideProps) => {
  return (
    <section className="flex flex-col items-center gap-6">
      <div className="relative h-70 w-70">
        <Image src={imageUrl} alt={alt} fill className="object-contain" />
      </div>
      <div className="font-paragraph-lg w-full text-center">
        <p>{titleLine1}</p>
        <p>{titleLine2}</p>
      </div>
    </section>
  )
}
