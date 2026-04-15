type WardrobeHeaderProps = {
  title?: string
}

export const WardrobeHeader = ({ title = '我的衣櫃' }: WardrobeHeaderProps) => {
  return (
    <header className="fixed top-0 left-1/2 z-20 flex h-16 w-full max-w-93.75 -translate-x-1/2 items-center bg-white px-4">
      <h1 className="font-h1 text-neutral-900">{title}</h1>
    </header>
  )
}
