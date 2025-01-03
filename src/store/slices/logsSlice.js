import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: []
}

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    logToTextArea:(state, action) => {
      state.logs = [...state.logs, action.payload]
    }
  }
})

export const { logToTextArea } = logsSlice.actions;
export default logsSlice.reducer;