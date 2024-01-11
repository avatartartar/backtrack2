import { createClient } from '@supabase/supabase-js'; // after installing the supabase-js package
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config( { path: './.env.server' } );

// Supabase configuration
const port = process.env.PORT;
const supaUrl = process.env.SUPA_URL;
// const supaUrl = 'https://oqgzfklzchjxycnziuxc.supabase.co';
const supaKey = process.env.SUPA_KEY;

console.log('port', port);  // Outputs: your_port_here
console.log('supaUrl', supaUrl);  // Outputs: your_key_here
console.log('supaKey', supaKey);  // Outputs: your_url_here

const supabase = createClient(supaUrl, supaKey);
let insertCount = 0;
let recentData;

const model = {};

model.get10Sessions = async (req, res, next) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('artist, track, album, country, dt_added, timefn')
    .limit(10);

  if (error) throw error;
  if (data.length === 0) return []; // Return an empty array if the table is empty
  return data; // Return the data
};

model.getTop10Tracks = async (req, res, next) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('artist, track, album, country, dt_added, timefn')
    .limit(10);

  if (error) throw error;
  if (data.length === 0) return []; // Return an empty array if the table is empty
  return data; // Return the data
};

// Function to get column names from the playorder table
model.getColumns = async () => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .limit(1);

  if (error) throw error;
  if (data.length === 0) return []; // Return an empty array if the table is empty
  return Object.keys(data[0]); // Return the column names
};

export default model;

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

//   const columnNames = await getColumns();


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
