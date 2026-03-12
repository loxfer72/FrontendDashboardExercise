import { configureStore } from "@reduxjs/toolkit";
import themeReducer     from "./themeSlice";
import toolsReducer     from "./toolsSlice";
import analyticsReducer from "./analyticsSlice";

export const store = configureStore({
  reducer: {
    theme:     themeReducer,
    tools:     toolsReducer,
    analytics: analyticsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;