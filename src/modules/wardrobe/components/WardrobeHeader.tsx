type WardrobeHeaderProps = {
  title?: string
}

export const WardrobeHeader = ({ title = '我的衣櫃' }: WardrobeHeaderProps) => {
  return (
    <header className="bg-white px-4 py-3">
      <h1 className="font-h1 tracking-[-0.02em] text-neutral-900">{title}</h1>
    </header>
  )
}
