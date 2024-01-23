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

const handleRequest = async (modelFunction, req, res) => {
  try {
    const data = await modelFunction();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const executeQuery = async (queryCallback) => {
  const { data, error } = await queryCallback(supabase);
  if (error) throw error;
  if (data.length === 0) return [];
  return data;
};

// Consolidated models down into object of "models" to be change upon project reqs changing
const models = {
// now querying the Tracks table, rather than a view.
// can replicate this with artists and albums.
  getTopTracks: () => executeQuery(() => supabase
    .from('tracks')
    .select('*')
    .order('playtime_ms', { ascending: false })
    .limit(10)
    // Keith 2024-01-14_03-26-PM:
    // the below data we used to get from the api is now in the data base so no need to call the api here, for now.
    // still missing audio_clip_url for some songs. we'll need to make different api models to get that.
  // ).then(() tracks => {
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

  getTopArtists: () => executeQuery(() => supabase
    .from('artists')
    .select('*')
    .neq('playtime_ms', 0)
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ),

  getTopAlbums: () => executeQuery(() => supabase
    .from('albums')
    .select('*')
    .neq('playtime_ms', 0)
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ),

  getTopArtistsByYear: (year) => executeQuery(() => supabase
    .from('top_artists_by_year')
    .select('*')
    .eq('year', year)
  ),

  getTopAlbumsByYear: (year) => executeQuery(() => supabase
    .from('top_albums_by_year')
    .select('*')
    .eq('year', year)
  ),

  getTopTracksByYear: (year) => executeQuery(() => supabase
    .from('top_tracks_by_year')
    .select('*')
    .eq('year', year)
  ),

  getTopArtistsByYearByMonth: (year) => executeQuery(() => supabase
    .from('top_artists_by_year_month')
    .select('*')
    .eq('year', year)
  ),

  getTopAlbumsByYearByMonth: (year) => executeQuery(() => supabase
    .from('top_albums_by_year_month')
    .select('*')
    .eq('year', year)
  ),

  getTopTracksByYearByMonth: (year) => executeQuery(() => supabase
    .from('top_tracks_by_year_month')
    .select('*')
    .eq('year', year)
  ),

  getAlbumImageUrl: (albumNameArray) => executeQuery(() => supabase
    .from('tracks')
    .select('album_name, image_url')
    .in('album_name', albumNameArray)
  )

  // Old query to get Top10TracksForYear. Does not use views.

  // getTop10TracksForYear: (year) =>
  //   executeQuery(async (supabase) => supabase
  //     .from('sessions')
  //     .select(`
  //       track_name,
  //       artist_name,
  //       album_name,
  //       ms_played,
  //       sesh_year
  //     `)
  //     .eq('sesh_year', year)
  //     .gte('ms_played', 60000)
  //     .order('ms_played', { ascending: false })
  //     ).then(tracks => tracks),

};

export { models };
