import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const FirstAndLastTrackComp = ({ results }) => {
    const { year } = useSelector(state => state.chosen);
    const [firstTrack, setFirstTrack] = useState('');
    const [lastTrack, setLastTrack] = useState('');

    console.log(results);
    return (
        <div>
            <h3>First and Last Track</h3>
            <div>
                <img src=""></img>
                <h4>{ } Track name<br /> { } Artist Name</h4>
            </div>
            <div>
                <img src=""></img>
                <h4>{ } Track name<br /> { } Artist Name</h4>
            </div>
        </div>
    )
}

export default FirstAndLastTrackComp;
