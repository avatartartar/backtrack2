import React, { useEffect, useState } from 'react';
import { useData } from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";


const ListeningTotalsComp = () => {

    const { sqlDb } = useData();
    const { listeningTime } = useSelector(state => state.query);
    const { year } = useSelector(state => state.chosen);
    const totalMinPlayedQuery = listeningTime.totals;
    const [results, setResults] = useState('');
    const [daysTotal, setDaysTotal] = useState('');
    const [hoursTotal, setHoursTotal] = useState('');
    const [minutesTotal, setMinutesTotal] = useState(null);
    const [totalDuration, setTotalDuration] = useState(null);

    const executeListeningTotals = () => {
        const res = sqlDb.exec(totalMinPlayedQuery);
        setResults(res);
        setDaysTotal(res[0].values[0][0]);
        // setHoursTotal(res[0].values[0][1]);
        setMinutesTotal(res[0].values[0][2]);
        const totalDurationCalc = `${Math.floor(minutesTotal / (24 * 60))} days, ${Math.floor((minutesTotal % (24 * 60)) / 60)} hours, ${minutesTotal % 60} minutes`;
        if (minutesTotal > 0){
            setTotalDuration(totalDurationCalc);
        }
    };

    useEffect(() => {
        if (sqlDb) {
            // console.log(sqlDb)
            executeListeningTotals();
        }
      }, [sqlDb, year]);

    if (totalDuration) {
        return (
            <div className='topAlbumsDisplay' style={{ width: '100%' }}>
                <h3>
                    <div>Total Listening Time{year === 2024 ? ",  All-Time" :`in ${year}`}:</div>
                    <div>{totalDuration}</div>
                    {/* <div>{daysTotal} days</div>
                    <div>or</div>
                    <div>{hoursTotal} hours </div>
                    <div>or</div>
                    <div>{minutesTotal} minutes</div> */}
                </h3>
            </div>
        )
    }
}

export default ListeningTotalsComp;
