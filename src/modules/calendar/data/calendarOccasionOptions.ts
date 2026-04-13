import type { CalendarOccasionOption } from '@/modules/calendar/types'
import { occasionMetaMap } from '@/modules/common/types/occasion'

const occasionIconMap: Record<CalendarOccasionOption['key'], CalendarOccasionOption['iconKey']> = {
  socialGathering: 'social',
  campusCasual: 'campus',
  businessCasual: 'business',
  professional: 'professional',
}

export const calendarOccasionOptions: CalendarOccasionOption[] = occasionMetaMap.map((occasion) => ({
  key: occasion.key,
  name: occasion.name,
  description: occasion.description,
  imageUrl: occasion.imageUrl,
  iconKey: occasionIconMap[occasion.key],
}))
