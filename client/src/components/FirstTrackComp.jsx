import React, { useEffect, useState } from 'react';

const FirstTrackComp = ({ results }) => {
    const [firstTrack, setFirstTrack] = useState('');
    const [firstArtist, setFirstArtist] = useState('');
    const [firstPlay, setFirstPlay] = useState('');


    useEffect(() => {
        if (results && results.length > 0 && results[0].values && results[0].values.length > 0) {
            setFirstTrack(results[0].values[0][1]);
            setFirstArtist(results[0].values[0][2]);
            setFirstPlay(results[0].values[0][4]);

        }
    }, [results]);

    return (
        <div className="topAlbumsDisplay">
            <h3>The first track you ever played</h3>
            <div className="firstAndLastTrack">
            <div className='trackImageCard'>
                <img src="https://upload.wikimedia.org/wikipedia/en/d/d6/RayCharlesGreatestHits_1962ABC.jpg" alt="" width="300px"></img>
                <h4>{firstTrack}<br /> {firstArtist}<br /> First played on {firstPlay}</h4>
            </div>
            </div>
        </div>
    );
}

export default FirstTrackComp;
