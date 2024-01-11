import { createClient } from '@supabase/supabase-js'; // after installing the supabase-js package
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config( { path: './.env.server' } );

// Supabase configuration
const supaUrl = process.env.SUPA_URL;
const supaKey = process.env.SUPA_KEY;

const supabase = createClient(supaUrl, supaKey);
let insertCount = 0;
let recentData;

const model = {};

// a helper function that executes a query callback and returns the data or throws an error
// allows us to avoid repeating the same try/catch block in every model function
const executeQuery = async (queryCallback) => {
  const { data, error } = await queryCallback(supabase);
  if (error) throw error;
  if (data.length === 0) return [];
  return data;
};


model.getTop10Tracks = () => executeQuery(async (supabase) => {
  return supabase
  // a view in supabase
    .from('top10_tracks')
    .select('*');
});

model.getTop10Artists = () => executeQuery(async (supabase) => {
  return supabase
  // a view in supabase
    .from('top10_artists')
    .select('*');
});

model.getTop10Albums = () => executeQuery(async (supabase) => {
  return supabase
  // a view in supabase
    .from('top10_albums')
    .select('*');
});

// Sample function to get 10 records
model.get10Sessions = () => executeQuery(async (supabase) => {
  return supabase
    .from('sessions')
    .select('artist, track, album, country, dt_added, timefn')
    .limit(10);
});

// get field names
model.getFields = () => executeQuery(async (supabase) => {
  return supabase
    .from('sessions')
    .select('*')
    .limit(1);
});

export default model;


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
