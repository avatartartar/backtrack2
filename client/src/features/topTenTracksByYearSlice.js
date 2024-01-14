import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Spotify configuration and connection details.
// const spotifyToken = process.env.REACT_APP_SPOTIFY_TOKEN;
// console.log('spotifyToken', spotifyToken);

const initialState = {
  tracks: [],
  status: "idle",
  error: ""
};

const fetchTopTenTracksByYear = createAsyncThunk(
  'tracks/fetchTopTenByYear',
  async (year) => {
    try {
      const response = await fetch(`/db/top10TracksByYear/?year=${year}`);
      const data = await response.json()
      console.log('fetchTopTenTracksByYear data in slice', data);
      return data;
    } catch (err) {
      console.log(`Error occured during fetchTopTenTracks in topTenTracksSlice: ${err}`);
    }
  }
);

export const topTenTracksByYearSlice = createSlice({
  name: 'topTenTracksByYear',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTopTenTracksByYear.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTopTenTracksByYear.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.tracks = action.payload;
      })
      .addCase(fetchTopTenTracksByYear.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

  }
});

export { fetchTopTenTracksByYear };
export default topTenTracksByYearSlice.reducer;