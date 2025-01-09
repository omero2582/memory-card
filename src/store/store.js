import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "./slices/settingsSlice"
import logsReducer from "./slices/logsSlice"
import gameReducer from "./slices/gameSlice"
import { listenerMiddleware, gameMiddleware, stateCaptureMiddleware } from './listenerMiddleware'
import { apiSlice } from './api/apiSlice'


export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    logs: logsReducer,
    game: gameReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // .concat(listenerMiddleware.middleware)
      .concat(stateCaptureMiddleware)
      .concat(gameMiddleware.middleware)
      .concat(apiSlice.middleware)
})