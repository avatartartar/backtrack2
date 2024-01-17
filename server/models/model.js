import { createClient } from '@supabase/supabase-js'; // after installing the supabase-js package
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
// we import the getSpotifyToken function from the spotifyTokenRefresh.js file
import { getSpotifyToken } from '../spotifyTokenRefresh.js';

// This loads environment variables from .env.server file.
dotenv.config( { path: './.env.server' } );

// Supabase configuration and connection details.
const supaUrl = process.env.SUPA_URL;
const supaKey = process.env.SUPA_KEY;

// Create Supabase client.
const supabase = createClient(supaUrl, supaKey);
let insertCount = 0;
let recentData;

const model = {};

// a helper function that executes a query callback and returns the data or throws an error
// allows us to avoid repeating the same try/catch block in every model function
const getTrackInfo = async (uri) => {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${uri}?market=US`, {
    method: 'GET',

    // we call the getSpotifyToken function to get the token
    // which is either cached or gets refreshed (so to speak)
    headers: { 'Authorization': 'Bearer ' + await getSpotifyToken() },
  });
  // console.log('getTrackInfo response', response);
  return await response.json();
}


const executeQuery = async (queryCallback) => {
  const { data, error } = await queryCallback(supabase);
  if (error) throw error;
  if (data.length === 0) return [];
  return data;
};

// Consolidated queries down into object of "basic queries" to be change upon project reqs changing
const queries = {
// now querying the Tracks table, rather than a view.
// can replicate this with artists and albums.
  getTopTracks: () => executeQuery(async (supabase) => supabase
    .from('tracks')
    .select('*')
    .order('playtime_ms', { ascending: false })
    .limit(10)
    // Keith 2024-01-14_03-26-PM:
    // the below data we used to get from the api is now in the data base so no need to call the api here, for now.
    // still missing audio_clip_url for some songs. we'll need to make different api queries to get that.
  // ).then(async tracks => {
  //   for (const track of tracks) {
  //     const trackInfo = await getTrackInfo(track.uri);
  //     track.preview = trackInfo.preview_url;
  //     track.albumImage = trackInfo.album.images[1].url;
  //     track.duration = trackInfo.duration_ms;
  //     track.popularity = trackInfo.popularity;
  //     track.explicit = trackInfo.explicit;
  //   }
    // return tracks;
  ),

  getTopArtists: () => executeQuery(async (supabase) => supabase
    .from('artists')
    .select('*')
    .neq('playtime_ms', 0)
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ),

  getTopAlbums: () => executeQuery(async (supabase) => supabase
    .from('albums')
    .select('*')
    .neq('playtime_ms', 0)
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ),

  getSessions: () => executeQuery(async (supabase) => supabase
    .from('sessions')
    .select('artist, track, album, country, dt_added, timefn')
    .limit(10)
  ),
  getFields: () => executeQuery(async (supabase) => supabase
    .from('sessions')
    .select('*')
    .limit(1)
  ),
  //Ross added this to set up a route for front end slider to get tracks by year. commented out part of the query just to test as this query
  //keeps timing out. trying to join the sessions table on sessions.track_id = tracks.id and pull in the sessions.ts field to filter by year
  //downstream

  // Keith 2024-01-16_10-04-PM
  // this works to get the top tracks per year, but the playtime and count data is not returned, oddly.
  getTopTracksByYear: (year) => executeQuery(async (supabase) => supabase
    .from('top_tracks_by_year')
    .select('*')
    .eq('year', year)
    .limit(10)
  )
  // getTopTracksByYear: (year) => executeQuery(async (supabase) => supabase
  //       .from('top_tracks_by_year')
  //       .select('*')
  //       .eq('year', year).then(
  //         async (response) => {
  //           if (response.error) {
  //             throw response.error;
  //           }
  //           // console.log('Data from getTopTracksBYYear query', response.data);
  //           return response.data;
  //         }
  //     )
  // )

  // getTopTracksByYear: async (year) => {
  //   try {
  //     const response = await supabase
  //       .from('top_tracks_by_year')
  //       .select('*')
  //       .eq('year', year);
  //     if (response.error) {
  //       throw response.error;
  //     }
  //     console.log('Data from getTopTracksBYYear query', response.data);
  //     return response.data;

  //     // return response.data;
  //   } catch (error) {
  //     console.error('Error fetching top tracks by year:', error);
  //   }
  // }

};

export { queries };
