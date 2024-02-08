import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useData } from './DataContext.jsx';
import { getSpotifyToken } from "../features/getSpotifyToken.js";
import albumPlaceholder from '../../assets/albumPlaceholder.jpg';



const FirstAndLastTrackComp = ({ results }) => {
    const [firstTrack, setFirstTrack] = useState('');
    const [firstArtist, setFirstArtist] = useState('');
    const [lastTrack, setLastTrack] = useState('');
    const [lastArtist, setLastArtist] = useState('');
    const [firstPlay, setFirstPlay] = useState('');
    const [lastPlay, setLastPlay] = useState('');
    const [firstURI, setFirstURI] = useState('');
    const [firstURL, setFirstURL] = useState('');
    const [lastURL, setLastURL] = useState('');

    const { sqlDb } = useData();
    const { tracks } = useSelector(state => state.query);
    const firstAndLastQuery = tracks.firstAndLast;

    const executeFirstAndLast = async () => {
        console.log('running first and last');
        const res = sqlDb.exec(firstAndLastQuery);
        setFirstTrack(res[0].values[0][1]);
        setFirstArtist(res[0].values[0][2]);
        setFirstPlay(res[0].values[0][4]);

        // console.log(`first uri is `, firstURI);
        // const firstTrackData = await getTrackInfo(res[0].values[0][5]);
        // setFirstURL(firstTrackData.album.images[0].url)

        setLastTrack(res[1].values[0][1]);
        setLastArtist(res[1].values[0][2]);
        setLastPlay(res[1].values[0][4]);

        // console.log(`last uri is `, lastURI);
        // const lastTrackData = await getTrackInfo(res[1].values[0][5]);
        // console.log('album data is ', trackData.album.images[0].url);
        // setLastURL(lastTrackData.album.images[0].url)


    }

    const getTrackInfo = async (uri, retries = 5) => {
        try {
          // Send a GET request to the Spotify API to fetch track information
          const response = await fetch(`https://api.spotify.com/v1/tracks/${uri}?market=US`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + await getSpotifyToken(),
            },
          });

          if (!response.ok) {

            // 429 is the status code for rate limit hit
            // retries > 0: if we have retries left, we'll wait for the specified time and then retry the request
            if (response.status === 429 && retries > 0) {

              // Retry-After header is given by the Spotify API to indicate the time after which we can retry the request
              // Parses the value of the 'Retry-After' header from the response, converts it to an integer
              const retryAfter = parseInt(response.headers.get('Retry-After'), 10);
              console.log(`Rate limit hit, retrying after ${retryAfter} seconds.`);

            // Waits for a given time (in seconds) by using a Promise and setTimeout.
            // The resolve function is called after the specified time has passed.
            // The time is calculated by multiplying the value of retryAfter by 1000 to get seconds from ms, and adding 1 second for safety.
              await new Promise(resolve => setTimeout(resolve, (retryAfter + 1) * 1000));
              return getTrackInfo(uri, retries - 1); // Retry the request and decrement the number of retries left, though that number is of our own making. Often 3 apparently.
            }
            // console.log('response.headers', response.headers);
            throw new Error(`Fetch request failed with status ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error(`Error fetching data for URI ${uri}:`, error);
          throw error; // Rethrow to handle it in the calling context
        }
      };

    useEffect(() => {
        if (sqlDb) {
            // console.log(sqlDb)
            executeFirstAndLast();
        }
        // if (results && results.length > 0 && results[0].values && results[0].values.length > 0) {
        //     setFirstTrack(results[0].values[0][1]);
        //     setFirstArtist(results[0].values[0][2]);
        //     setFirstPlay(results[0].values[0][4]);
        //     setLastTrack(results[1].values[0][1]);
        //     setLastArtist(results[1].values[0][2]);
        //     setLastPlay(results[1].values[0][4]);
        // }
    }, [sqlDb]);

    if (firstTrack && firstArtist && firstPlay && lastTrack && lastArtist && lastPlay) {
        return (
            <div className="topAlbumsDisplay">
                <h3>The first song you ever played, and the last:</h3>
                <div className="firstAndLastTrack">
                    <div className='trackImageCard'>
                        {/* <img src={firstURL} alt="" width="300px"></img> */}
                        <img src={albumPlaceholder} alt="" width="300px"></img>
                        <h4>{firstTrack}<br /> {firstArtist}<br /> First played on {firstPlay}</h4>
                    </div>
                    <div className='trackImageCard'>
                        {/* <img src={lastURL} alt="" width="500px"></img> */}
                        <img src={albumPlaceholder} alt="" width="300px"></img>
                        <h4>{lastTrack}<br /> {lastArtist} <br /> Last played on {lastPlay}</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default FirstAndLastTrackComp;
