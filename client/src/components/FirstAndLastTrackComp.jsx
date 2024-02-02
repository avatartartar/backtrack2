import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useData } from './DataContext.jsx';



const FirstAndLastTrackComp = ({ results }) => {
    const [firstTrack, setFirstTrack] = useState('');
    const [firstArtist, setFirstArtist] = useState('');
    const [lastTrack, setLastTrack] = useState('');
    const [lastArtist, setLastArtist] = useState('');
    const [firstPlay, setFirstPlay] = useState('');
    const [lastPlay, setLastPlay] = useState('');

    const { sqlDb } = useData();
    const { tracks, albums, artists, minutes } = useSelector(state => state.query);
    const firstAndLastQuery = tracks.firstAndLast;

    const executeFirstAndLast = () => {
        console.log('running first and last');
        const res = sqlDb.exec(firstAndLastQuery);
        setFirstTrack(res[0].values[0][1]);
        setFirstArtist(res[0].values[0][2]);
        setFirstPlay(res[0].values[0][4]);
        setLastTrack(res[1].values[0][1]);
        setLastArtist(res[1].values[0][2]);
        setLastPlay(res[1].values[0][4]);
    }

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
                <h3>The first song you ever played, and the last</h3>
                <div className="firstAndLastTrack">
                    <div className='trackImageCard'>
                        <img src="https://upload.wikimedia.org/wikipedia/en/d/d6/RayCharlesGreatestHits_1962ABC.jpg" alt="" width="300px"></img>
                        <h4>{firstTrack}<br /> {firstArtist}<br /> First played on {firstPlay}</h4>
                    </div>
                    <div className='trackImageCard'>
                        <img src="https://f4.bcbits.com/img/a4190282017_10.jpg" alt="" width="500px"></img>
                        <h4>{lastTrack}<br /> {lastArtist} <br /> Last played on {lastPlay}</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default FirstAndLastTrackComp;
