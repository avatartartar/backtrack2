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

const chosenSlice = createSlice({
  name: 'chosen',
  initialState: {
    year: 0,
    defaultYear: 'all-time',
    track: {
      name: "Innerbloom",
      image: "https://i.scdn.co/image/ab67616d00001e0260e5059dcab339142d7642bb",
      artistName: "Rüfüs Du Sol",
      albumName: "Bloom",
    },
    topTracks: [
      {
          "id": 173951,
          "name": "Innerbloom",
          "artist_id": 991,
          "artist_name": "RÜFÜS DU SOL",
          "album_id": 9777,
          "album_name": "Bloom",
          "playtime_ms": 91554472,
          "playtime_minutes": 1525,
          "plays": 298,
          "skips": 8,
          "last_updated": null,
          "uri": "6CGMZijOAZvTXG21T8t6R0",
          "audio_clip_url": "https://p.scdn.co/mp3-preview/ef46ea22943e90da37c6a9d0d16efa872411fbcd?cid=5e8a637ef19a471f918c9682636ab427",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e0260e5059dcab339142d7642bb",
          "popularity": 76,
          "duration_ms": 578040,
          "api_data_added": true,
          "album_uri": "4EAehCii5lZgeewct1LA5p",
          "artist_uri": "5Pb27ujIyYb33zBqVysBkj"
      },
      {
          "id": 172702,
          "name": "Cold Little Heart",
          "artist_id": 4007,
          "artist_name": "Michael Kiwanuka",
          "album_id": 10273,
          "album_name": "Love & Hate",
          "playtime_ms": 72784310,
          "playtime_minutes": 1213,
          "plays": 219,
          "skips": 9,
          "last_updated": null,
          "uri": "0qprlw0jfsW4H9cG0FFE0Z",
          "audio_clip_url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/00/c1/ff/00c1ffdd-8e91-a838-e9cc-2b363c6bc763/mzaf_5700383525985384309.plus.aac.ep.m4a",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e021070095e88dce90a090171b5",
          "popularity": 68,
          "duration_ms": 597600,
          "api_data_added": true,
          "album_uri": "0qxsfpy2VU0i4eDR9RTaAU",
          "artist_uri": "0bzfPKdbXL5ezYW2z3UGQj"
      },
      {
          "id": 173361,
          "name": "Open Eye Signal",
          "artist_id": 1534,
          "artist_name": "Jon Hopkins",
          "album_id": 6376,
          "album_name": "Immunity",
          "playtime_ms": 68397135,
          "playtime_minutes": 1139,
          "plays": 344,
          "skips": 43,
          "last_updated": null,
          "uri": "6wMTeVootJ8RdCLNOZy5Km",
          "audio_clip_url": "https://p.scdn.co/mp3-preview/8be84dff9a174bc14c01c66fd7c63a9a7bc9e24c?cid=5e8a637ef19a471f918c9682636ab427",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e02235e762de339c6076aa824dd",
          "popularity": 48,
          "duration_ms": 468586,
          "api_data_added": true,
          "album_uri": "1rxWlYQcH945S3jpIMYR35",
          "artist_uri": "7yxi31szvlbwvKq9dYOmFI"
      },
      {
          "id": 174842,
          "name": "Needed Me",
          "artist_id": 4973,
          "artist_name": "Rihanna",
          "album_id": 2012,
          "album_name": "ANTI (Deluxe)",
          "playtime_ms": 68044314,
          "playtime_minutes": 1134,
          "plays": 479,
          "skips": 9,
          "last_updated": null,
          "uri": "4pAl7FkDMNBsjykPXo91B3",
          "audio_clip_url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/ee/04/71/ee047178-887c-8782-0da2-5ac534aa6a8b/mzaf_9939519010949651839.plus.aac.ep.m4a",
          "explicit": true,
          "image_url": "https://i.scdn.co/image/ab67616d00001e0233c6b920eabcf4c00d7a1093",
          "popularity": 85,
          "duration_ms": 191600,
          "api_data_added": true,
          "album_uri": "4UlGauD7ROb3YbVOFMgW5u",
          "artist_uri": "5pKCCKE2ajJHZ9KAiaK11H"
      },
      {
          "id": 164022,
          "name": "A New Error",
          "artist_id": 3296,
          "artist_name": "Moderat",
          "album_id": 7298,
          "album_name": "Moderat",
          "playtime_ms": 65984815,
          "playtime_minutes": 1099,
          "plays": 375,
          "skips": 53,
          "last_updated": null,
          "uri": "1fmoCZ6mtMiqA5GHWPcZz9",
          "audio_clip_url": "https://p.scdn.co/mp3-preview/bd95b91e5199ea14d7f63aa3f0d855b565ecdc34?cid=5e8a637ef19a471f918c9682636ab427",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e0227ce0e73b9cf23e8e22ebfe4",
          "popularity": 62,
          "duration_ms": 367306,
          "api_data_added": true,
          "album_uri": "2HEh23ogCT3wiYfag2iMxD",
          "artist_uri": "2exkZbmNqMKnT8LRWuxWgy"
      },
      {
          "id": 169953,
          "name": "Daydreamer - Gryffin Remix",
          "artist_id": 4260,
          "artist_name": "Bipolar Sunshine",
          "album_id": 5393,
          "album_name": "Beach Bar",
          "playtime_ms": 61957010,
          "playtime_minutes": 1032,
          "plays": 366,
          "skips": 6,
          "last_updated": null,
          "uri": "587iEBVD1EfCe7n45Y4SZP",
          "audio_clip_url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/26/d0/f9/26d0f9fc-bd13-9c5c-90e4-54a9454ad0f1/mzaf_16469622375669652063.plus.aac.ep.m4a",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e02fdcc184078a2f7fc42f5840e",
          "popularity": 33,
          "duration_ms": 251027,
          "api_data_added": true,
          "album_uri": "6iZCUbQE7xJnFxjHyDpVqs",
          "artist_uri": "0CjWKoS55T7DOt0HJuwF1H"
      },
      {
          "id": 159894,
          "name": "Two Bodies",
          "artist_id": 2561,
          "artist_name": "Flight Facilities",
          "album_id": 2103,
          "album_name": "Down To Earth",
          "playtime_ms": 58950285,
          "playtime_minutes": 982,
          "plays": 353,
          "skips": 7,
          "last_updated": null,
          "uri": "3WqifovLWUQICYOAad0aNP",
          "audio_clip_url": "https://p.scdn.co/mp3-preview/951d432c8ddfca2b4fa6da1855d13f8ae212a864?cid=5e8a637ef19a471f918c9682636ab427",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e02e040d158ab507a5fc62638ea",
          "popularity": 43,
          "duration_ms": 368346,
          "api_data_added": true,
          "album_uri": "5V8798yQx7GwVCXQTyIOJz",
          "artist_uri": "1lc8mnyGrCLtPhCoWjRxjM"
      },
      {
          "id": 172880,
          "name": "Ultralight Beam",
          "artist_id": 4314,
          "artist_name": "Kanye West",
          "album_id": 6117,
          "album_name": "The Life Of Pablo",
          "playtime_ms": 57813893,
          "playtime_minutes": 963,
          "plays": 370,
          "skips": 8,
          "last_updated": null,
          "uri": "1eQBEelI2NCy7AUTerX0KS",
          "audio_clip_url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/1c/4f/84/1c4f84fa-5152-4930-61a4-6a4130b8640f/mzaf_72321694340480158.plus.aac.ep.m4a",
          "explicit": true,
          "image_url": "https://i.scdn.co/image/ab67616d00001e022a7db835b912dc5014bd37f4",
          "popularity": 73,
          "duration_ms": 320680,
          "api_data_added": true,
          "album_uri": "7gsWAHLeT0w7es6FofOXk1",
          "artist_uri": "5K4W6rqBFWDnAN6FQUkS6x"
      },
      {
          "id": 162853,
          "name": "Party Monster",
          "artist_id": 1616,
          "artist_name": "The Weeknd",
          "album_id": 6621,
          "album_name": "Starboy",
          "playtime_ms": 54801508,
          "playtime_minutes": 913,
          "plays": 353,
          "skips": 10,
          "last_updated": null,
          "uri": "4F7A0DXBrmUAkp32uenhZt",
          "audio_clip_url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/f6/24/aa/f624aaa6-32b5-021f-6c7d-1ee9ceb99224/mzaf_2995226288921259077.plus.aac.ep.m4a",
          "explicit": true,
          "image_url": "https://i.scdn.co/image/ab67616d00001e024718e2b124f79258be7bc452",
          "popularity": 84,
          "duration_ms": 249213,
          "api_data_added": true,
          "album_uri": "2ODvWsOgouMbaA5xf0RkJe",
          "artist_uri": "1Xyo4u8uXC1ZmMpatF05PJ"
      },
      {
          "id": 170580,
          "name": "Until the Sun Needs to Rise",
          "artist_id": 991,
          "artist_name": "RÜFÜS DU SOL",
          "album_id": 9777,
          "album_name": "Bloom",
          "playtime_ms": 53447245,
          "playtime_minutes": 890,
          "plays": 306,
          "skips": 3,
          "last_updated": null,
          "uri": "31POmfMW3ebBiqriWIeNIc",
          "audio_clip_url": "https://p.scdn.co/mp3-preview/8d8331ae54c02e8ca90555f275c0979b9ab577d7?cid=5e8a637ef19a471f918c9682636ab427",
          "explicit": false,
          "image_url": "https://i.scdn.co/image/ab67616d00001e022b4a6961af25f0ccb808d36f",
          "popularity": 64,
          "duration_ms": 292044,
          "api_data_added": true,
          "album_uri": "1SR9xhoYg57S95GDFpyQGT",
          "artist_uri": "5Pb27ujIyYb33zBqVysBkj"
      }
  ],
    status: "idle",
    error: ""
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
      // console.log('nowSlice: state.chosen:', state.year);
    },
    setChosenTrack: (state, action) => {
      state.track = action.payload;
      // console.log('nowSlice: state.track:', state.track);
    },
    setTopTracks: (state, action) => {
      state.topTracks = action.payload;
      // console.log('nowSlice: state.topTracks:', state.topTracks);
    }
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
          // this catches the case where the data is an array or an object
          if (Array.isArray(action.payload)) {
            state.arrData = action.payload;
          } else {
            state.objData = action.payload;
          }
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


const { reducer: chosenReducer, actions: chosenActions } = chosenSlice;
const { setYear, setChosenTrack, setTopTracks } = chosenActions;

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
  topAlbumsByYearSlice,
  setYear,
  setChosenTrack,
  setTopTracks,
  chosenReducer
};
