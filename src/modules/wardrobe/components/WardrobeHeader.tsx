type WardrobeHeaderProps = {
  title?: string
}

export const WardrobeHeader = ({ title = '我的衣櫃' }: WardrobeHeaderProps) => {
  return (
    <header className="bg-white px-4 py-3 fixed top-0 max-w-93.75 w-full z-10">
      <h1 className="font-h1 text-neutral-900">{title}</h1>
    </header>
  )
}
