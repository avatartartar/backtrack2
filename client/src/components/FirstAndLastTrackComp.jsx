import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const FirstAndLastTrackComp = ({ results }) => {
    const { year } = useSelector(state => state.chosen);
    const [firstTrack, setFirstTrack] = useState('');
    const [firstArtist, setFirstArtist] = useState('');
    const [lastTrack, setLastTrack] = useState('');
    const [lastArtist, setLastArtist] = useState('');

    useEffect(() => {
        if (results && results.length > 0 && results[0].values && results[0].values.length > 0) {
            setFirstTrack(results[0].values[0][1]);
            setFirstArtist(results[0].values[0][2]);
            setLastTrack(results[1].values[0][1]);
            setLastArtist(results[1].values[0][2]);
        }
    }, [results]);

    return (
        <div className="topAlbumsDisplay">
            <h3>First and Last Track</h3>
            <div>
                <img src="" alt=""></img>
                <h4>{firstTrack}<br /> {firstArtist}</h4>
            </div>
            <div>
                <img src="" alt=""></img>
                <h4>{lastTrack}<br /> {lastArtist}</h4>
            </div>
        </div>
    );
}

export default FirstAndLastTrackComp;
