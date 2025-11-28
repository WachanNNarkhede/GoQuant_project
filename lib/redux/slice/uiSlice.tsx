import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '@/types';

const initialState: UIState = {
  theme: 'dark',
  isLoading: false,
  selectedView: 'map',
  sidebarOpen: true,
  tooltip: {
    visible: false,
    content: '',
    position: { x: 0, y: 0 },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedView: (state, action: PayloadAction<'map' | 'analytics'>) => {
      state.selectedView = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    showTooltip: (state, action: PayloadAction<{ content: string; x: number; y: number }>) => {
      state.tooltip = {
        visible: true,
        content: action.payload.content,
        position: { x: action.payload.x, y: action.payload.y },
      };
    },
    hideTooltip: (state) => {
      state.tooltip.visible = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setLoading,
  setSelectedView,
  toggleSidebar,
  setSidebarOpen,
  showTooltip,
  hideTooltip,
} = uiSlice.actions;
export default uiSlice.reducer;