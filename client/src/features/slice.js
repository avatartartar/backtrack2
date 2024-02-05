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
    results: {
      tracks: {
        allTime: [],
        byYear: []
      },
      albums: {
        allTime: [],
        byYear: []
      },
      artists: {
        allTime: [],
        byYear: []
      }
    }
  },
  reducers: {
    setResults: (state, action) => {
      console.log('setResults action.payload:', action.payload);
      state.recent = action.payload;
      // state.all.push(action.payload);
      // if (action.meta.arg){
      // state.results[action.meta.arg][action.meta.arg2] = action.payload;
      // // state.results[action.meta.arg] = action.payload;
      // }
    }
  },
});

const { reducer: resultsReducer, actions: resultsActions } = resultsSlice;
const { setResults } = resultsActions;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    facts: {
      firstYear: "",
      firstTrack: "",
      firstAlbum: "",
      firstArtist: "",
      firstTrackUri: "",
      firstTs: "",
      lastTrack: "",
      lastAlbum: "",
      lastArtist: "",
      username: "",
      minutesSinceFirstTrack: "",
      totalminutesPlayed: "",
      totalHoursPlayed: "",
      totalDaysPlayed: "",
      pctLifeSinceFirstTrack: "", // minutesSinceFirstTrack / totalminutesPlayed
      totalTracks: "",
      totalAlbums: "",
      totalArtists: "",
      totalSkips: "",
      totalSessions: "",
    }
  },
  reducers: {
    setUserFacts: (state, action) => {
      const key = Object.keys(action.payload)[0];
      state[key] = action.payload[key];
    },
    setFirstYear: (state, action) => {
      state.facts.firstYear = action.payload;
    }
  }
});

const { reducer: userReducer, actions: userActions } = userSlice;
const { setUserFacts, setFirstYear } = userActions;


export {
  setChosenYear,
  setChosenTrack,
  chosenReducer,
  jsonReducer,
  setJson,
  resultsReducer,
  setResults,
  userReducer,
  setUserFacts,
  topReducer,
  selectTopTracks,
  selectTopAlbums,
  selectTopArtists,
  selectTopTracksFirstImage,
  setStateFromJson,
  setFirstYear
};
