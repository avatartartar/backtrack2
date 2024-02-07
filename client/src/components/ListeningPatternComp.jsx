import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from './DataContext.jsx';
import { useSelector } from "react-redux";


const ListeningPatternComp = () => {

    const { sqlDb } = useData();
    const [results, setResults] = useState('');
    const { listeningTime } = useSelector(state => state.query);
    const { year } = useSelector(state => state.chosen);
    const listeningPatternDays = listeningTime.daysByMonth;
    // const listeningPatternHours = listeningTime.hoursByMonth;
    // const listeningPatternMinutes = listeningTime.minutesByMonth;

    const executeListeningPattern = () => {
        const res = sqlDb.exec(listeningPatternDays);
        // setListeningPattern(res);
        setResults(res);
        // console.log('listening pattern:', res);
    };

    useEffect(() => {
        if (sqlDb) {
            executeListeningPattern();
        }
    }, [sqlDb]);

    const monthDict = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    }

    if (!results || !results[0] || !results[0].values || results[0].values.length === 0) {
        return <div>No data available</div>;
    }

    const data = results[0].values.map(([month, total_days_played]) => ({
        month: monthDict[month],
        "Total days played": total_days_played
    }));

    return (
        <div style={{ width: '90%', margin: '0 auto', textAlign: 'center' }}>
            <h3>Total Days Listened, By Month, {year === 2024 ? "All-Time" :`in ${year}`}</h3>
            <div style={{ width: '80%', margin: 'auto', height: '300px' }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: '#FFFFFF' }}
                            tick={{ fill: '#FFFFFF' }}
                        />
                        <YAxis
                            axisLine={{ stroke: '#FFFFFF' }}
                            tick={{ fill: '#FFFFFF' }}
                        />
                        <Tooltip />
                        <Bar dataKey="Total days played" fill="#04a8b4" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ListeningPatternComp;
