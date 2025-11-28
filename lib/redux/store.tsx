import { configureStore } from '@reduxjs/toolkit';
import latencyReducer from './slice/latencySlice';
import mapReducer from './slice/mapSlice';
import uiReducer from './slice/uiSlice';

export const store = configureStore({
  reducer: {
    latency: latencyReducer,
    map: mapReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;