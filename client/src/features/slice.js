/**
 * @file slice.js
 * @description Defines Redux slices for managing application state related to tracks, albums, artists, and chosen items.
 * Utilizes Redux Toolkit to create slices and async thunks for pinging the server for data.
 *
 * @requires @reduxjs/toolkit: Toolkit's createSlice and createAsyncThunk to define state and asynchronous actions.
 *
 * @methods
 * - dataSlice: A factory function that creates a slice for a given endpoint with a dynamic name, initial state, and extra reducers to handle async actions.
 * - fetchTopTracks: Async thunk action created by dataSlice for fetching top tracks.
 * - fetchTopAlbums: Async thunk action created by dataSlice for fetching top albums.
 * - fetchTopArtists: Async thunk action created by dataSlice for fetching top artists.
 * - setYear: Reducer action for setting the year in the chosen slice's state.
 * - setChosenTrack: Reducer action for setting the chosen track in the chosen slice's state.
 *
 * @slices
 * - chosenSlice: Slice for managing state related to the chosen year and track.
 * - topTracksReducer: Reducer function for the top tracks slice.
 * - topAlbumsReducer: Reducer function for the top albums slice.
 * - topArtistsReducer: Reducer function for the top artists slice.
 * - chosenReducer: Reducer function for the chosen slice.
 *
 * @consumers
 * - actions:
 * - client/src/features/slice.js: Imports and dispatches the fetch and chosen functions.
 * - client/src/components/TopTracksComp.jsx: Imports and dispatches the setChosenTrack function.
 * - reducers:
 * - client/src/store/store.js: Imports the reducers and combines them into a single reducer.
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  arrData: [],
  objData: {},
  year: "",
  status: "idle",
  error: "",
};




const chosenSlice = createSlice({
  name: 'chosen',
  initialState: {
    year: 2024,
    defaultYear: 'all-time',
    track: {},
    status: "idle",
    error: ""
  },
  reducers: {
    // keys are action types
    // values are action creators
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setChosenTrack: (state, action) => {
      state.track = action.payload;
    },
  },
});

const dataSlice = (endpoint, filter) => {

  const actions = createAsyncThunk(

    `fetch/${endpoint}`,
    async (year) => {
      let url = `/${endpoint}/`;
      if (year != 2024) {
        url = `${url}${filter}${year}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch request failed at endpoint ${url}`);
      }
      const responseJson = await response.json();
      return responseJson;
    }
  );

  const reducer = createSlice({
    name: endpoint,
    initialState,
    // extraReducers
    // - Defines additional reducer functions for a slice.
    // - Allows defining reducers for async actions (like below) in the current slice
    // - Or reducers for actions of other slices.
    // - Enhances the reducer logic of the current slice.
    extraReducers(builder) {
        // Redux Toolkit Builder
        // - Creates reusable, standardized slices of application state.
        // - Simplifies the typical Redux workflow.
        // - Auto-generates action creators and action types.
        builder
        .addCase(actions.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(actions.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (action.meta.arg === 2024) {
            state.year = "all-time";
            state.arrData = action.payload;
            state.objData["all-time"] = action.payload;
         }
          else{
            state.year = action.meta.arg;
            state.arrData = action.payload;
            state.objData[action.meta.arg] = action.payload;
          }
        })
        .addCase(actions.rejected, (state, action) => {
          console.log(`status REJECTED for ${endpoint} in slice.js`);
          state.status = "failed";
          state.error = action.error.message;
        })
    }
  });
  return { reducer, actions };
}

const { reducer: topTracksReducer, actions: fetchTopTracks } = dataSlice('tracks', 'ByYear?year=');
const { reducer: topAlbumsReducer, actions: fetchTopAlbums } = dataSlice('albums', 'ByYear?year=');
const { reducer: topArtistsReducer, actions: fetchTopArtists } = dataSlice('artists', 'ByYear?year=');

const { reducer: chosenReducer, actions: chosenActions } = chosenSlice;
const { setYear, setChosenTrack } = chosenActions;

const jsonSlice = createSlice({
  name: 'json',
  initialState: {
    data: [],
    status: "idle",
    error: ""
  },
  reducers: {
    setJson: (state, action) => {
      state.data = action.payload;
    }
  },
});

const { reducer: jsonReducer, actions: jsonActions } = jsonSlice;
const { setJson } = jsonActions;

export {
  fetchTopTracks,
  fetchTopAlbums,
  fetchTopArtists,
  topTracksReducer,
  topAlbumsReducer,
  topArtistsReducer,
  setYear,
  setChosenTrack,
  chosenReducer,
  jsonReducer,
  setJson,
};
