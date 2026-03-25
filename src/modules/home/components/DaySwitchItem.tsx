import { Button } from '@/components/ui/button'

type DaySwitchItemProps = {
  day: '今天' | '明天'
  onClick: () => void
  variant: 'daySwitch_active' | 'daySwitch_inactive'
}
export const DaySwitchItem = ({ day, onClick, variant }: DaySwitchItemProps) => {
  return (
    <Button size="daySwitch" variant={variant} onClick={onClick}>
      {day}
    </Button>
  )
}
