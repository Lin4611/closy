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
import userReducer from './slices/userSlice'

const homePersistConfig = {
  key: 'home',
  storage,
}

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'isLoggedIn'],
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)
const persistedHomeReducer = persistReducer(homePersistConfig, homeReducer)

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    home: persistedHomeReducer,
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
