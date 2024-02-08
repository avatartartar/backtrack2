import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { useData } from './DataContext.jsx';
import { setUserTotals } from '../features/slice.js';
import { selectMinutesListened } from '../features/slice.js';

const ListeningTotalsComp = () => {
    const dispatch = useDispatch();
    const { sqlDb, reduxReady } = useData();
    const { year } = useSelector(state => state.chosen);
    const { first: userFirsts, total: userTotals } = useSelector(state => state.user);
    const { year: firstYear } = userFirsts;
    const { minutesListened } = userTotals;
    const { listeningTime } = useSelector(state => state.query);
    const totalMinListenedQuery = listeningTime.totals;
    const [minutesTotal, setMinutesTotal] = useState(null);
    const [totalDuration, setTotalDuration] = useState(null);

    const executeListeningTotals = () => {
        const res = sqlDb.exec(totalMinListenedQuery);
        const minutesTotalResult = res[0].values[0][2];
        setMinutesTotal(minutesTotalResult);
        if (minutesTotalResult > 0) {
            const totalDurationCalc = `${Math.floor(minutesTotalResult / (24 * 60))} days, ${Math.floor((minutesTotalResult % (24 * 60)) / 60)} hours, ${minutesTotalResult % 60} minutes`;
            console.log('totalDurationCalc in executeListeningTotals:', totalDurationCalc);
            console.log('now should dispatch setUserTotals with minutesListened:', minutesTotalResult);
            dispatch(setUserTotals({minutesListened: minutesTotalResult}));
            setTotalDuration(totalDurationCalc);
        }
    };

    useEffect(() => {
        if (sqlDb) {
            console.log('reduxReady true in ListeningTotalsComp');
            console.log('year in ListeningTotalsComp, useEffect:', year);
            console.log('firstYear in ListeningTotalsComp, useEffect:', firstYear);
            executeListeningTotals();
        }
      }, [sqlDb]);

    // if (totalDuration) {
        return (
            <div className='topAlbumsDisplay' style={{ width: '100%' }}>
                <h3>
                    <div>Total Listening Time{year === 2024 ? ",  All-Time" :`in ${year}`}:</div>
                    <div>{totalDuration}</div>
                </h3>
            </div>
        )
    // }
}

export default ListeningTotalsComp;
