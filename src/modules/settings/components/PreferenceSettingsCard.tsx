import { SettingItemCard } from './SettingItemCard'

type Preference = {
  defaultStyle: string[]
  defaultColor: string[]
}

export const PreferenceSettingCard = ({ defaultStyle, defaultColor }: Preference) => {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <p className="font-paragraph-md px-2 text-neutral-500">偏好設定</p>
      <div className="flex flex-1 flex-col gap-5 rounded-[20px] bg-white p-4 shadow-[1px_1px_4px_rgba(0,0,0,0.1),inset_0_0_0_0.5px_rgba(50,18,51,0.24)] transition duration-300 ease-out">
        <SettingItemCard title="風格" href="/settings/preference/styles" value={defaultStyle} />
        <SettingItemCard title="色系" href="/settings/preference/colors" value={defaultColor} />
      </div>
    </div>
  )
}
