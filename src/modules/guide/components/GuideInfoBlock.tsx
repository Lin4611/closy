type GuideInfoBlockProps = {
  title: string
  description_1: string
  description_2: string
  subtext: string
}

export const GuideInfoBlock = ({
  title,
  description_1,
  description_2,
  subtext,
}: GuideInfoBlockProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h3 className="font-h3 py-4">{title}</h3>
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <div className="font-label-md">
          <p>{description_1}</p>
          <p>{description_2}</p>
        </div>
        <span className="font-paragraph-xs text-neutral-600">{subtext}</span>
      </div>
    </div>
  )
}
