import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './slices/campaignSlice'; // Changed from userSlice
import userReducer from './slices/userSlice'; // Keep this as is

export const store = configureStore({
  reducer: {
    campaigns: campaignReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;