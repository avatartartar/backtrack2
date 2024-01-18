import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Keith 2024-01-15_01-14-PM
// refactored this file to have helper helper fetch and slice functions
// that can be be resued for any slice. reduces code duplication.

const initialState = {
  arrData: [],
  objData: {},
  status: "idle",
  error: "",
};

const yearSlice = createSlice({
  name: 'year',
  initialState: {
    year: 0,
    default: 'all-time',
    status: "idle",
    error: ""
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
      console.log('yearSlice: state.year:', state.year);
    },
  },
});

const slice = (endpoint, title, filter) => {
  const actions = createAsyncThunk(
    `fetch/${title}`,
    async (obj) => {
      let url = `${endpoint}/${title}`;
      if (filter && obj.query) {
        url = `${endpoint}/${title}${filter}${obj.query}`;
      }
      console.log('fetching:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch request failed at endpoint ${url}`);
      }
      const responseJson = await response.json();
      return responseJson;

    }
  );

  const reducer = createSlice({
    name: title,
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder
        .addCase(actions.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(actions.fulfilled, (state, action) => {
          state.status = "succeeded";

          state.arrData = action.payload;
          if (title.includes('ByYear')) {
            state.year = action.meta.arg.query;
            state.objData[state.year] = action.payload;
          }
          else{
            state.alltime = action.payload;
          }
        })
        .addCase(actions.rejected, (state, action) => {
          console.log(`status REJECTED for ${title} in slice.js`);
          state.status = "failed";
          state.error = action.error.message;
        })
    }
  });

  return { reducer, actions };
}
const { reducer: topTracksSlice, actions: fetchTopTracks } = slice('/tracks', 'topTracks');
const { reducer: topAlbumsSlice, actions: fetchTopAlbums } = slice('/albums', 'topAlbums');
const { reducer: topArtistsSlice, actions: fetchTopArtists } = slice('/artists', 'topArtists');
const { reducer: topAlbumsByYearSlice, actions: fetchTopAlbumsByYear } = slice('/albums','topAlbumsByYear', '?year=');
const { reducer: topArtistsByYearSlice, actions: fetchTopArtistsByYear } = slice('/artists','topArtistsByYear', '?year=');
const { reducer: topTracksByYearSlice, actions: fetchTopTracksByYear } = slice('/tracks','topTracksByYear', '?year=');


const { reducer: yearReducer, actions: yearActions } = yearSlice;
const { setYear } = yearActions;

export {
  fetchTopTracks,
  fetchTopAlbums,
  fetchTopArtists,
  fetchTopTracksByYear,
  fetchTopArtistsByYear,
  topTracksSlice,
  topAlbumsSlice,
  topArtistsSlice,
  topTracksByYearSlice,
  topArtistsByYearSlice,
  setYear,
  yearReducer
};
