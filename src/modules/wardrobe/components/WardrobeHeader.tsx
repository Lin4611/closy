/**
 * Wardrobe 主頁專用 header。
 *
 * 跨模組流程頁 / 子頁共用 header 應另以 SubPageHeader 承接。
 * 是否於後續收斂到 MainPageHeader，現階段未確認。
 */
type WardrobeHeaderProps = {
  title?: string
}

export const WardrobeHeader = ({ title = '我的衣櫃' }: WardrobeHeaderProps) => {
  return (
    <header className="relative z-10 shrink-0 bg-white px-4 py-3 shadow-[0px_1px_3px_0px_#18181B0D]">
      <h1 className="font-h1 text-neutral-900">{title}</h1>
    </header>
  )
}
