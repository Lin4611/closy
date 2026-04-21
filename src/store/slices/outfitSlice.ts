import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type {
  OutfitListItem,
  OutfitOccasionSummary,
} from '@/modules/outfit/types/outfitTypes'

type OutfitState = {
  outfitList: OutfitListItem[]
  occasionsList: OutfitOccasionSummary[]
}

const initialState: OutfitState = {
  outfitList: [],
  occasionsList: [],
}

const outfitSlice = createSlice({
  name: 'outfit',
  initialState,
  reducers: {
    setOutfitList: (state, action: PayloadAction<OutfitListItem[]>) => {
      state.outfitList = action.payload
    },
    setOccasionsList: (state, action: PayloadAction<OutfitOccasionSummary[]>) => {
      state.occasionsList = action.payload
    },
    clearOutfitCache: (state) => {
      state.outfitList = []
      state.occasionsList = []
    },
  },
})

export const { setOutfitList, setOccasionsList, clearOutfitCache } = outfitSlice.actions
export default outfitSlice.reducer
