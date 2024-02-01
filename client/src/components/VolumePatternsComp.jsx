import React, { useEffect, useState } from 'react';
import { LabelList, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const VolumePatternsComp = ({ results }) => {

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

    const data = results[0].values.map(([month, total_minutes_played]) => ({
        month: monthDict[month],
        "Total minutes played": total_minutes_played
    }));

    return (
        <div>
            <h3>TOTAL MINUTES PLAYED, BY MONTH</h3>
            <div style={{ width: '100%', height: 300 }}>
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
                        <Bar dataKey="Total minutes played" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default VolumePatternsComp;