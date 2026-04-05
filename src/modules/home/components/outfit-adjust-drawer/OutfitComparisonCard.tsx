import Image from 'next/image'

type OutfitComparisonCardProps = {
  title: string
  imageUrl: string
}

export const OutfitComparisonCard = ({ title, imageUrl }: OutfitComparisonCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <span className="font-paragraph-md text-neutral-800">{title}</span>
      <Image src={imageUrl} alt={title} width={117} height={336} />
    </div>
  )
}
