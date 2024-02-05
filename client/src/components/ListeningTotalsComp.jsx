import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

import { useData } from './DataContext.jsx';

const ListeningTotalsComp = () => {
    const { sqlDb } = useData();
    const { listeningTime } = useSelector(state => state.query);
    const { year } = useSelector(state => state.chosen);
    const totalMinPlayedQuery = listeningTime.totals;
    const [minutesTotal, setMinutesTotal] = useState(null);
    const [totalDuration, setTotalDuration] = useState(null);

    const executeListeningTotals = () => {
        const res = sqlDb.exec(totalMinPlayedQuery);
        setMinutesTotal(res[0].values[0][2]);
        if (minutesTotal > 0){
            const totalDurationCalc = `${Math.floor(minutesTotal / (24 * 60))} days, ${Math.floor((minutesTotal % (24 * 60)) / 60)} hours, ${minutesTotal % 60} minutes`;
            setTotalDuration(totalDurationCalc);
        }
    };

    useEffect(() => {
        if (sqlDb) {
            executeListeningTotals();
        }
      }, [sqlDb, year]);

    if (totalDuration) {
        return (
            <div className='topAlbumsDisplay' style={{ width: '100%' }}>
                <h3>
                    <div>Total Listening Time{year === 2024 ? ",  All-Time" :`in ${year}`}:</div>
                    <div>{totalDuration}</div>
                </h3>
            </div>
        )
    }
}

export default ListeningTotalsComp;
