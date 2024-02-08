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
 * - setChosenYear: Reducer action for setting the year in the chosen slice's state.
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

import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

const chosenSlice = createSlice({
  name: 'chosen',
  initialState: {
    // year: 'allTime',
    year: 2024,
    defaultYear: 'allTime',
    track: {},
    status: "idle",
    error: ""
  },
  reducers: {
    // keys are action types
    // values are action creators
    setChosenYear: (state, action) => {
      if (action.payload === 2024) {
        state.year = state.defaultYear;
     }
      else{
        state.year = action.payload;
      }
    },
    setChosenTrack: (state, action) => {
      state.track = action.payload;
    },
  },
});

// Selectors, which are functions that take the Redux state as an argument
// and return some data to pass to the component.
// in this case, the chosen year from the slider, which is used to filter all of the data subscribed to by the components.
const selectChosenYear = (state) => state.chosen.year;

const selectTopTracks = createSelector(
  [state => state.top.tracks, selectChosenYear],
  (tracks, chosenYear) => {
    const selectedTracks = tracks[chosenYear] || tracks.allTime || [];
    return selectedTracks;
  }
);
const selectTopAlbums = createSelector(
  [state => state.top.albums, selectChosenYear],
  (albums, chosenYear) => {
    const selectedAlbums = albums[chosenYear] || albums.allTime || [];
    return selectedAlbums;
  }
);
const selectTopArtists = createSelector(
  [state => state.top.artists, selectChosenYear],
  (artists, chosenYear) => {
    const selectedArtists = artists[chosenYear] || artists.allTime || [];
    return selectedArtists;
  }
);
const selectTopTracksFirstImage = createSelector(
  [state => state.top.tracks, selectChosenYear],
  (tracks, chosenYear) => {
    const selectedTracks = tracks[chosenYear] || tracks.allTime || [];
    return selectedTracks[0]?.image;
  }
);

const selectMinutesListened = createSelector(
  [state => state.user.total.minutesListened],
  (minutesListened) => {
    return minutesListened || 0;
  }
);

const { reducer: chosenReducer, actions: chosenActions } = chosenSlice;
const { setChosenYear, setChosenTrack } = chosenActions;


const topSlice = createSlice({
  name: 'top',
  initialState: {
    tracks: {},
    albums: {},
    artists: {},
    skippedArtists: {},
    loading: false,
    error: null,
  },
  reducers: {
    setStateFromJson: (state, action) => {
      return action.payload.payload;
    },
  },
  extraReducers: (builder) => {
    builder
  },
});

const { reducer: topReducer, actions: topActions } = topSlice;
const { setStateFromJson } = topActions;


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


const resultsSlice = createSlice({
  name: 'results',
  initialState: {
  all:[],
  recent: [],
  },
  reducers: {
    setResults: (state, action) => {
      console.log('setResults action.payload:', action.payload);
      state.recent = action.payload;
    }
  },
});

const { reducer: resultsReducer, actions: resultsActions } = resultsSlice;
const { setResults } = resultsActions;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: "",
    first: {
      year: "",
      track: "",
      album: "",
      artist: "",
      trackUri: "",
      ts: "",
    },
    last: {
      track: "",
      album: "",
      artist: "",
    },
    total: {
      minutesSinceFirstTrack: "",
      minutesListened: "",
      hoursListened: "",
      daysListened: "",
      pctLifeSinceFirstTrack: "", // minutesSinceFirstTrack / totalminutesListened
      tracksCount: "",
      albumsCount: "",
      artistsCount: "",
      skipsCount: "",
      sessionsCount: "",
    }
  },
  reducers: {
    setUserFirsts: (state, action) => {
      const key = Object.keys(action.payload);
      state.first[key] = action.payload[key];
    },
    setFirstYear: (state, action) => {
      state.first.year = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload.value;
    },
    setUserTotals: (state, action) => {
      const key = Object.keys(action.payload)[0];
      state.total[key] = action.payload[key];
    }
  }
});

const { reducer: userReducer, actions: userActions } = userSlice;
const { setUserFirsts, setFirstYear, setUsername, setUserTotals } = userActions;


export {
  chosenReducer,
  setChosenYear,
  setChosenTrack,
  jsonReducer,
  setJson,
  resultsReducer,
  setResults,
  userReducer,
  setUserFirsts,
  setFirstYear,
  setUsername,
  setUserTotals,
  topReducer,
  selectTopTracks,
  selectTopAlbums,
  selectTopArtists,
  selectTopTracksFirstImage,
  selectMinutesListened,
  setStateFromJson
};
