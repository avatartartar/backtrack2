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
 * - - client/src/components/ImportComp.jsx (json)
 */
import { configureStore } from "@reduxjs/toolkit";

import {
  chosenReducer,
  jsonReducer,
  // 2024-01-26_04-42-AM: not being used yet. made to store results of our offline query
  // without affecting the topTracksReducer, topAlbumsReducer, topArtistsReducer stores (for now)
  resultsReducer,
  userReducer,
  topReducer,
} from '../features/slice.js';

import { queryReducer } from '../features/querySlice.js';

const store = configureStore({
  reducer: {
    chosen: chosenReducer,
    json: jsonReducer,
    results: resultsReducer,
    query: queryReducer,
    user: userReducer,
    top: topReducer,
  },
  // 2024-01-24: disabling serializableCheck, for now, which I think was preventing some functionality with storing json to the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// when command+enter is pressed anywhere on the site, the state of the entire store is logged to the console.
export const logState = (store) => {
  console.log('store:', store.getState());
  // useful when the store is small
  // console.log('State:', JSON.stringify(store.getState(), null, 2));
}

export default store;
