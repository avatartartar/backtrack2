import { configureStore } from "@reduxjs/toolkit";
import { topTracksSlice, topAlbumsSlice, topArtistsSlice, chosenReducer } from '../features/slice.js';

const store = configureStore({
  reducer: {
    topTracks: topTracksSlice.reducer,
    topAlbums: topAlbumsSlice.reducer,
    topArtists: topArtistsSlice.reducer,

    chosen: chosenReducer
  },
  // devTools: process.env.NODE_ENV !== 'production',
});

export const logState = (store) => {
  console.log('store:', store.getState());

  // useful when the store is small
  // console.log('State:', JSON.stringify(store.getState(), null, 2));
}

export default store;
