import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Analytics } from "@/types";
import { api } from "@/utils/api";

interface AnalyticsState {
  data:      Analytics | null;
  loading:   boolean;
  error:     string | null;
  timeRange: "30d" | "90d" | "1y";
}

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async () => api.getAnalytics()
);

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState: { data: null, loading: false, error: null, timeRange: "30d" } as AnalyticsState,
  reducers: {
    setTimeRange: (state, action) => { state.timeRange = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending,   (state) => { state.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchAnalytics.rejected,  (state, action) => { state.loading = false; state.error = action.error.message ?? "Error"; });
  },
});

export const { setTimeRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;