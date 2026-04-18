import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { OutfitItem, SummaryList } from '@/modules/outfit/types/outfitTypes'

type OutfitState = {
  outfitList: OutfitItem[]
  occasionsList: SummaryList[]
}

const initialState: OutfitState = {
  outfitList: [],
  occasionsList: [],
}

const outfitSlice = createSlice({
  name: 'outfit',
  initialState,
  reducers: {
    setOutfitList: (state, action: PayloadAction<OutfitItem[]>) => {
      state.outfitList = action.payload
    },
    setOccasionsList: (state, action: PayloadAction<SummaryList[]>) => {
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
