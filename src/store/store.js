import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "./slices/settingsSlice"
import logsReducer from "./slices/logsSlice"
import gameReducer from "./slices/gameSlice"

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    logs: logsReducer,
    game: gameReducer,
  }
})