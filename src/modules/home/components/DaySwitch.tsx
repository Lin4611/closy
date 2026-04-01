import { useState } from 'react'

import { DaySwitchItem } from './DaySwitchItem'

export const DaySwitch = () => {
  const [day, setDay] = useState<'今天' | '明天'>('今天')
  return (
    <div className="flex h-10 w-54.5 items-center justify-between" id="day-switch">
      <DaySwitchItem
        day="今天"
        onClick={() => setDay('今天')}
        variant={day === '今天' ? 'daySwitch_active' : 'daySwitch_inactive'}
      />
      <DaySwitchItem
        day="明天"
        onClick={() => setDay('明天')}
        variant={day === '明天' ? 'daySwitch_active' : 'daySwitch_inactive'}
      />
    </div>
  )
}
