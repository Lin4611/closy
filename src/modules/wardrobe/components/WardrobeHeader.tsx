type WardrobeHeaderProps = {
  title?: string
}

export const WardrobeHeader = ({ title = '我的衣櫃' }: WardrobeHeaderProps) => {
  return (
    <header className="flex h-16 items-center bg-white px-4">
      <h1 className="font-h1 text-neutral-900">{title}</h1>
    </header>
  )
}
