import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "./slices/settingsSlice"
import logsReducer from "./slices/logsSlice"

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    logs: logsReducer,
  }
})