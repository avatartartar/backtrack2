import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Keith 2024-01-15_01-14-PM
// refactored this file to have helper helper fetch and slice functions
// that can be be resued for any slice. reduces code duplication.

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

export {
  fetchTopTracks,
  fetchTopAlbums,
  fetchTopArtists,
  topTracksReducer,
  topAlbumsReducer,
  topArtistsReducer,
  setYear,
  setChosenTrack,
  chosenReducer
};
