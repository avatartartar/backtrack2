import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Keith 2024-01-15_01-14-PM
// refactored this file to have helper helper fetch and slice functions
// that can be be resued for any slice. reduces code duplication.

const initialState = {
  year: 'all-time',
  arrData: [],
  objData: {},
  status: "idle",
  error: "",
};

const slice = (endpoint, title, filter) => {
  console.log('title in reducerFn:', title);
  const fetchFn = createAsyncThunk(
    `fetch/${title}`,
    async (obj) => {
      let url = `${endpoint}/${title}`;
      console.log('filter:', filter);
      if (filter && obj.query) {
        url = `${endpoint}/${title}${filter}${obj.value}`;
      }
      console.log('url in fetchFn:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch request failed at endpoint ${url}`);
      }
      const responseJson = await response.json();
      return responseJson;
    }
  );


  const reducerFn = createSlice({
    name: title,
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder
        .addCase(fetchFn.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(fetchFn.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (Array.isArray(action.payload)) {
            console.log('action.payload:', action.payload);
            state.arrData = action.payload;
          } else {
            state.objData = action.payload;
          }
          if (title === 'topTracksByYear') {
            state.year = action.meta.arg.value;
            console.log('a', action);
            console.log('action.payload from title conditional', action.payload);
          }
        })
        .addCase(fetchFn.rejected, (state, action) => {
          console.log(`status REJECTED for ${title} in slice.js`);
          state.status = "failed";
          state.error = action.error.message;
        })
    }
  });
  // console.log('slice:', slice);
  // console.log('fetchFn:', fetchFn);
  return { reducerFn, fetchFn };
}
const { reducerFn: topTracksSlice, fetchFn: fetchTopTracks } = slice('/tracks', 'topTracks');
const { reducerFn: topAlbumsSlice, fetchFn: fetchTopAlbums } = slice('/albums', 'topAlbums');
const { reducerFn: topArtistsSlice, fetchFn: fetchTopArtists } = slice('/artists', 'topArtists');
const { reducerFn: topTracksByYearSlice, fetchFn: fetchTopTracksByYear } = slice('/tracks','topTracksByYear', '?year=');


export {
  fetchTopTracks,
  fetchTopAlbums,
  fetchTopArtists,
  fetchTopTracksByYear,
  topTracksSlice,
  topAlbumsSlice,
  topArtistsSlice,
  topTracksByYearSlice,
};
