import React, { useEffect, useState } from 'react';

const FirstAndLastTrackComp = ({ results }) => {
    const [firstTrack, setFirstTrack] = useState('');
    const [firstArtist, setFirstArtist] = useState('');
    const [lastTrack, setLastTrack] = useState('');
    const [lastArtist, setLastArtist] = useState('');
    const [firstPlay, setFirstPlay] = useState('');
    const [lastPlay, setLastPlay] = useState('');

    useEffect(() => {
        if (results && results.length > 0 && results[0].values && results[0].values.length > 0) {
            setFirstTrack(results[0].values[0][1]);
            setFirstArtist(results[0].values[0][2]);
            setFirstPlay(results[0].values[0][4]);
            setLastTrack(results[1].values[0][1]);
            setLastArtist(results[1].values[0][2]);
            setLastPlay(results[1].values[0][4]);
        }
    }, [results]);

    return (
        <div className="topAlbumsDisplay">
            <h3>The first song you ever played, and the last</h3>
            <div className="firstAndLastTrack">
            <div>
                <img src="https://upload.wikimedia.org/wikipedia/en/d/d6/RayCharlesGreatestHits_1962ABC.jpg" alt="" width="500px"></img>
                <h4>{firstTrack}<br /> {firstArtist}<br /> Played on {firstPlay}</h4>
            </div>
            <div>
                <img src="https://f4.bcbits.com/img/a4190282017_10.jpg" alt="" width="500px"></img>
                <h4>{lastTrack}<br /> {lastArtist} <br /> Played on {lastPlay}</h4>
            </div>
            </div>
        </div>
    );
}

export default FirstAndLastTrackComp;
