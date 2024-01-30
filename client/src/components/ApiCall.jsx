
import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import initSqlJs from 'sql.js';
import SQLWasm from '/node_modules/sql.js/dist/sql-wasm.wasm';

import { saveAs } from 'file-saver';

import dexdb from './dexdb.js'; // Dexie instance

import { useData } from './DataContext.jsx';

import { getSpotifyToken } from '../features/SpotifyTokenRefresh.js'
// import { getSpotifyToken } from '/Users/home/ptri/backtrack2/server/spotifyTokenRefresh.js'



const ApiCallComp = () => {
  const {
    sqlFile,
    sqlDb,
    setSqlDb,
    sqlDbBool,
    setSqlDbBool,
  } = useData();

  const [tracks, setTracks] = useState([]);


  const fetchTrackData = async (uri) => {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${uri}?market=US`, {
      method: 'GET',
      // we call the getSpotifyToken function to get the token
      // which is either cached or gets refreshed (so to speak)
      headers: { 'Authorization': 'Bearer ' + await getSpotifyToken() },
    });
    // console.log('fetchTrackData response', response);
    const data = await response.json();
    return data;
  }




}


export default ApiCallComp;


// getTopTracks: () => executeQuery(() => supabase
// .from('tracks')
// .select('*')
// .order('playtime_ms', { ascending: false })
// .limit(10)
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
