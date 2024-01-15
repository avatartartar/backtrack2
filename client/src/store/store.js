import { configureStore } from "@reduxjs/toolkit";
import topTenTracksReducer from '../features/topTenTracksSlice.js';
import topTenTracksByYearReducer from '../features/topTenTracksByYearSlice.js';

export const store = configureStore({
  reducer: {
    topTenTracks: topTenTracksReducer,
    topTenTracksByYear: topTenTracksByYearReducer
  }
  // devTools: process.env.NODE_ENV !== 'production',
});


export default store; 