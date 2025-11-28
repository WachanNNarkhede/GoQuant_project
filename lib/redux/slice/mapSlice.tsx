import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, CameraState } from '@/types';

interface MapState {
  camera: CameraState;
  selectedExchange: string | null;
  selectedRegion: string | null;
  hoveredEntity: string | null;
  filters: FilterState;
  searchQuery: string;
}

const initialState: MapState = {
  camera: {
    position: [0, 0, 15],
    target: [0, 0, 0],
    fov: 50,
  },
  selectedExchange: null,
  selectedRegion: null,
  hoveredEntity: null,
  filters: {
    cloudProviders: ['aws', 'gcp', 'azure'],
    latencyRange: [0, 500],
    showRealTime: true,
    showHistorical: true,
    showRegions: true,
    showHeatmap: false,
    selectedExchanges: [],
  },
  searchQuery: '',
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCameraPosition: (state, action: PayloadAction<[number, number, number]>) => {
      state.camera.position = action.payload;
    },
    setCameraTarget: (state, action: PayloadAction<[number, number, number]>) => {
      state.camera.target = action.payload;
    },
    setCameraFov: (state, action: PayloadAction<number>) => {
      state.camera.fov = action.payload;
    },
    setSelectedExchange: (state, action: PayloadAction<string | null>) => {
      state.selectedExchange = action.payload;
    },
    setSelectedRegion: (state, action: PayloadAction<string | null>) => {
      state.selectedRegion = action.payload;
    },
    setHoveredEntity: (state, action: PayloadAction<string | null>) => {
      state.hoveredEntity = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetCamera: (state) => {
      state.camera = {
        position: [0, 0, 15],
        target: [0, 0, 0],
        fov: 50,
      };
    },
    flyToEntity: (state, action: PayloadAction<{ type: 'exchange' | 'region'; id: string; position: [number, number, number] }>) => {
      state.camera.target = action.payload.position;
      state.camera.position = [
        action.payload.position[0] + 5,
        action.payload.position[1] + 5,
        action.payload.position[2] + 10
      ];
    },
  },
});

export const {
  setCameraPosition,
  setCameraTarget,
  setCameraFov,
  setSelectedExchange,
  setSelectedRegion,
  setHoveredEntity,
  updateFilters,
  setSearchQuery,
  resetCamera,
  flyToEntity,
} = mapSlice.actions;
export default mapSlice.reducer;