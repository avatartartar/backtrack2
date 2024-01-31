import React, { useEffect, useState } from 'react';
import { LabelList, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const VolumePatterns = ({ results }) => {

    if (!results || !results[0] || !results[0].values || results[0].values.length === 0) {
        return <div>No data available</div>;
    }

    const data = results[0].values.map(([month, total_minutes_played]) => ({
        month,
        "Total minutes played": total_minutes_played
    }));

    console.log(data);

    return (
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
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Total minutes played" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default VolumePatterns;
