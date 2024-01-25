/**
 * @file store.js
 * @description: Configures and exports the Redux store for state management across the application. It combines reducers from different features and provides a function to log the current state for debugging purposes.
 * @requires @reduxjs/toolkit: For creating a Redux store with a simplified configuration and good defaults.
 * @imports
 * - '../features/slice.js': Imports the reducers for top tracks, albums, artists, and the chosen item feature slices.
 * @methods
 * - logState: A utility function for logging the current state of the Redux store to the console.
 * @consumers
 * - client/src/index.js: Imports the store and wraps the App component in a Provider component with the store as a prop,
 *   so that the store is available to all components in the application (i.e. the below subscribers).
 * - Subscribers:
 * - - client/src/components/TopAlbumsComp.jsx
 * - - client/src/components/TopArtistsComp.jsx
 * - - client/src/components/TopTracksComp.jsx
 * - - client/src/components/SliderComp.jsx (chosen)
 * - - client/src/components/GraphComp.jsx (tracks)
 */
import { configureStore } from "@reduxjs/toolkit";
import { topTracksReducer, topAlbumsReducer, topArtistsReducer, chosenReducer, jsonReducer } from '../features/slice.js';

const store = configureStore({
  reducer: {
    topTracks: topTracksReducer.reducer,
    topAlbums: topAlbumsReducer.reducer,
    topArtists: topArtistsReducer.reducer,
    chosen: chosenReducer,
    json: jsonReducer,
  },
  // disable serializableCheck for now, which
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const logState = (store) => {
  console.log('store:', store.getState());
  // useful when the store is small
  // console.log('State:', JSON.stringify(store.getState(), null, 2));
}

export default store;
