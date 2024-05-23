import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSafeModeEnabled: true, // Default state of the Safe Mode Switch
};

export const safeModeSlice = createSlice({
  name: "safeMode",
  initialState,
  reducers: {
    toggleSafeMode: (state) => {
      state.isSafeModeEnabled = !state.isSafeModeEnabled;
    },
  },
});

export const { toggleSafeMode } = safeModeSlice.actions;
export const selectSafeMode = (state) => state.safeMode.isSafeModeEnabled;

export default safeModeSlice.reducer;
