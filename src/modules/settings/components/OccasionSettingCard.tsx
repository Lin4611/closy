import { SettingItemCard } from './SettingItemCard'

type Occasion = {
  defaultOccasion: string
}

export const OccasionSettingCard = ({ defaultOccasion }: Occasion) => {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <p className="font-paragraph-md px-2 text-neutral-500">預設</p>
      <div className="flex flex-1 items-center justify-center rounded-[20px] bg-white p-4 shadow-[1px_1px_4px_rgba(0,0,0,0.1),inset_0_0_0_0.5px_rgba(50,18,51,0.24)] transition duration-300 ease-out">
        <SettingItemCard title="場合" href="/settings/occasion" value={[defaultOccasion]} />
      </div>
    </div>
  )
}
