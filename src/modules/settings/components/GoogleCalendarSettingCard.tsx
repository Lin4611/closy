import { Switch } from '@/components/ui/switch'
type GoogleCalendarSettingCardProps = {
  isSynced: boolean
  isSyncing: boolean
  onCheckedChange: (checked: boolean) => void
  text: string
}

export const GoogleCalendarSettingCard = ({
  isSynced,
  isSyncing,
  onCheckedChange,
  text,
}: GoogleCalendarSettingCardProps) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-paragraph-md px-2 text-neutral-500">同步設定</p>
      <div className="flex flex-1 items-center justify-between rounded-[20px] bg-white p-4 shadow-[1px_1px_4px_rgba(0,0,0,0.1),inset_0_0_0_0.5px_rgba(50,18,51,0.24)] transition duration-300 ease-out">
        <p className="font-paragraph-md py-[5.5px]">Google Calendar</p>
        <div className="flex items-center gap-[7px]">
          <p className="font-paragraph-md text-neutral-500">{text}</p>
          <Switch checked={isSynced} disabled={isSyncing} onCheckedChange={onCheckedChange} />
        </div>
      </div>
    </div>
  )
}
