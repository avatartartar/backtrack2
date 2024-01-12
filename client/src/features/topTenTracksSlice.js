import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  songs: [],
  status: "idle",
  error: ""
};

const fetchTopTenTracks = createAsyncThunk(
  'tracks/fetchTopTen',
  async () => {
    try {
      const response = await fetch('http://localhost:8000/db/top10Track');
      console.log('response.data in fetchTopTenTracks:', response);
      return response.data;
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
        state.songs = action.payload;
      })
      .addCase(fetchTopTenTracks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

  }
});

export { fetchTopTenTracks };
export default topTenTracksSlice.reducer;