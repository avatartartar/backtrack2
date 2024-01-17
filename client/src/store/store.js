import { configureStore } from "@reduxjs/toolkit";
import { topTracksSlice, topAlbumsSlice, topArtistsSlice, topTracksByYearSlice } from '../features/slice.js';

const store = configureStore({
  reducer: {
    topTracks: topTracksSlice.reducer,
    topAlbums: topAlbumsSlice.reducer,
    topArtists: topArtistsSlice.reducer,
    topTracksByYear: topTracksByYearSlice.reducer,
  },
  // devTools: process.env.NODE_ENV !== 'production',
});

export const logState = (store) => {
  console.log('store:', store.getState());
  console.log('State:', JSON.stringify(store.getState(), null, 2));
}

export default store;
