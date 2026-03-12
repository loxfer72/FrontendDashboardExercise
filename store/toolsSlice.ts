import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Tool } from "@/types";
import { api } from "@/utils/api";

interface ToolsState {
  items:         Tool[];
  recentTools:   Tool[];
  loading:       boolean;
  error:         string | null;
  filters: {
    status:     string;
    department: string;
    category:   string;
    search:     string;
  };
  currentPage:   number;
  selectedTools: number[];
}

const initialState: ToolsState = {
  items:         [],
  recentTools:   [],
  loading:       false,
  error:         null,
  filters:       { status: "", department: "", category: "", search: "" },
  currentPage:   1,
  selectedTools: [],
};

export const fetchTools = createAsyncThunk(
  "tools/fetchAll",
  async () => api.getTools()
);

export const fetchRecentTools = createAsyncThunk(
  "tools/fetchRecent",
  async () => api.getRecentTools()
);

export const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof ToolsState["filters"]; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    toggleSelectTool: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.selectedTools = state.selectedTools.includes(id)
        ? state.selectedTools.filter((t) => t !== id)
        : [...state.selectedTools, id];
    },
    clearSelection: (state) => { state.selectedTools = []; },
    addTool: (state, action: PayloadAction<Tool>) => {
      state.items.unshift(action.payload);
    },
    updateToolStatus: (state, action: PayloadAction<{ id: number; status: Tool["status"] }>) => {
      const tool = state.items.find((t) => t.id === action.payload.id);
      if (tool) tool.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTools.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTools.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTools.rejected,  (state, action) => { state.loading = false; state.error = action.error.message ?? "Error"; })
      .addCase(fetchRecentTools.fulfilled, (state, action) => { state.recentTools = action.payload; });
  },
});

export const { setFilter, setPage, toggleSelectTool, clearSelection, addTool, updateToolStatus } = toolsSlice.actions;
export default toolsSlice.reducer;