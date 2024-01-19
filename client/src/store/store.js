import { configureStore } from "@reduxjs/toolkit";
import { topTracksSlice, topAlbumsSlice, topArtistsSlice, topTracksByYearSlice, topArtistsByYearSlice,topAlbumsByYearSlice, yearReducer } from '../features/slice.js';

const store = configureStore({
  reducer: {
    topTracks: topTracksSlice.reducer,
    topAlbums: topAlbumsSlice.reducer,
    topArtists: topArtistsSlice.reducer,
    topTracksByYear: topTracksByYearSlice.reducer,
    topArtistsByYear: topArtistsByYearSlice.reducer,
    topAlbumsByYear: topAlbumsByYearSlice.reducer,
    year: yearReducer
  },
  // devTools: process.env.NODE_ENV !== 'production',
});

export const logState = (store) => {
  console.log('store:', store.getState());

  // useful when the store is small
  // console.log('State:', JSON.stringify(store.getState(), null, 2));
}

export default store;
