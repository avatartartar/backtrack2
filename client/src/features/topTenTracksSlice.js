import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Spotify configuration and connection details.
// const spotifyToken = process.env.REACT_APP_SPOTIFY_TOKEN;
// console.log('spotifyToken', spotifyToken);

const initialState = {
  tracks: [],
  status: "idle",
  error: ""
};

// Keith 2024-01-14_03-28-PM: added in new Error and throwing the error below.
// should allow for site to still load even if the fetch request fails.
const fetchTopTenTracks = createAsyncThunk(
  'tracks/fetchTopTen',
    async () => {
      try {
        const response = await fetch('/tracks/top10Tracks');
        if (!response.ok) {
          console.log('Response not okay:', await response.text());
          throw new Error('Fetch request failed in fetchTopTenTracks in topTenTracksSlice.');
        }
        const data = await response.json()
        // console.log('topTenTracksSlice data', data);
        return data;
      } catch (err) {
        console.log(`Error occurred during fetchTopTenTracks in topTenTracksSlice: ${err}`);
        throw err;
      }
  }
);

export const topTenTracksSlice = createSlice({
  name: 'topTenTracks',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTopTenTracks.pending, (state, action) => {
        // console.log('action.payload pending', action);
        state.status = "loading";
      })
      .addCase(fetchTopTenTracks.fulfilled, (state, action) => {
        // console.log('action.payload succeeded', action);
        state.status = "succeeded"
        state.tracks = action.payload;
      })
      .addCase(fetchTopTenTracks.rejected, (state, action) => {
        console.log('action.payload rejected', action);
        state.status = "failed";
        state.error = action.error.message;
      })
  }
});

export { fetchTopTenTracks };
export default topTenTracksSlice.reducer;
