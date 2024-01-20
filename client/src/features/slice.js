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
    topTracks: [],
    status: "idle",
    error: ""
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setChosenTrack: (state, action) => {
      state.track = action.payload;
    },
  },
});

const slice = (endpoint, filter) => {
  const actions = createAsyncThunk(
    `fetch/${endpoint}`,
    async (arg) => {
      let url = `/${endpoint}/`;
      if (arg != 2024) {
        url = `${url}${filter}${arg}`;
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
    reducers: {},
    extraReducers(builder) {
      builder
        .addCase(actions.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(actions.fulfilled, (state, action) => {
          state.status = "succeeded";
          // this catches the case where the data is an array or an object
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
const { reducer: topTracksSlice, actions: fetchTopTracks } = slice('tracks', 'ByYear?year=');
const { reducer: topAlbumsSlice, actions: fetchTopAlbums } = slice('albums', 'ByYear?year=');
const { reducer: topArtistsSlice, actions: fetchTopArtists } = slice('artists', 'ByYear?year=');

const { reducer: chosenReducer, actions: chosenActions } = chosenSlice;
const { setYear, setChosenTrack } = chosenActions;

export {
  fetchTopTracks,
  fetchTopAlbums,
  fetchTopArtists,
  topTracksSlice,
  topAlbumsSlice,
  topArtistsSlice,
  setYear,
  setChosenTrack,
  chosenReducer
};
