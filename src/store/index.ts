import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import homeReducer from './slices/homeSlice'
import outfitReducer from './slices/outfitSlice'
import userReducer from './slices/userSlice'

const homePersistConfig = {
  key: 'home',
  storage,
}

const outfitPersistConfig = {
  key: 'outfit',
  storage,
  whitelist: ['outfitList', 'occasionsList'],
}

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'isLoggedIn'],
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)
const persistedHomeReducer = persistReducer(homePersistConfig, homeReducer)
const persistedOutfitReducer = persistReducer(outfitPersistConfig, outfitReducer)

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    home: persistedHomeReducer,
    outfit: persistedOutfitReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
