import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type {
  OutfitListItem,
  OutfitOccasionSummary,
} from '@/modules/outfit/types/outfitTypes'

type OutfitState = {
  outfitList: OutfitListItem[]
  occasionsList: OutfitOccasionSummary[]
  baselineResolved: boolean
  cacheRevision: number
}

const initialState: OutfitState = {
  outfitList: [],
  occasionsList: [],
  baselineResolved: false,
  cacheRevision: 0,
}

const outfitSlice = createSlice({
  name: 'outfit',
  initialState,
  reducers: {
    setOutfitList: (state, action: PayloadAction<OutfitListItem[]>) => {
      state.outfitList = action.payload
      state.cacheRevision += 1
    },
    setOccasionsList: (state, action: PayloadAction<OutfitOccasionSummary[]>) => {
      state.occasionsList = action.payload
      state.cacheRevision += 1
    },

    syncOutfitFromServer: (state, action: PayloadAction<OutfitListItem>) => {
      const nextItem = action.payload
      const existingIndex = state.outfitList.findIndex((item) => item._id === nextItem._id)

      if (existingIndex === -1) {
        state.outfitList = [nextItem, ...state.outfitList]
      } else {
        state.outfitList[existingIndex] = nextItem
      }

      state.cacheRevision += 1
    },
    hydrateOutfitBaseline: (
      state,
      action: PayloadAction<{ outfitList: OutfitListItem[]; occasionsList: OutfitOccasionSummary[] }>,
    ) => {
      state.outfitList = action.payload.outfitList
      state.occasionsList = action.payload.occasionsList
      state.baselineResolved = true
      state.cacheRevision += 1
    },
    clearOutfitCache: (state) => {
      state.outfitList = []
      state.occasionsList = []
      state.baselineResolved = false
      state.cacheRevision += 1
    },
  },
})

export const { setOutfitList, setOccasionsList, syncOutfitFromServer, hydrateOutfitBaseline, clearOutfitCache } = outfitSlice.actions
export default outfitSlice.reducer
