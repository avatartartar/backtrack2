import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Created a new slice to use for top ten tracks by year. May want to change tracks to be some sort of Map or object for easy lookup on year.
//This appears to be working. It correctly sends the year to the correct route. Not receiving a response yet as the request keeps timing out at the
//database call in server/models.js

const initialState = {
  year: "All Time",
  tracks: [],
  status: "idle",
  error: ""
};

const fetchTopTenTracksByYear = createAsyncThunk(
  'tracks/fetchTopTenByYear',
  async (year) => {
    try {
      const response = await fetch(`/tracks/top10TracksByYear/?year=${year}`);
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
    setYear: (state, action) => {
      state.year = action.payload;
    },
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
export const { setYear } = topTenTracksByYearSlice.actions;
export { fetchTopTenTracksByYear };
export default topTenTracksByYearSlice.reducer;
