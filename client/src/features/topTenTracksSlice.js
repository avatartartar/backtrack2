import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Spotify configuration and connection details.
// const spotifyToken = process.env.REACT_APP_SPOTIFY_TOKEN;
// console.log('spotifyToken', spotifyToken);

const initialState = {
  tracks: [],
  status: "idle",
  error: ""
};


const fetchTopTenTracks = createAsyncThunk(
  'tracks/fetchTopTen',
  async () => {
    try {
      const response = await fetch('/db/top10Tracks');
      const data = await response.json()
      // console.log('fetchTopTenTracks data', data);
      return data;
    } catch (err) {
      console.log(`Error occured during fetchTopTenTracks in topTenTracksSlice: ${err}`);
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
        state.status = "loading";
      })
      .addCase(fetchTopTenTracks.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.tracks = action.payload;
      })
      .addCase(fetchTopTenTracks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

  }
});

export { fetchTopTenTracks };
export default topTenTracksSlice.reducer;
