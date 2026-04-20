import type { Occasion } from '@/modules/common/types/occasion'

export type CalendarEntrySource = 'local' | 'google'
export type CalendarFormMode = 'new' | 'edit'

export type CalendarEntry = {
  id: string
  date: string
  occasionKey: Occasion
  selectedOutfitId: string | null
  sourceType: CalendarEntrySource
  googleEventId: string | null
  createdAt: number
  updatedAt: number
}

export type CalendarEntryInput = {
  id?: string
  date: string
  occasionKey: Occasion
  selectedOutfitId?: string | null
  sourceType: CalendarEntrySource
  googleEventId?: string | null
  createdAt?: number
  updatedAt?: number
}

export type CalendarGoogleEvent = {
  id: string
  date: string
  title: string
  startTime: string
  endTime: string
}

export type CalendarEntryCapabilities = {
  canExpand: boolean
  canDelete: boolean
  canEditDate: boolean
  canEditOccasion: boolean
  canSelectOutfit: boolean
}

export type CalendarEntryCardViewModel = {
  entry: CalendarEntry
  events: CalendarGoogleEvent[]
  eventCount: number
  isExpandedByDefault: boolean
  hasSelectedOutfit: boolean
}

export type CalendarFormDraft = {
  mode: CalendarFormMode
  date: string
  occasionKey: Occasion | null
  selectedOutfitId: string | null
  sourceEntryId: string | null
  returnTo: string | null
}

export type CalendarSelectedOutfitDraft = {
  selectedOutfitId: string | null
  returnTo: string | null
  sourceEntryId: string | null
  occasionKey: Occasion | null
  date: string
}

export type SelectableOutfitSummary = {
  id: string
  imageUrl: string
  occasionKey: Occasion
  savedAt: string
  itemNames: string[]
}


export type CalendarEntryOutfitDisplayStatus = 'none' | 'loading' | 'resolved' | 'missing' | 'error'

export type CalendarEntryOutfitDisplayModel = {
  status: CalendarEntryOutfitDisplayStatus
  imageUrl: string | null
  message: string | null
}

export type CalendarSelectedOutfitPreviewStatus = 'resolved' | 'loading' | 'missing' | 'error'

export type CalendarSelectedOutfitPreviewModel = SelectableOutfitSummary & {
  previewStatus: CalendarSelectedOutfitPreviewStatus
  previewMessage: string | null
}

export type CalendarOutfitDataSource = 'mock' | 'api'

export type CalendarOutfitCollectionStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error'

export type CalendarOutfitReferenceStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error'

export type CalendarResolvedOutfit = {
  status: CalendarOutfitReferenceStatus
  outfit: SelectableOutfitSummary | null
  errorMessage: string | null
}

export type CalendarOccasionOption = {
  key: Occasion
  name: string
  description: string
  imageUrl: string
  iconKey: 'social' | 'campus' | 'business' | 'professional'
}
