import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  isDark: boolean;
}

export const themeSlice = createSlice({
  name: "theme",
  initialState: { isDark: true } as ThemeState,
  reducers: {
    toggleTheme: (state) => { state.isDark = !state.isDark; },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;