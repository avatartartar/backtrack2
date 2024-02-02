import React, { useEffect, useState } from 'react';
import { useData } from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";


const TotalMinPlayedComp = () => {

    const { sqlDb } = useData();
    const { tracks, albums, artists, minutes } = useSelector(state => state.query);
    const totalMinPlayedQuery = minutes.total;
    const [results, setResults] = useState('');

    const executeTotalMinPlayed = () => {
        const res = sqlDb.exec(totalMinPlayedQuery);
        setResults(res);
        // setTotalMinPlayed(res);
        // console.log('total min played are ', res)
    };

    useEffect(() => {
        if (sqlDb) {
            // console.log(sqlDb)
            executeTotalMinPlayed();
        }
      }, [sqlDb]);

    if (results && results.length > 0 && results[0].values && results[0].values.length > 0) {
        return (
            <div className='topAlbumsDisplay' style={{ width: '100%' }}>
                <h3>
                    <div>Your total time spent listening is {results[0].values[0][0]} days...</div>
                    <div>or {results[0].values[0][1]} hours... </div>
                    <div> or {results[0].values[0][2]} minutes</div>
                </h3>
            </div>
        )
    }
}

export default TotalMinPlayedComp;
