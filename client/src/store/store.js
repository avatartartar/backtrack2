import { configureStore } from "@reduxjs/toolkit";
import topTenTracksReducer from '../features/topTenTracksSlice.js';

export const store = configureStore({
  reducer: {
    topTenTracks: topTenTracksReducer
  }
  // devTools: process.env.NODE_ENV !== 'production',
});


export default store; 