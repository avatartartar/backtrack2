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
    // Keith/spotifyTokenIntegration: 2024-01-13
    // we now call the getSpotifyToken function to get the token
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
  getTop10Tracks: () => executeQuery(async (supabase) => supabase
    .from('tracks')
    .select('*')
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ).then(async tracks => {
    for (const track of tracks) {
      const trackInfo = await getTrackInfo(track.uri);
      track.preview = trackInfo.preview_url;
      track.albumImage = trackInfo.album.images[1].url;
      track.duration = trackInfo.duration_ms;
      track.popularity = trackInfo.popularity;
      track.explicit = trackInfo.explicit;
    }
    return tracks;
  }),

  // Keith/spotifyTokenIntegration: 2024-01-13
  // topArtists and Albums updated by James in supabase.
  // queries now updated here to take advantage of the new tables.

  getTop10Artists: () => executeQuery(async (supabase) => supabase
    .from('artists')
    .select('*')
    .neq('playtime_ms', 0)
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ),

  getTop10Albums: () => executeQuery(async (supabase) => supabase
    .from('albums')
    .select('*')
    .neq('playtime_ms', 0)
    .order('playtime_ms', { ascending: false })
    .limit(10)
  ),

  get10Sessions: () => executeQuery(async (supabase) => supabase
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
  getTop10TracksByYear: () => 
    executeQuery(async (supabase) => supabase
    .from('tracks')
    .select(`
      name, 
      artist_name, 
      album_name, 
      playtime_ms,
      sessions (
        ts,
        track_id
        )
    `)
    .order('playtime_ms', { ascending: false })
    .limit(100)
    ).then(tracks => tracks)
  //   .then(async tracks => {
  //   for (const track of tracks) {
  //     const trackInfo = await getTrackInfo(track.uri);
  //     track.preview = trackInfo.preview_url;
  //     track.albumImage = trackInfo.album.images[1].url;
  //     track.duration = trackInfo.duration_ms;
  //     track.popularity = trackInfo.popularity;
  //     track.explicit = trackInfo.explicit;
  //   }
  //   return tracks;
  // })
};


export { queries };


// model.getTop10Tracks = async () => {
//   const { data, error } = await supabase
//     .from('sessions')
//     .select('track, count(track) as play_count')
//     .gte('ms_played', 60000) // 60000 milliseconds = 1 minute
//     .group('track')
//     .order('play_count', { ascending: false })
//     .limit(10);

//   if (error) throw error;
//   if (data.length === 0) return []; // Return an empty array if the table is empty
//   return data; // Return the data
// };

// Function to insert data into the database
// const insertData = async (data, columns) => {
//   const mappedData = {
//     artist: data.master_metadata_album_artist_name,
//     track: data.master_metadata_track_name,
//     album: data.master_metadata_album_album_name,
//     country: data.conn_country,
//     dt_added: new Date().toISOString().slice(0, 19).replace('T', ' '),
//     // Add other mappings here
//   };

//   // Add keys from data to mappedData if they are not already in mappedData and they match a column name
//   for (const key in data) {
//     if (!mappedData.hasOwnProperty(key) && columns.includes(key)) {
//       mappedData[key] = data[key];
//     }
//   }

//   const { data: insertedData, error } = await supabase
//     .from('playorder')
//     .insert([mappedData]);

//   if (error) throw error;
//   return insertedData;
// };

// Read and parse the JSON file
// const importJsonData = async (filePath) => {
//   const fileContent = fs.readFileSync(filePath, 'utf8');
//   const json = JSON.parse(fileContent);

//   const columnNames = await getFields();


//   for (const item of json) {
//     recentData = item;
//     await insertData(item, columns);
//     insertCount++;

//     if (insertCount % 500 === 0) {
//       console.log('Insert count:', insertCount);
//     }
//   }
// };// Read and parse all JSON files in the provided directory, which should be the spotify extended history directory
// const importJsonDataFromDirectory = async (directoryPath) => {
//   const fileNames = fs.readdirSync(directoryPath);

//   for (const fileName of fileNames) {
//     // only import the files that start with 'Streaming_History_Audio_'
//     if (fileName.startsWith('Streaming_History_Audio_')){
//     const filePath = path.join(directoryPath, fileName);
//     console.log('Importing file:', fileName);
//     await importJsonData(filePath);
//     }
//   }
// };

// importJsonDataFromDirectory('/Users/home/Downloads/spotifyExtendedStreamingHistory/parts')
//   .then(() => console.log('Data import complete.'))
//   .catch((err) => console.error('Error importing data:', err), console.log('lastItem inserted:', recentData));
